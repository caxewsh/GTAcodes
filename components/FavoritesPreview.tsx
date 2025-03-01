import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../utils/supabase';
import { PREMIUM_LIMITS } from '../constants/premium';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import { usePremium } from '../hooks/usePremium';

export default function FavoritesPreview() {
  const router = useRouter();
  const [likedCheats, setLikedCheats] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isPremium } = usePremium();

  const fetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Get total likes count first
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id);

      setTotalLikes(count || 0);

      // Get most recent likes for preview
      const { data: likes } = await supabase
        .from('likes')
        .select(`
          id,
          cheat:Cheats (
            id,
            cheatName,
            game
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(4);

      setLikedCheats(likes?.map(like => like.cheat) || []);
    } catch (error) {
      console.error('Error fetching likes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setLikedCheats([]);
        setTotalLikes(0);
      } else if (session?.user) {
        await fetchData();
      }
    });

    // Initial fetch
    fetchData();

    const channel = supabase
      .channel('likes_preview_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'likes' 
      }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      channel.unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Mes Favoris</Text>
          <Text style={styles.count}>
            {totalLikes}{!isPremium && `/${PREMIUM_LIMITS.FREE.LIKES}`}
          </Text>
        </View>
        <Pressable 
          onPress={() => router.push('/profil/favorites')}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllText}>Voir tout</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </Pressable>
      </View>

      {likedCheats.length > 0 ? (
        <View style={styles.preview}>
          {likedCheats.slice(0, 3).map((cheat) => (
            <View key={cheat.id} style={styles.codeItem}>
              <Text style={styles.codeName} numberOfLines={1}>
                {cheat.cheatName}
              </Text>
              <Text style={styles.gameText}>{cheat.game}</Text>
            </View>
          ))}
          {totalLikes > 3 && (
            <Text style={styles.moreText}>
              +{totalLikes - 3} autres codes
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