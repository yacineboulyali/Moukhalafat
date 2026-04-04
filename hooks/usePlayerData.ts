/**
 * usePlayerData — fetches all dashboard data for a player
 * Tables: player_profiles, player_city_progress,
 *         player_earned_badges, player_skill_scores
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase, DEMO_PLAYER_ID } from '../lib/supabase';

// ── Types ────────────────────────────────────────────────────────────
export interface PlayerProfile {
  id: string;
  display_name: string;
  avatar_id: number;
  profile_type: string;
  xp: number;
  level: number;
  streak_days: number;
}

export interface CityProgress {
  city_id: string;
  city_name_fr: string;
  city_name_ar: string;
  status: 'done' | 'current' | 'locked';
  missions_completed: number;
  missions_total: number;
  xp_earned: number;
  completed_at: string | null;
}

export interface EarnedBadge {
  id: string;
  badge_id: string;
  badge_name_fr: string;
  badge_emoji: string;
  city: string | null;
  rank: 'bronze' | 'argent' | 'or' | null;
  skill: string | null;
  points: number;
  earned_at: string;
}

export interface SkillScore {
  skill_id: string;
  skill_label: string;
  score: number;
  color: string;
  icon: string;
  is_unlocked: boolean;
}

export interface PlayerData {
  profile: PlayerProfile | null;
  cities: CityProgress[];
  badges: EarnedBadge[];
  skills: SkillScore[];
  totalXP: number;
  xpToNextLevel: number;
  xpProgress: number; // 0–1 fraction
}

// ── XP thresholds per level ─────────────────────────────────────────
const XP_LEVELS = [0, 100, 300, 600, 1000, 1500, 2200, 3000];
function xpForLevel(level: number) {
  return XP_LEVELS[Math.min(level, XP_LEVELS.length - 1)] ?? 9999;
}

// ── Hook ────────────────────────────────────────────────────────────
export function usePlayerData(playerId: string = DEMO_PLAYER_ID) {
  const [data, setData] = useState<PlayerData>({
    profile: null,
    cities: [],
    badges: [],
    skills: [],
    totalXP: 0,
    xpToNextLevel: 1000,
    xpProgress: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Parallel fetch
      const [profileRes, citiesRes, badgesRes, skillsRes] = await Promise.all([
        supabase
          .from('player_profiles')
          .select('*')
          .eq('id', playerId)
          .single(),

        supabase
          .from('player_city_progress')
          .select('*')
          .eq('player_id', playerId)
          .order('city_id'),

        supabase
          .from('player_earned_badges')
          .select('*')
          .eq('player_id', playerId)
          .order('earned_at', { ascending: false }),

        supabase
          .from('player_skill_scores')
          .select('*')
          .eq('player_id', playerId)
          .order('skill_id'),
      ]);

      // Check errors
      if (profileRes.error) throw profileRes.error;
      if (citiesRes.error) throw citiesRes.error;
      if (badgesRes.error) throw badgesRes.error;
      if (skillsRes.error) throw skillsRes.error;

      const profile = profileRes.data as PlayerProfile;
      const cities = (citiesRes.data ?? []) as CityProgress[];
      const badges = (badgesRes.data ?? []) as EarnedBadge[];
      const skills = (skillsRes.data ?? []) as SkillScore[];

      // Compute XP progression
      const xp = profile?.xp ?? 0;
      const level = profile?.level ?? 1;
      const xpCurrent = xpForLevel(level);
      const xpNext = xpForLevel(level + 1);
      const xpRange = xpNext - xpCurrent;
      const xpProgress = xpRange > 0 ? Math.min((xp - xpCurrent) / xpRange, 1) : 0;

      // Badge points as extra XP contributions
      const badgeXP = badges.reduce((sum, b) => sum + (b.points ?? 0), 0);

      setData({
        profile,
        cities,
        badges,
        skills,
        totalXP: xp + badgeXP,
        xpToNextLevel: xpNext,
        xpProgress,
      });
    } catch (err: any) {
      console.error('[usePlayerData]', err);
      setError(err?.message ?? 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Update XP (call this after completing a mission) ──
  const addXP = useCallback(
    async (amount: number) => {
      if (!data.profile) return;
      const newXP = (data.profile.xp ?? 0) + amount;
      const { error } = await supabase
        .from('player_profiles')
        .update({ xp: newXP, updated_at: new Date().toISOString() })
        .eq('id', playerId);
      if (!error) fetchAll();
    },
    [data.profile, playerId, fetchAll]
  );

  // ── Award badge ──────────────────────────────────────────────────
  const awardBadge = useCallback(
    async (badge: Omit<EarnedBadge, 'id' | 'earned_at'>) => {
      const { error } = await supabase.from('player_earned_badges').insert({
        player_id: playerId,
        ...badge,
      });
      if (!error) fetchAll();
    },
    [playerId, fetchAll]
  );

  // ── Update city progress ─────────────────────────────────────────
  const updateCityProgress = useCallback(
    async (cityId: string, update: Partial<CityProgress>) => {
      const { error } = await supabase
        .from('player_city_progress')
        .update(update)
        .eq('player_id', playerId)
        .eq('city_id', cityId);
      if (!error) fetchAll();
    },
    [playerId, fetchAll]
  );

  return {
    data,
    loading,
    error,
    refetch: fetchAll,
    addXP,
    awardBadge,
    updateCityProgress,
  };
}
