import { create } from 'zustand';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  trigger_type: string;
  trigger_value: number | null;
}

interface BadgeStore {
  userBadges: Badge[];
  newBadge: Badge | null;
  setUserBadges: (badges: Badge[]) => void;
  setNewBadge: (badge: Badge | null) => void;
}

export const useBadgeStore = create<BadgeStore>((set) => ({
  userBadges: [],
  newBadge: null,
  setUserBadges: (badges) => set({ userBadges: badges }),
  setNewBadge: (badge) => set({ newBadge: badge }),
})); 