# Architecture & Navigation — Expo Router
## Le Voyage des Compétences

## Structure du projet

```
app/
├── (auth)/
│   ├── _layout.tsx          # Stack auth
│   ├── login.tsx            # Connexion
│   └── register.tsx         # Inscription
├── (onboarding)/
│   ├── _layout.tsx          # Stack onboarding (E1-E5)
│   ├── e1-splash.tsx
│   ├── e2-welcome.tsx
│   ├── e3-profile-create.tsx
│   ├── e4-quiz.tsx
│   └── e5-profile-reveal.tsx
├── (main)/
│   ├── _layout.tsx          # Tab layout principal
│   ├── map.tsx              # E6 — Carte (tab Carte)
│   ├── dashboard.tsx        # E8 — Tableau de bord (tab Profil)
│   ├── leaderboard.tsx      # E22 — Classement (tab Classement)
│   └── help.tsx             # Aide (tab Aide)
├── (challenge)/
│   ├── _layout.tsx          # Stack défi (E9-E16)
│   ├── [city]/
│   │   ├── e9-intro.tsx     # Intro ville
│   │   ├── e10-npc.tsx      # Présentation NPC
│   │   ├── e11-scenario.tsx # Lecture scénario
│   │   ├── e12-choice1.tsx  # Choix niveau 1
│   │   ├── e13-choice2.tsx  # Choix niveau 2
│   │   ├── e14-midresult.tsx# Résultat intermédiaire
│   │   ├── e15-minigame.tsx # Mini-jeu
│   │   └── e16-dialogue.tsx # Dialogue résolution
├── (debrief)/
│   ├── _layout.tsx          # Stack débriefing (E17-E21)
│   ├── e17-score.tsx
│   ├── e18-pedagogy.tsx
│   ├── e19-badges.tsx
│   ├── e20-advice.tsx
│   └── e21-skill-card.tsx
├── (social)/
│   ├── e23-full-profile.tsx
│   ├── e24-friend-challenge.tsx
│   └── e25-history.tsx
├── (certification)/
│   ├── e26-recap.tsx
│   ├── e27-certificate.tsx
│   └── e28-share.tsx
└── _layout.tsx              # Root layout + providers

components/
├── ui/                      # Composants réutilisables
│   ├── AnimatedButton.tsx
│   ├── XPBar.tsx
│   ├── CityPin.tsx
│   ├── SkillCircle.tsx
│   ├── ProfileBadge.tsx
│   ├── DialogueBubble.tsx
│   └── BadgeCard.tsx
├── game/                    # Composants spécifiques au jeu
│   ├── AnswerCard.tsx
│   ├── ScenarioCard.tsx
│   ├── CelebrationOverlay.tsx
│   └── MiniGame/
└── layout/
    ├── GameHeader.tsx
    └── TabBar.tsx

stores/
├── gameStore.ts             # Zustand — état global jeu
├── authStore.ts             # Zustand — auth/player
└── challengeStore.ts        # Zustand — état défi courant

hooks/
├── usePlayer.ts
├── useChallenge.ts
├── useXP.ts
├── useTimer.ts
├── useCityProgress.ts
└── useLeaderboard.ts

lib/
├── supabase.ts
├── scoring.ts               # Logique calcul scores
└── cities.ts                # Config villes (couleurs, ordre, etc.)

constants/
├── design-tokens.ts
├── cities.ts
└── profiles.ts
```

---

## Navigation principale

### Root Layout
```typescript
// app/_layout.tsx
import { Stack } from 'expo-router'
import { useAuthStore } from '@/stores/authStore'
import { useEffect } from 'react'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const { session, checkSession } = useAuthStore()

  const [loaded] = useFonts({
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('@/assets/fonts/Poppins-ExtraBold.ttf'),
  })

  useEffect(() => {
    checkSession()
  }, [])

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded) return null

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(onboarding)" redirect={!!session} />
      <Stack.Screen name="(auth)" redirect={!!session} />
      <Stack.Screen name="(main)" redirect={!session} />
      <Stack.Screen name="(challenge)" redirect={!session} />
    </Stack>
  )
}
```

