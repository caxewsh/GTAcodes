import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  Layout,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';
import { useLikesStore } from '../../stores/likesStore';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import { platformGames } from '../../constants/GameData';
import CheatFilters from '../../components/CheatFilters';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ExpandedState {
  [key: number]: boolean;
}

export default function FavoritesScreen() {
  const router = useRouter();
  const { likedCheats } = useLikesStore();
  const [expandedItems, setExpandedItems] = useState<ExpandedState>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories from liked cheats
  const categories = Array.from(new Set(likedCheats.map(cheat => cheat.cheatCategory)));

  // Filter cheats based on selected category
  const filteredCheats = selectedCategory
    ? likedCheats.filter(cheat => cheat.cheatCategory === selectedCategory)
    : likedCheats;

  const toggleExpand = (id: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderItem = ({ item: cheat }) => {
    const isExpanded = expandedItems[cheat.id];
    const gameData = Object.values(platformGames)
      .flat()
      .find(game => game.title === cheat.game);

    return (
      <AnimatedPressable 
        style={[styles.cheatCard, isExpanded && styles.cheatCardExpanded]}
        onPress={() => toggleExpand(cheat.id)}
        layout={Layout.springify().damping(15).stiffness(100)}
      >
        <View style={styles.cheatInfo}>
          {gameData?.image && (
            <Image 
              source={gameData.image} 
              style={styles.gameIcon}
            />
          )}
          <View style={styles.textContainer}>
            <Text style={styles.cheatName} numberOfLines={isExpanded ? undefined : 1}>
              {cheat.cheatName}
            </Text>
            <Text style={styles.gameText}>{cheat.game}</Text>
          </View>
          <View style={styles.platformContainer}>
            <Ionicons 
              name={getPlatformIcon(cheat.platform)} 
              size={20} 
              color={colors.text.secondary}
            />
          </View>
        </View>
        
        {isExpanded && (
          <Animated.View 
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(100).delay(50)}
            style={styles.expandedContent}
          >
            <Text style={styles.categoryText}>
              Catégorie : {cheat.cheatCategory}
            </Text>
            <View style={styles.separator} />
            <Text style={styles.codeTitle}>Code :</Text>
            <Text style={styles.codeText}>{cheat.cheatCode}</Text>
          </Animated.View>
        )}
      </AnimatedPressable>
    );
  };

  return (
    <SafeAreaView 
      style={styles.container} 
      edges={['left', 'right']}
    >
      <Stack.Screen
        options={{
          title: 'Mes Favoris',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.tab.background,
          },
          headerShadowVisible: false,
          headerTintColor: colors.primary,
          headerBackTitle: 'Retour',
        }}
      />
      
      <CheatFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {filteredCheats.length > 0 ? (
        <FlatList
          data={filteredCheats}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {selectedCategory 
              ? `Aucun code dans la catégorie "${selectedCategory}"`
              : 'Aucun code favori pour le moment'
            }
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const getPlatformIcon = (platform: string): keyof typeof Ionicons.glyphMap => {
  switch (platform.toLowerCase()) {
    case 'playstation': return 'logo-playstation';
    case 'xbox': return 'logo-xbox';
    case 'pc': return 'desktop-outline';
    case 'mobile': return 'phone-portrait-outline';
    default: return 'game-controller-outline';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl * 2,
  },
  cheatCard: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  cheatCardExpanded: {
    ...shadows.medium,
  },
  cheatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  cheatName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  gameText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  platformContainer: {
    marginLeft: spacing.md,
    padding: spacing.xs,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.sm,
  },
  expandedContent: {
    marginTop: spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border.primary,
    marginVertical: spacing.md,
  },
  codeTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  codeText: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.sm,
  },
  categoryText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.md,
    textAlign: 'center',
  },
}); 