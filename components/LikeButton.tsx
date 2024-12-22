import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../utils/supabase';
import { useLikes } from '../hooks/useLikes';
import { colors, spacing, typography } from '../constants/theme';
import * as Haptics from 'expo-haptics';

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

      if (!isPremium && likesCount >= maxFreeLikes) {
        onPremiumRequired?.();
        return;
      }

      await Haptics.selectionAsync();
      await toggleLike();
    } catch (error) {
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
      >
        <Ionicons 
          name={isLiked ? "heart" : "heart-outline"} 
          size={24} 
          color={isLiked ? colors.primary : colors.text.secondary} 
        />
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