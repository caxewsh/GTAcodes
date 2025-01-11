import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setIsPremium(false);
          return;
        }

        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .select('is_premium, premium_until')
          .eq('user_id', session.user.id)
          .single();

        if (subscription) {
          const isPremiumActive = subscription.is_premium && 
            (!subscription.premium_until || new Date(subscription.premium_until) > new Date());
          setIsPremium(isPremiumActive);
        } else {
          // Create default subscription for new user
          await supabase
            .from('user_subscriptions')
            .insert({
              user_id: session.user.id,
              is_premium: false
            });
          setIsPremium(false);
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    };

    checkPremiumStatus();

    // Subscribe to changes
    const channel = supabase
      .channel('subscription_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_subscriptions'
      }, () => {
        checkPremiumStatus();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { isPremium, loading };
} 