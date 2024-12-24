import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

interface LikedCheat {
  id: number;
  cheatName: string;
  cheatCode: string;
  cheatCategory: string;
  game: string;
  platform: string;
}

export function useLikedCheats() {
  const [likedCheats, setLikedCheats] = useState<LikedCheat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLikedCheats = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setLikedCheats([]);
        return;
      }

      const { data, error } = await supabase
        .from('likes')
        .select(`
          cheat_id,
          Cheats:cheat_id (
            id,
            cheatName,
            cheatCode,
            cheatCategory,
            game,
            platform
          )
        `)
        .eq('user_id', session.user.id);

      if (error) throw error;

      const transformedData = data
        .map(item => item.Cheats)
        .filter((cheat: any): cheat is LikedCheat => cheat !== null)
        .flat();

      setLikedCheats(transformedData);
    } catch (error) {
      console.error('Error in fetchLikedCheats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedCheats();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        fetchLikedCheats();
      } else if (event === 'SIGNED_OUT') {
        setLikedCheats([]);
      }
    });

    // Subscribe to ALL changes in the likes table for the current user
    const channel = supabase.channel('likes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'likes'
        },
        () => {
          console.log('Likes changed, refreshing...');
          fetchLikedCheats();
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
      channel.unsubscribe();
    };
  }, []);

  return {
    likedCheats,
    loading,
    refresh: fetchLikedCheats
  };
} 