import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../utils/supabase';
import { useLikes } from '../hooks/useLikes';
import { colors, spacing, typography } from '../constants/theme';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  useSharedValue
} from 'react-native-reanimated';

type Props = {
  cheatId: number;
  isPremium?: boolean;
  maxFreeLikes?: number;
  onPremiumRequired?: () => void;
};

export function LikeButton({ 
  cheatId, 
  isPremium = false,
  maxFreeLikes = 10,
  onPremiumRequired 
}: Props) {
  const router = useRouter();
  const { isLiked, likesCount, loading, toggleLike } = useLikes(cheatId);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePress = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        Alert.alert(
          'Créer un compte',
          'Créez un compte gratuit pour ajouter des codes en favoris !',
          [
            { text: 'Plus tard', style: 'cancel' },
            { 
              text: 'Créer un compte',
              onPress: () => router.push('/auth/signup')
            }
          ]
        );
        return;
      }

      await Haptics.selectionAsync();
      
      // Animate the heart
      scale.value = withSequence(
        withSpring(1.2, { damping: 2 }),
        withSpring(1, { damping: 3 })
      );
      
      await toggleLike();
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
        <Text style={[
          styles.count,
          isLiked && styles.countActive
        ]}>
          {likesCount}
        </Text>
      )}
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