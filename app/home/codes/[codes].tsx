import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { supabase } from '../../../utils/supabase';
import CheatFilters from '../../../components/CheatFilters';
import { colors, spacing, typography, borderRadius, shadows } from '../../../constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LikeButton } from '../../../components/LikeButton';
import { PREMIUM_LIMITS } from '../../../constants/premium';
import LikesLimitTooltip from '../../../components/LikesLimitTooltip';
import { usePremium } from '../../../hooks/usePremium';

interface CheatCode {
  id: number;
  cheatName: string;
  cheatCode: string;
  cheatCategory: string;
}

const isPremium = false; // We'll replace this with real premium check later

function HeaderRight() {
  const [totalLikes, setTotalLikes] = useState(0);
  const { isPremium } = usePremium();

  useEffect(() => {
    const fetchTotalLikes = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id);

      setTotalLikes(count || 0);
    };

    fetchTotalLikes();
    
    // Subscribe to likes changes
    const channel = supabase
      .channel('likes_count_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'likes' 
      }, () => {
        fetchTotalLikes();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);
  
  return (
    <View style={styles.headerRight}>
      <Ionicons name="heart" size={20} color={colors.primary} />
      <Text style={styles.likesCount}>
        {totalLikes}{!isPremium && `/${PREMIUM_LIMITS.FREE.LIKES}`}
      </Text>
      <LikesLimitTooltip />
    </View>
  );
}

export default function GameCheatScreen() {
  const { game, platform } = useLocalSearchParams();
  const navigation = useNavigation();
  const [cheats, setCheats] = useState<CheatCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  React.useLayoutEffect(() => {
    if (game && navigation) {
      navigation.setOptions({
        headerTitle: `Codes ${game}`,
        headerBackTitle: 'Retour',
        headerRight: () => <HeaderRight />
      });
    }
  }, [game, navigation]);

  const filteredCheats = selectedCategory
    ? cheats.filter(cheat => cheat.cheatCategory === selectedCategory)
    : cheats;

  useEffect(() => {
    const fetchCheats = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('Cheats')
          .select('id, cheatName, cheatCode, cheatCategory')
          .eq('game', game)
          .eq('platform', platform);

        if (error) throw error;
        
        setCheats(data || []);
        const uniqueCategories = [...new Set(data?.map(cheat => cheat.cheatCategory))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching cheats:', error);
        Alert.alert('Error', 'Failed to load cheat codes');
      } finally {
        setLoading(false);
      }
    };

    fetchCheats();
  }, [game, platform]);

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
          filteredCheats.map((item) => (
            <View key={`cheat-${item.id}`} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cheatCategoryTag}>
                  <Text style={styles.cheatCategoryText}>
                    {item.cheatCategory.toUpperCase()}
                  </Text>
                </View>
                <LikeButton 
                  cheatId={item.id}
                  onPremiumRequired={() => {
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
                  }}
                />
              </View>
              <Text style={styles.cheatName}>{item.cheatName}</Text>
              <Text style={styles.cheatCode}>{item.cheatCode}</Text>
            </View>
          ))
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
