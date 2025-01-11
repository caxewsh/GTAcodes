import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { PREMIUM_LIMITS } from '../constants/premium';

export function useLikes(cheatId: number) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikeStatus();
  }, [cheatId]);

  const fetchLikeStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const [likeStatus, likesCount] = await Promise.all([
        supabase
          .from('likes')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('cheat_id', cheatId)
          .single(),
        supabase
          .from('likes')
          .select('*', { count: 'exact' })
          .eq('cheat_id', cheatId)
      ]);

      setIsLiked(!!likeStatus.data);
      setLikesCount(likesCount.count || 0);
    } catch (error) {
      console.error('Error fetching like status:', error);
    } finally {
      setLoading(false);
    }
  };

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

        if (count && count >= PREMIUM_LIMITS.FREE.LIKES) {
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