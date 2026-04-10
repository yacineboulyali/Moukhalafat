import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useStats() {
  const [stats, setStats] = useState({
    totalPlayers: 0,
    activePlayers: 0,
    totalBadges: 0,
    avgXP: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [profilesRes, badgesRes] = await Promise.all([
          supabase.from('player_profiles').select('id, xp, streak_days'),
          supabase.from('player_earned_badges').select('id', { count: 'exact' }),
        ]);

        const profiles = profilesRes.data || [];
        const totalBadges = badgesRes.count || 0;
        const activePlayers = profiles.filter(p => p.streak_days > 0).length;
        const avgXP = profiles.length > 0
          ? Math.round(profiles.reduce((s, p) => s + p.xp, 0) / profiles.length)
          : 0;

        setStats({
          totalPlayers: profiles.length,
          activePlayers,
          totalBadges,
          avgXP,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading };
}

export function usePlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const { data } = await supabase
          .from('player_profiles')
          .select('*')
          .order('xp', { ascending: false });
        setPlayers(data || []);
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, []);

  return { players, loading };
}

export function usePlayerDetail(playerId) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!playerId) { setDetail(null); return; }
    setLoading(true);

    async function fetchDetail() {
      const [cityRes, badgeRes, skillRes] = await Promise.all([
        supabase.from('player_city_progress').select('*').eq('player_id', playerId).order('missions_completed', { ascending: false }),
        supabase.from('player_earned_badges').select('*').eq('player_id', playerId).order('earned_at', { ascending: false }),
        supabase.from('player_skill_scores').select('*').eq('player_id', playerId),
      ]);

      setDetail({
        cities: cityRes.data || [],
        badges: badgeRes.data || [],
        skills: skillRes.data || [],
      });
      setLoading(false);
    }

    fetchDetail();
  }, [playerId]);

  return { detail, loading };
}

export function useSkillDistribution() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data: skills } = await supabase
        .from('player_skill_scores')
        .select('skill_id, skill_label, score, color');

      if (!skills) { setLoading(false); return; }

      // Group by skill and average scores
      const grouped = {};
      skills.forEach(s => {
        if (!grouped[s.skill_id]) grouped[s.skill_id] = { skill_id: s.skill_id, label: s.skill_label, scores: [], color: s.color };
        grouped[s.skill_id].scores.push(s.score);
      });

      const result = Object.values(grouped).map(g => ({
        skill: g.label || g.skill_id,
        avg: Math.round(g.scores.reduce((a, b) => a + b, 0) / g.scores.length),
        color: g.color || '#7c3aed',
      }));

      setData(result);
      setLoading(false);
    }
    fetch();
  }, []);

  return { data, loading };
}

export function useCityStats() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data: cities } = await supabase
        .from('player_city_progress')
        .select('city_name_fr, status');

      if (!cities) { setLoading(false); return; }

      const grouped = {};
      cities.forEach(c => {
        const name = c.city_name_fr || c.city_id || 'Ville';
        if (!grouped[name]) grouped[name] = { city: name, done: 0, current: 0, locked: 0 };
        grouped[name][c.status] = (grouped[name][c.status] || 0) + 1;
      });

      setData(Object.values(grouped));
      setLoading(false);
    }
    fetch();
  }, []);

  return { data, loading };
}
