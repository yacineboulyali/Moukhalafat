# Supabase — Schéma & Queries
## Le Voyage des Compétences

## Configuration client

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Database } from '@/types/supabase'

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
```

---

## Schéma complet

### Table : `players`
```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar_id INTEGER CHECK (avatar_id BETWEEN 1 AND 6),
  profile_type TEXT CHECK (profile_type IN (
    'stratege','empathique','creatif','leader','analyste','adaptable'
  )),
  filiere TEXT,                          -- filière OFPPT
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_played_at TIMESTAMPTZ,
  language TEXT DEFAULT 'fr' CHECK (language IN ('fr','ar')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "players_own" ON players
  USING (auth.uid() = auth_id);
```

### Table : `city_progress`
```sql
CREATE TABLE city_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  city_id TEXT CHECK (city_id IN (
    'casablanca','marrakech','fes','tanger','agadir','rabat'
  )),
  status TEXT DEFAULT 'locked' CHECK (status IN ('locked','unlocked','completed')),
  score INTEGER,                         -- score final 0-100
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  attempts INTEGER DEFAULT 0,
  UNIQUE(player_id, city_id)
);
```

### Table : `challenge_answers`
```sql
CREATE TABLE challenge_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  city_id TEXT NOT NULL,
  challenge_session_id UUID DEFAULT gen_random_uuid(),
  question_id TEXT NOT NULL,             -- ex: "E12_Q1"
  answer_id TEXT NOT NULL,              -- ex: "A", "B", "C"
  is_optimal BOOLEAN,
  answered_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table : `badges`
```sql
CREATE TABLE badges (
  id TEXT PRIMARY KEY,                  -- ex: "premier-defi", "casablancais"
  name_fr TEXT NOT NULL,
  name_ar TEXT,
  description_fr TEXT,
  icon_name TEXT,                       -- nom du fichier dans assets/badges/
  category TEXT CHECK (category IN ('city','skill','streak','special')),
  xp_reward INTEGER DEFAULT 0
);

CREATE TABLE player_badges (
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  badge_id TEXT REFERENCES badges(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (player_id, badge_id)
);
```

### Table : `skills_progress`
```sql
CREATE TABLE skills_progress (
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  skill_id TEXT CHECK (skill_id IN (
    'decision','communication','teamwork','stress','creativity','leadership'
  )),
  level INTEGER DEFAULT 0 CHECK (level BETWEEN 0 AND 100),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (player_id, skill_id)
);
```

### Table : `leaderboard` (vue matérialisée)
```sql
CREATE VIEW leaderboard_view AS
SELECT
  p.id,
  p.username,
  p.avatar_id,
  p.profile_type,
  p.xp,
  p.level,
  p.filiere,
  COUNT(cp.city_id) FILTER (WHERE cp.status = 'completed') as cities_completed,
  RANK() OVER (ORDER BY p.xp DESC) as rank
FROM players p
LEFT JOIN city_progress cp ON cp.player_id = p.id
GROUP BY p.id;
```

---

## Queries TypeScript

### Authentification
```typescript
// hooks/useAuth.ts
export async function signUp(email: string, password: string, username: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email, password
  })
  if (authError) throw authError

  // Créer le profil joueur
  const { error } = await supabase.from('players').insert({
    auth_id: authData.user!.id,
    username,
  })
  if (error) throw error
  return authData
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email, password
  })
  if (error) throw error
  return data
}
```

### Charger le profil joueur
```typescript
// hooks/usePlayer.ts
export async function fetchPlayer(authId: string): Promise<IPlayer> {
  const { data, error } = await supabase
    .from('players')
    .select(`
      *,
      city_progress(*),
      player_badges(badge_id, earned_at, badges(*)),
      skills_progress(*)
    `)
    .eq('auth_id', authId)
    .single()

  if (error) throw error
  return data
}
```

### Sauvegarder le profil après quiz (E4)
```typescript
export async function savePlayerProfile(
  playerId: string,
  profileType: ProfileType,
  avatarId: number,
  filiere: string
) {
  const { error } = await supabase
    .from('players')
    .update({ profile_type: profileType, avatar_id: avatarId, filiere })
    .eq('id', playerId)

  if (error) throw error

  // Débloquer Casablanca (première ville)
  await supabase.from('city_progress').upsert({
    player_id: playerId,
    city_id: 'casablanca',
    status: 'unlocked'
  })
}
```

### Sauvegarder une réponse de défi
```typescript
export async function saveAnswer(
  playerId: string,
  cityId: string,
  sessionId: string,
  questionId: string,
  answerId: string,
  isOptimal: boolean
) {
  const { error } = await supabase.from('challenge_answers').insert({
    player_id: playerId,
    city_id: cityId,
    challenge_session_id: sessionId,
    question_id: questionId,
    answer_id: answerId,
    is_optimal: isOptimal,
  })
  if (error) throw error
}
```

### Terminer un défi et ajouter XP
```typescript
export async function completeChallenge(
  playerId: string,
  cityId: string,
  score: number,
  xpEarned: number,
  skillsGained: Record<string, number>
) {
  // 1. Mettre à jour city_progress
  await supabase.from('city_progress').upsert({
    player_id: playerId,
    city_id: cityId,
    status: 'completed',
    score,
    xp_earned: xpEarned,
    completed_at: new Date().toISOString(),
  })

  // 2. Incrémenter XP joueur
  const { data: player } = await supabase
    .from('players')
    .select('xp')
    .eq('id', playerId)
    .single()

  const newXP = (player?.xp || 0) + xpEarned
  const newLevel = Math.floor(newXP / 500) + 1

  await supabase.from('players').update({
    xp: newXP,
    level: newLevel,
    last_played_at: new Date().toISOString()
  }).eq('id', playerId)

  // 3. Mettre à jour les skills
  for (const [skillId, points] of Object.entries(skillsGained)) {
    await supabase.rpc('increment_skill', {
      p_player_id: playerId,
      p_skill_id: skillId,
      p_points: points
    })
  }

  // 4. Débloquer la ville suivante
  const nextCity = getNextCity(cityId)
  if (nextCity) {
    await supabase.from('city_progress').upsert({
      player_id: playerId,
      city_id: nextCity,
      status: 'unlocked'
    })
  }
}
```

### Leaderboard
```typescript
export async function fetchLeaderboard(filiere?: string) {
  let query = supabase
    .from('leaderboard_view')
    .select('*')
    .order('rank', { ascending: true })
    .limit(50)

  if (filiere) {
    query = query.eq('filiere', filiere)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}
```

### Temps réel — streak & présence
```typescript
// Écouter les changements XP en temps réel (pour animations)
export function subscribeToPlayer(playerId: string, onUpdate: (p: IPlayer) => void) {
  return supabase
    .channel(`player-${playerId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'players',
      filter: `id=eq.${playerId}`
    }, (payload) => onUpdate(payload.new as IPlayer))
    .subscribe()
}
```

---

## Fonction Supabase RPC utile

```sql
-- Incrémenter un skill (atomic)
CREATE OR REPLACE FUNCTION increment_skill(
  p_player_id UUID,
  p_skill_id TEXT,
  p_points INTEGER
) RETURNS VOID AS $$
BEGIN
  INSERT INTO skills_progress (player_id, skill_id, level)
  VALUES (p_player_id, p_skill_id, LEAST(p_points, 100))
  ON CONFLICT (player_id, skill_id)
  DO UPDATE SET
    level = LEAST(skills_progress.level + p_points, 100),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
```

---

## Variables d'environnement (.env)
```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```
