import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { PREMIUM_LIMITS } from '../constants/premium';
import { useLikedCheats } from './useLikedCheats';
import { useLikesStore } from '../stores/likesStore';

export function useLikes(cheatId: number) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { likedCheats, refresh: refreshLikedCheats } = useLikedCheats();
  const { initialize } = useLikesStore();

  useEffect(() => {
    fetchLikeStatus();
    const channel = setupRealtimeSubscription();
    
    return () => {
      channel.unsubscribe();
    };
  }, [cheatId]);

  const fetchLikeStatus = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      const { count, error: countError } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('cheat_id', cheatId);

      if (countError) throw countError;
      setLikesCount(count || 0);

      if (session?.user) {
        const { data, error: likeError } = await supabase
          .from('likes')
          .select('id')
          .eq('cheat_id', cheatId)
          .eq('user_id', session.user.id)
          .single();

        if (likeError && likeError.code !== 'PGRST116') {
          throw likeError;
        }
        setIsLiked(!!data);
      }
    } catch (error) {
      console.error('Error in fetchLikeStatus:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    return supabase.channel(`public:likes:cheat_id_${cheatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'likes',
          filter: `cheat_id=eq.${cheatId}`
        },
        () => fetchLikeStatus()
      )
      .subscribe();
  };

  const toggleLike = async () => {
    if (loading) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Must be authenticated to like');

      await refreshLikedCheats();
      
      console.log('Current likes count:', likedCheats.length);
      console.log('Free limit:', PREMIUM_LIMITS.FREE.LIKES);
      console.log('Is already liked:', isLiked);

      if (!isLiked && likedCheats.length >= PREMIUM_LIMITS.FREE.LIKES) {
        console.log('Should throw FREE_LIMIT_REACHED');
        throw new Error('FREE_LIMIT_REACHED');
      }

      setLoading(true);

      if (isLiked) {
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .match({ 
            user_id: session.user.id, 
            cheat_id: cheatId 
          });

        if (deleteError) throw deleteError;
      } else {
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact' })
          .eq('user_id', session.user.id);

        if (count >= PREMIUM_LIMITS.FREE.LIKES) {
          throw new Error('FREE_LIMIT_REACHED');
        }

        const { error: insertError } = await supabase
          .from('likes')
          .insert({
            user_id: session.user.id,
            cheat_id: cheatId
          });

        if (insertError) throw insertError;
      }

      await fetchLikeStatus();
      await refreshLikedCheats();
      await initialize();
    } catch (error) {
      if (error instanceof Error && error.message === 'FREE_LIMIT_REACHED') {
        console.log('Throwing FREE_LIMIT_REACHED error');
        throw error;
      }
      console.error('Error in toggleLike:', error);
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