import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LikedCode {
  id: string;
  title: string;
  code: string;
  game: string;
}

interface LikedCodesStore {
  likedCodes: LikedCode[];
  initialized: boolean;
  addLikedCode: (code: LikedCode) => Promise<void>;
  removeLikedCode: (codeId: string) => Promise<void>;
  isCodeLiked: (codeId: string) => boolean;
  initializeLikedCodes: () => Promise<void>;
}

export const useLikedCodes = create<LikedCodesStore>((set, get) => ({
  likedCodes: [],
  initialized: false,

  initializeLikedCodes: async () => {
    try {
      const stored = await AsyncStorage.getItem('likedCodes');
      if (stored) {
        set({ likedCodes: JSON.parse(stored), initialized: true });
      } else {
        set({ initialized: true });
      }
    } catch (error) {
      console.error('Error initializing liked codes:', error);
      set({ initialized: true }); // Set initialized even on error
    }
  },
  
  addLikedCode: async (code) => {
    try {
      const newLikedCodes = [...get().likedCodes, code];
      set({ likedCodes: newLikedCodes });
      await AsyncStorage.setItem('likedCodes', JSON.stringify(newLikedCodes));
    } catch (error) {
      console.error('Error saving liked code:', error);
    }
  },
  
  removeLikedCode: async (codeId) => {
    try {
      const newLikedCodes = get().likedCodes.filter(code => code.id !== codeId);
      set({ likedCodes: newLikedCodes });
      await AsyncStorage.setItem('likedCodes', JSON.stringify(newLikedCodes));
    } catch (error) {
      console.error('Error removing liked code:', error);
    }
  },
  
  isCodeLiked: (codeId) => {
    return get().likedCodes.some(code => code.id === codeId);
  },
})); 