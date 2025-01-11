export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  trigger_type: 'first_like' | 'like_count';
  trigger_value: number | null;
  created_at: string;
}

export interface UserBadge {
  id: number;
  user_id: string;
  badge_id: number;
  unlocked_at: string;
  badge?: Badge;
}

// Update Database type
export type Database = {
  public: {
    Tables: {
      badges: {
        Row: Badge;
        Insert: Omit<Badge, 'id' | 'created_at'>;
        Update: Partial<Omit<Badge, 'id' | 'created_at'>>;
      };
      user_badges: {
        Row: UserBadge;
        Insert: Omit<UserBadge, 'id' | 'unlocked_at'>;
        Update: Partial<Omit<UserBadge, 'id' | 'unlocked_at'>>;
      };
    };
  };
}; 