### Tab Bar principal (E6 / E8 / E22)
```typescript
// app/(main)/_layout.tsx
import { Tabs } from 'expo-router'
import { colors } from '@/constants/design-tokens'

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F3F4F6',
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins-SemiBold',
          fontSize: 11,
        }
      }}
    >
      <Tabs.Screen name="map" options={{ title: 'Carte', tabBarIcon: MapIcon }} />
      <Tabs.Screen name="dashboard" options={{ title: 'Profil', tabBarIcon: ProfileIcon }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Classement', tabBarIcon: TrophyIcon }} />
      <Tabs.Screen name="help" options={{ title: 'Aide', tabBarIcon: HelpIcon }} />
    </Tabs>
  )
}
```

### Navigation vers un défi (depuis E7)
```typescript
import { router } from 'expo-router'

// Lancer le défi d'une ville
const startChallenge = (cityId: string) => {
  router.push(`/(challenge)/${cityId}/e9-intro`)
}

// Navigation séquentielle dans le défi
const goToNextScreen = () => {
  router.push(`/(challenge)/${cityId}/e10-npc`)
}

// Retour à la carte après défi
const returnToMap = () => {
  router.replace('/(main)/map')
}
```

---

## State Management (Zustand)

```typescript
// stores/gameStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface GameState {
  // Player
  player: IPlayer | null
  setPlayer: (player: IPlayer) => void
  addXP: (amount: number) => void

  // Challenge en cours
  currentCity: CityId | null
  challengeSessionId: string | null
  answers: Record<string, string>
  startChallenge: (cityId: CityId) => void
  saveAnswer: (questionId: string, answerId: string) => void
  resetChallenge: () => void

  // UI state
  isLoading: boolean
  setLoading: (v: boolean) => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: null,
      setPlayer: (player) => set({ player }),
      addXP: (amount) => set((state) => ({
        player: state.player
          ? { ...state.player, xp: state.player.xp + amount }
          : null
      })),

      currentCity: null,
      challengeSessionId: null,
      answers: {},
      startChallenge: (cityId) => set({
        currentCity: cityId,
        challengeSessionId: crypto.randomUUID(),
        answers: {}
      }),
      saveAnswer: (questionId, answerId) => set((state) => ({
        answers: { ...state.answers, [questionId]: answerId }
      })),
      resetChallenge: () => set({
        currentCity: null,
        challengeSessionId: null,
        answers: {}
      }),

      isLoading: false,
      setLoading: (v) => set({ isLoading: v }),
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ player: state.player }) // ne persister que le joueur
    }
  )
)
```

---

## Configuration Expo EAS Build

```json
// eas.json
{
  "cli": { "version": ">= 7.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": { "EXPO_PUBLIC_SUPABASE_URL": "..." }
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## Config villes (ordre & couleurs)

```typescript
// constants/cities.ts
export const CITIES: CityConfig[] = [
  { id: 'casablanca', nameFr: 'Casablanca', nameAr: 'الدار البيضاء',
    color: '#1D3557', skill: 'stress', order: 1, levelRequired: 1 },
  { id: 'marrakech', nameFr: 'Marrakech', nameAr: 'مراكش',
    color: '#C1440E', skill: 'communication', order: 2, levelRequired: 2 },
  { id: 'fes', nameFr: 'Fès', nameAr: 'فاس',
    color: '#D4AF37', skill: 'teamwork', order: 3, levelRequired: 3 },
  { id: 'tanger', nameFr: 'Tanger', nameAr: 'طنجة',
    color: '#2980B9', skill: 'adaptability', order: 4, levelRequired: 4 },
  { id: 'agadir', nameFr: 'Agadir', nameAr: 'أكادير',
    color: '#27AE60', skill: 'initiative', order: 5, levelRequired: 5 },
  { id: 'rabat', nameFr: 'Rabat', nameAr: 'الرباط',
    color: '#8E44AD', skill: 'leadership', order: 6, levelRequired: 6 },
]

export const getNextCity = (currentCityId: string): string | null => {
  const current = CITIES.find(c => c.id === currentCityId)
  if (!current) return null
  const next = CITIES.find(c => c.order === current.order + 1)
  return next?.id || null
}
```
