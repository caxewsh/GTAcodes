import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { PREMIUM_LIMITS } from '../constants/premium';
import { usePremium } from './usePremium';

export function useLikes(cheatId: number) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isPremium } = usePremium();

  const fetchLikeStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Toujours récupérer le nombre total de likes, même si l'utilisateur n'est pas connecté
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('cheat_id', cheatId);
      
      setLikesCount(count || 0);

      // Vérifier le statut liked seulement si l'utilisateur est connecté
      if (session?.user) {
        const { data } = await supabase
          .from('likes')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('cheat_id', cheatId)
          .single();

        setIsLiked(!!data);
      }
    } catch (error) {
      console.error('Error fetching like status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikeStatus();

    const subscription = supabase
      .channel(`likes_${cheatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'likes',
          filter: `cheat_id=eq.${cheatId}`
        },
        () => {
          // Recharger le statut complet à chaque changement
          fetchLikeStatus();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [cheatId]);

  const toggleLike = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Must be authenticated to like');

      if (!isLiked) {
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact' })
          .eq('user_id', session.user.id);

        // Ne pas vérifier la limite si l'utilisateur est premium
        if (!isPremium && count && count >= PREMIUM_LIMITS.FREE.LIKES) {
          throw new Error('FREE_LIMIT_REACHED');
        }

        await supabase
          .from('likes')
          .insert({
            user_id: session.user.id,
            cheat_id: cheatId
          });
      } else {
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', session.user.id)
          .eq('cheat_id', cheatId);
      }

      await fetchLikeStatus();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    isLiked,
    likesCount,
    loading,
    toggleLike
  };
} 