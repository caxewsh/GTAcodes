import React from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';

interface FavoritesListProps {
  favorites: any[];
  isPremium: boolean;
  maxFreeLimit: number;
  onRemoveFavorite: (id: string) => void;
  onPremiumPrompt: () => void;
}

export default function FavoritesList({ 
  favorites, 
  isPremium, 
  maxFreeLimit, 
  onRemoveFavorite,
  onPremiumPrompt 
}: FavoritesListProps) {
  const isOverLimit = !isPremium && favorites.length >= maxFreeLimit;

  const renderFavoriteItem = ({ item }: { item: any }) => (
    <View style={styles.favoriteCard}>
      <View style={styles.favoriteInfo}>
        <Text style={styles.favoriteTitle}>{item.title}</Text>
        <Text style={styles.favoriteCode}>{item.code}</Text>
        <Text style={styles.favoriteGame}>{item.game}</Text>
      </View>
      <Pressable 
        style={styles.removeButton}
        onPress={() => onRemoveFavorite(item.id)}
      >
        <Ionicons name="heart" size={24} color={colors.primary} />
      </Pressable>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name="heart-outline" 
        size={48} 
        color={colors.text.secondary} 
      />
      <Text style={styles.emptyStateTitle}>
        Aucun favori
      </Text>
      <Text style={styles.emptyStateText}>
        Ajoutez des codes à vos favoris pour les retrouver facilement
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Favoris</Text>
        <Text style={styles.count}>
          {favorites.length}{!isPremium && `/${maxFreeLimit}`}
        </Text>
      </View>
      
      {favorites.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {isOverLimit && (
            <Pressable 
              style={styles.premiumPrompt}
              onPress={onPremiumPrompt}
            >
              <Ionicons name="lock-closed" size={20} color={colors.text.secondary} />
              <Text style={styles.premiumPromptText}>
                Version gratuite limitée à {maxFreeLimit} favoris
              </Text>
            </Pressable>
          )}

          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  count: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  favoriteCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.small,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  favoriteCode: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontFamily: 'monospace',
    marginBottom: spacing.xs,
  },
  favoriteGame: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  removeButton: {
    padding: spacing.sm,
  },
  premiumPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  premiumPromptText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyStateTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
}); 