import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../constants/theme';
import { useState, useEffect } from 'react';

const BADGE_STYLES = {
  first_like: {
    icon: 'heart-outline',
    color: colors.premium.favorite,
    background: `${colors.premium.favorite}20`,
  },
  like_count: {
    icon: 'fire',
    color: '#FF6B6B',
    background: '#FF6B6B20',
  },
  like_limit: {
    icon: 'lock-alert',
    color: '#4CAF50',
    background: '#4CAF5020',
  },
} as const;

export interface BadgeProps {
  id: number;
  name: string;
  description: string;
  trigger_type: keyof typeof BADGE_STYLES;
  trigger_value?: number;
  isLocked?: boolean;
  isAuthenticated?: boolean;
}

export function Badge({ 
  id, 
  name, 
  description, 
  trigger_type, 
  isLocked = false,
  isAuthenticated = false 
}: BadgeProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.badgeCard, styles.badgeCardLocked]}>
        {/* Afficher un placeholder ou rien pendant le chargement */}
      </View>
    );
  }

  const style = BADGE_STYLES[trigger_type] || BADGE_STYLES.first_like;
  const shouldHideContent = !isAuthenticated || (isAuthenticated && isLocked);

  return (
    <View style={[styles.container, shouldHideContent && styles.locked]}>
      <View style={[styles.iconContainer, { backgroundColor: style.background }]}>
        <MaterialCommunityIcons 
          name={style.icon}
          size={32} 
          color={shouldHideContent ? colors.text.secondary : style.color}
        />
      </View>
      {shouldHideContent ? (
        <>
          <Text style={styles.name}>Badge mystère</Text>
          <Text style={styles.description}>
            {isAuthenticated 
              ? 'Débloquez ce badge pour découvrir son contenu'
              : 'Connectez-vous pour débloquer les badges'
            }
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.description}>{description}</Text>
        </>
      )}
      {shouldHideContent && (
        <View style={styles.lockOverlay}>
          <MaterialCommunityIcons name="lock-outline" size={24} color={colors.text.secondary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
    position: 'relative',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  name: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  locked: {
    opacity: 0.7,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeCard: {
    // Add appropriate styles for the badge card
  },
  badgeCardLocked: {
    // Add appropriate styles for the locked badge card
  },
}); 