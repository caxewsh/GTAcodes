import { create } from 'zustand';
import { supabase } from '../utils/supabase';

interface LikedCheat {
  id: number;
  cheatName: string;
  cheatCode: string;
  cheatCategory: string;
  game: string;
  platform: string;
}

interface LikesStore {
  likesCount: number;
  likedCheats: LikedCheat[];
  loading: boolean;
  setLikesCount: (count: number) => void;
  updateLikesCount: () => Promise<void>;
  fetchLikedCheats: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useLikesStore = create<LikesStore>((set, get) => ({
  likesCount: 0,
  likedCheats: [],
  loading: true,

  setLikesCount: (count) => set({ likesCount: count }),

  updateLikesCount: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        set({ likesCount: 0 });
        return;
      }

      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id);

      set({ likesCount: count || 0 });
    } catch (error) {
      console.error('Error updating likes count:', error);
    }
  },

  fetchLikedCheats: async () => {
    try {
      set({ loading: true });
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        set({ likedCheats: [], loading: false });
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

      set({ likedCheats: transformedData, loading: false });
    } catch (error) {
      console.error('Error in fetchLikedCheats:', error);
      set({ loading: false });
    }
  },

  initialize: async () => {
    const store = get();
    await Promise.all([
      store.updateLikesCount(),
      store.fetchLikedCheats()
    ]);
  }
}));

// Setup realtime subscriptions
supabase.channel('likes_changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'likes'
    },
    () => {
      const store = useLikesStore.getState();
      store.initialize();
    }
  )
  .subscribe(); 