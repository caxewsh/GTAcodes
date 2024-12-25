import { useEffect } from 'react';
import { useLikesStore } from '../stores/likesStore';

export function useInitializeLikes() {
  const initialize = useLikesStore(state => state.initialize);

  useEffect(() => {
    initialize();
  }, []);
} 