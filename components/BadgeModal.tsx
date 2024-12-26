import { View, StyleSheet, Text, Animated, Easing } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal } from './Modal';
import { useEffect, useRef } from 'react';

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

interface BadgeModalProps {
  badge: {
    name: string;
    description: string;
    trigger_type: string;
  } | null;
  isVisible: boolean;
  onClose: () => void;
}

export function BadgeModal({ badge, isVisible, onClose }: BadgeModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible && badge) {
      // Reset animations
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
      opacityAnim.setValue(0);

      // Start animations
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, badge]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Early return if no badge
  if (!badge) return null;

  // Get style with fallback
  const badgeStyle = BADGE_STYLES[badge.trigger_type as keyof typeof BADGE_STYLES] || BADGE_STYLES.first_like;

  return (
    <Modal visible={isVisible} onClose={onClose}>
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.iconContainer, 
            { backgroundColor: badgeStyle.background },
            {
              transform: [
                { scale: scaleAnim },
                { rotate: spin },
              ],
              opacity: opacityAnim,
            }
          ]}
        >
          <MaterialCommunityIcons 
            name={badgeStyle.icon}
            size={48} 
            color={badgeStyle.color}
          />
        </Animated.View>
        <Animated.Text 
          style={[
            styles.title,
            {
              opacity: opacityAnim,
              transform: [{ translateY: opacityAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })}],
            }
          ]}
        >
          {badge.name}
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.description,
            {
              opacity: opacityAnim,
              transform: [{ translateY: opacityAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })}],
            }
          ]}
        >
          {badge.description}
        </Animated.Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    padding: spacing.md,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
}); 