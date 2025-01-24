import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLikes } from '../hooks/useLikes';
import { useBadges } from '../hooks/useBadges';
import { supabase } from '../utils/supabase';
import { colors, spacing, typography } from '../constants/theme';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  useSharedValue
} from 'react-native-reanimated';
import { OnboardingModal } from './OnboardingModal';

interface Props {
  cheatId: number;
  showCount?: boolean;
  onNotLoggedIn?: () => void;
  onPremiumRequired?: () => void;
}

export function LikeButton({ cheatId, showCount, onNotLoggedIn, onPremiumRequired }: Props) {
  const router = useRouter();
  const { isLiked, likesCount, loading, toggleLike } = useLikes(cheatId);
  const { checkAndAwardBadge } = useBadges();
  const scale = useSharedValue(1);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePress = async () => {
    try {
      await Haptics.selectionAsync();
      
      // Animate the heart
      scale.value = withSequence(
        withSpring(1.2, { damping: 2 }),
        withSpring(1, { damping: 3 })
      );

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setShowOnboarding(true);
        return;
      }

      if (!isLiked) {
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact' })
          .eq('user_id', session.user.id);

        await toggleLike();

        // Check badges after successful like
        await checkAndAwardBadge(session.user.id, 'first_like');
        await checkAndAwardBadge(session.user.id, 'like_count', (count || 0) + 1);
      } else {
        await toggleLike();
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'FREE_LIMIT_REACHED') {
        onPremiumRequired?.();
        return;
      }
      console.error('Error handling like:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder le like');
    }
  };

  return (
    <View style={styles.wrapper}>
      <Pressable 
        style={styles.container}
        onPress={handlePress}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel={isLiked ? "Unlike this cheat" : "Like this cheat"}
        accessibilityState={{ checked: isLiked }}
      >
        <Animated.View style={animatedStyle}>
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={24} 
            color={isLiked ? colors.primary : colors.text.secondary} 
          />
        </Animated.View>
      </Pressable>
      {likesCount > 0 && (
        <Text style={[styles.count, isLiked && styles.countActive]}>
          {likesCount}
        </Text>
      )}

      <OnboardingModal 
        isVisible={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: spacing.sm,
  },
  count: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: -spacing.xs,
  },
  countActive: {
    color: colors.primary,
  }
}); 