import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';

interface FavoritesPreviewProps {
  likedCodes: any[];
  isPremium: boolean;
  maxFreeLimit: number;
}

export default function FavoritesPreview({ 
  likedCodes, 
  isPremium, 
  maxFreeLimit 
}: FavoritesPreviewProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Mes Favoris</Text>
          <Text style={styles.count}>
            {likedCodes.length}{!isPremium && `/${maxFreeLimit}`}
          </Text>
        </View>
        <Pressable 
          onPress={() => router.push('/playlist')}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllText}>Voir tout</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </Pressable>
      </View>

      {likedCodes.length > 0 ? (
        <View style={styles.preview}>
          {likedCodes.slice(0, 3).map((code, index) => (
            <View key={code.id} style={styles.codeItem}>
              <Text style={styles.codeName} numberOfLines={1}>
                {code.title}
              </Text>
              <Text style={styles.gameText}>{code.game}</Text>
            </View>
          ))}
          {likedCodes.length > 3 && (
            <Text style={styles.moreText}>
              +{likedCodes.length - 3} autres codes
            </Text>
          )}
        </View>
      ) : (
        <Text style={styles.emptyText}>
          Aucun code favori pour le moment
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    ...shadows.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  count: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
  },
  preview: {
    gap: spacing.sm,
  },
  codeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  codeName: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    flex: 1,
  },
  gameText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  moreText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  emptyText: {
    color: colors.text.secondary,
    textAlign: 'center',
    fontSize: typography.sizes.sm,
    paddingVertical: spacing.md,
  },
}); 