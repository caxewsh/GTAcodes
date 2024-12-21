import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Pressable, Animated, Alert } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { supabase } from '../../../utils/supabase';
import CheatFilters from '../../../components/CheatFilters';
import { colors, spacing, typography, borderRadius, shadows } from '../../../constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import LikesLimitTooltip from '../../../components/LikesLimitTooltip';
import { useLikedCodes } from '../../../hooks/useLikedCodes';

interface CheatCode {
  cheatName: string;
  cheatCode: string;
  cheatCategory: string;
}

const MAX_FREE_LIKES = 10;
const isPremium = false; // We'll replace this with real premium check later

export default function GameCheatScreen() {
  const { game, platform } = useLocalSearchParams();
  const navigation = useNavigation();
  const [cheats, setCheats] = useState<CheatCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { likedCodes, addLikedCode, removeLikedCode, isCodeLiked, initializeLikedCodes } = useLikedCodes();
  const [likingInProgress, setLikingInProgress] = useState<string | null>(null);

  React.useLayoutEffect(() => {
    if (game && navigation) {
      navigation.setOptions({
        headerTitle: `Codes ${game}`,
        headerBackTitle: 'Retour',
        headerRight: () => (
          <View style={styles.headerRight}>
            <Ionicons 
              name="heart" 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.likesCount}>
              {likedCodes.length}{!isPremium && `/${MAX_FREE_LIKES}`}
            </Text>
            <LikesLimitTooltip />
          </View>
        ),
      });
    }
  }, [game, navigation, likedCodes.length]);

  const filteredCheats = selectedCategory
    ? cheats.filter(cheat => cheat.cheatCategory === selectedCategory)
    : cheats;

  const likeCountsRef = useRef<{ [key: string]: number }>({});
  const scaleAnimsRef = useRef<{ [key: string]: Animated.Value }>({});

  const formatLikeCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const animateHeart = (codeId: string) => {
    if (!scaleAnimsRef.current[codeId]) {
      scaleAnimsRef.current[codeId] = new Animated.Value(1);
    }
    
    Animated.sequence([
      Animated.spring(scaleAnimsRef.current[codeId], {
        toValue: 1.2,
        friction: 5,
        tension: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimsRef.current[codeId], {
        toValue: 1,
        friction: 5,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLike = async (code: any) => {
    if (likingInProgress === code.cheatName) return;
    
    const isLiked = isCodeLiked(code.cheatName);
    
    if (!isPremium && !isLiked && likedCodes.length >= MAX_FREE_LIKES) {
      Alert.alert(
        'Limite atteinte',
        'Passez à la version premium pour sauvegarder plus de favoris !',
        [
          { text: 'Plus tard' },
          { 
            text: 'Débloquer (0,99 €)', 
            onPress: () => {
              // TODO: Implement premium purchase
              console.log('Premium purchase clicked');
            } 
          }
        ]
      );
      return;
    }
    
    try {
      setLikingInProgress(code.cheatName);
      Haptics.selectionAsync();
      animateHeart(code.cheatName);
      
      if (isLiked) {
        await removeLikedCode(code.cheatName);
      } else {
        await addLikedCode({
          id: code.cheatName,
          title: code.cheatName,
          code: code.cheatCode,
          game: game as string,
        });
      }
    } catch (error) {
      console.error('Error handling like:', error);
      Alert.alert('Erreur', "Impossible de sauvegarder le like");
    } finally {
      setLikingInProgress(null);
    }
  };

  useEffect(() => {
    const fetchCheats = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('Cheats')
          .select('cheatName, cheatCode, cheatCategory')
          .eq('game', game)
          .eq('platform', platform);

        if (error) {
          console.error('Error fetching cheats:', error);
          setCheats([]);
        } else {
          setCheats(data || []);
          // Initialize random like counts
          data?.forEach(cheat => {
            likeCountsRef.current[cheat.cheatName] = Math.floor(Math.random() * 10000);
          });
          const uniqueCategories = [...new Set(data?.map(cheat => cheat.cheatCategory))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheats();
  }, [game, platform]);

  useEffect(() => {
    initializeLikedCodes();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CheatFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <ScrollView 
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredCheats.length > 0 ? (
          filteredCheats.map((item, index) => {
            const isLiked = isCodeLiked(item.cheatName);
            const likeCount = likeCountsRef.current[item.cheatName] || 0;
            const isLiking = likingInProgress === item.cheatName;
            const scaleAnim = scaleAnimsRef.current[item.cheatName] || new Animated.Value(1);
            
            return (
              <View key={`${item.cheatName}-${index}`} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cheatCategoryTag}>
                    <Text style={styles.cheatCategoryText}>
                      {item.cheatCategory.toUpperCase()}
                    </Text>
                  </View>
                  <Pressable 
                    onPress={() => handleLike(item)}
                    style={styles.likeContainer}
                    disabled={isLiking}
                  >
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                      <Ionicons 
                        name={isLiked ? "heart" : "heart-outline"} 
                        size={24} 
                        color={isLiked ? colors.primary : colors.text.secondary} 
                      />
                    </Animated.View>
                    <Text style={[
                      styles.likeCount,
                      isLiked && styles.likeCountActive
                    ]}>
                      {formatLikeCount(likeCount)}
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.cheatName}>{item.cheatName}</Text>
                <Text style={styles.cheatCode}>{item.cheatCode}</Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.noDataText}>
            Aucun code disponible pour {selectedCategory ? `la catégorie ${selectedCategory} dans ` : ''}{game}.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  scrollViewContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.small,
  },
  cheatCategoryTag: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  cheatCategoryText: {
    color: colors.text.dark,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  cheatName: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  cheatCode: {
    color: colors.text.secondary,
    fontSize: typography.sizes.md,
    fontFamily: 'monospace',
  },
  noDataText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.md,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  likeContainer: {
    position: 'relative',
    alignItems: 'center',
    padding: spacing.xs,
    minWidth: 50,
  },
  likeCount: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  likeCountActive: {
    color: colors.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  likesCount: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
});
