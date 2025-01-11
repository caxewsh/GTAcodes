import { useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useBadgeStore } from '../stores/badgeStore';

export function useBadges() {
  const { userBadges, setUserBadges, newBadge, setNewBadge } = useBadgeStore();

  const initialize = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data: badges } = await supabase
      .from('user_badges')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('user_id', session.user.id);

    setUserBadges(badges?.map(b => b.badge) || []);
  };

  const checkAndAwardBadge = async (userId: string, triggerType: string, value?: number) => {
    const { data: badges } = await supabase
      .from('badges')
      .select('*')
      .eq('trigger_type', triggerType)
      .order('trigger_value', { ascending: true });

    if (!badges) return;

    for (const badge of badges) {
      if (badge.trigger_value && value < badge.trigger_value) continue;

      const { data: existing } = await supabase
        .from('user_badges')
        .select('id')
        .match({ user_id: userId, badge_id: badge.id })
        .single();

      if (!existing) {
        await supabase
          .from('user_badges')
          .insert({ user_id: userId, badge_id: badge.id });
        
        setNewBadge(badge);
        await initialize();
        return badge;
      }
    }
  };

  return {
    userBadges,
    newBadge,
    initialize,
    checkAndAwardBadge,
    clearNewBadge: () => setNewBadge(null),
  };
} 