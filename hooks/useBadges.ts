import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { BADGES, Badge } from '../constants/Badges';

export const useBadges = () => {
  const { user, setUser } = useAuthStore();
  const [lastAwardedBadge, setLastAwardedBadge] = useState<Badge | null>(null);
  const [showReward, setShowReward] = useState(false);

  const awardBadge = useCallback(async (badgeId: string) => {
    if (!user) return null;

    // 1. Check if already earned
    if (user.badges.includes(badgeId)) {
      return null;
    }

    // 2. Find badge definition
    const badge = BADGES.find(b => b.id === badgeId);
    if (!badge) return null;

    try {
      // 3. Update Supabase
      const newBadges = [...user.badges, badgeId];
      const { error } = await supabase
        .from('player_profiles')
        .update({ badges: newBadges })
        .eq('id', user.id);

      if (error) throw error;

      // 4. Update local state
      setUser({ ...user, badges: newBadges });
      setLastAwardedBadge(badge);
      setShowReward(true);
      
      return badge;
    } catch (err) {
      console.error('Error awarding badge:', err);
      return null;
    }
  }, [user, setUser]);

  const dismissReward = () => {
    setShowReward(false);
  };

  return {
    awardBadge,
    lastAwardedBadge,
    showReward,
    dismissReward
  };
};
