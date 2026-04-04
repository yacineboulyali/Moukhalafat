---
name: rn-edu-game
description: >
  Expert en création de jeux éducatifs mobiles animés avec React Native (Expo) et Supabase.
  Utilise cette skill dès que l'utilisateur parle de : créer un écran de jeu mobile, coder une
  animation React Native, implémenter une fonctionnalité de jeu éducatif, configurer Supabase
  pour un jeu, gérer des profils joueurs, des scores XP, des badges, des scénarios, ou tout
  développement lié à "Le Voyage des Compétences". Déclenche aussi pour : Reanimated, Lottie,
  navigation de jeu, game state, Expo EAS Build, bottom sheet, carte interactive mobile,
  quiz mobile, système de progression, leaderboard, certificats. Toujours utiliser cette skill
  pour tout code React Native + jeu + éducatif, même si la demande semble simple.
---

# Expert React Native — Jeux Éducatifs Mobiles Animés

## Contexte du projet principal
**"Le Voyage des Compétences"** — jeu sérieux mobile pour étudiants OFPPT/Maroc
- 28 écrans / 6 phases / 6 villes marocaines
- 6 profils joueurs adaptatifs (Stratège, Empathique, Créatif, Leader, Analyste, Adaptable)
- Stack : **Expo (SDK 51+)** + **React Native** + **Supabase** + **TypeScript**
- Bilingue : Français (LTR) + Arabe (RTL)
- Design system : `references/design-tokens.md`
- Schéma Supabase complet : `references/supabase-schema.md`
- Patterns animations : `references/animations.md`
- Architecture & navigation : `references/architecture.md`

---

## Stack technique de référence

```
Expo SDK 51+ (managed workflow)
React Native 0.74+
TypeScript strict
Supabase JS v2 (@supabase/supabase-js)
React Native Reanimated 3 (animations)
Lottie React Native (animations complexes)
React Navigation 6 (Stack + Tab + Bottom Sheet)
Expo Router (file-based routing)
Zustand (state management)
React Query / TanStack Query (data fetching)
React Native Gesture Handler
Expo AV (sons / musique)
Expo Haptics (retours tactiles)
React Native SVG (graphiques / carte Maroc)
```

---

## Workflow de développement d'un écran de jeu

### Étape 1 — Identifier le contexte
- Quel écran ? (E1–E28, ou nouveau)
- Quelle phase ? (Onboarding / Carte / Scénario / Débriefing / Social / Certification)
- Interactions requises ? (tap, swipe, scroll, drag-drop, timer)
- Données Supabase ? (lecture / écriture / temps réel)
- Animations ? (entrée, sortie, micro-interactions, célébration)

### Étape 2 — Structure du composant
Toujours utiliser ce pattern de base :

```typescript
// screens/E{N}{NomEcran}.tsx
import { View, StyleSheet, Pressable } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming, FadeIn, SlideInDown
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, typography, spacing, radius } from '@/constants/design-tokens'
import { useGameStore } from '@/stores/gameStore'
import { usePlayer } from '@/hooks/usePlayer'

export default function NomEcranScreen() {
  const insets = useSafeAreaInsets()
  const { player, updateXP } = useGameStore()
  // ... logique

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* contenu */}
    </View>
  )
}
```

### Étape 3 — Référencer les fichiers selon le besoin
- Animations complexes → lire `references/animations.md`
- Supabase queries → lire `references/supabase-schema.md`
- Design tokens (couleurs, typo) → lire `references/design-tokens.md`
- Navigation / routing → lire `references/architecture.md`

---

## Règles de qualité code

### Performance
- Toujours `useCallback` sur les handlers dans les listes
- `FlatList` ou `FlashList` pour toute liste > 5 items (jamais `ScrollView` + `map`)
- Images : `expo-image` (pas `Image` de RN) pour le cache automatique
- Animations sur le **UI thread** uniquement (worklets Reanimated)
- Éviter les re-renders : `memo`, `useMemo` sur les calculs lourds

### TypeScript
- Types stricts pour tous les props et données Supabase
- Générer les types depuis Supabase : `supabase gen types typescript`
- Interfaces préfixées : `IPlayer`, `IChallenge`, `IBadge`

### Accessibilité & Bilinguisme
```typescript
// RTL automatique selon la langue
import { I18nManager } from 'react-native'
const isRTL = I18nManager.isRTL

// Appliquer RTL aux styles flex
flexDirection: isRTL ? 'row-reverse' : 'row'
textAlign: isRTL ? 'right' : 'left'
```

### Safe Areas
```typescript
// Toujours gérer les safe zones
const insets = useSafeAreaInsets()
paddingTop: insets.top + 8
paddingBottom: insets.bottom + 16
```

---

## Design Tokens de base (inline pour référence rapide)

```typescript
// constants/design-tokens.ts
export const colors = {
  primary: '#2D6A4F',
  primaryLight: '#52B788',
  accent: '#F4A261',
  accentWarm: '#E76F51',
  bgMain: '#FFF8F0',
  bgCard: '#FFFFFF',
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textOnPrimary: '#FFFFFF',
  gold: '#D4AF37',
  // Couleurs par ville
  cities: {
    casablanca: '#1D3557',
    marrakech: '#C1440E',
    fes: '#D4AF37',
    tanger: '#2980B9',
    agadir: '#27AE60',
    rabat: '#8E44AD',
  }
}

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48
}

export const radius = {
  sm: 8, md: 14, lg: 20, xl: 24, pill: 50
}

export const typography = {
  h1: { fontSize: 28, fontWeight: '800', fontFamily: 'Poppins-ExtraBold' },
  h2: { fontSize: 22, fontWeight: '700', fontFamily: 'Poppins-Bold' },
  h3: { fontSize: 18, fontWeight: '600', fontFamily: 'Poppins-SemiBold' },
  body: { fontSize: 16, fontWeight: '400', fontFamily: 'Poppins-Regular' },
  caption: { fontSize: 13, fontWeight: '400', fontFamily: 'Poppins-Regular' },
  label: { fontSize: 16, fontWeight: '700', fontFamily: 'Poppins-Bold' },
}
```

---

## Patterns de jeu récurrents

### Système XP & Niveau
```typescript
// hooks/useXP.ts
const XP_PER_LEVEL = 500
export const getLevel = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1
export const getProgress = (xp: number) => (xp % XP_PER_LEVEL) / XP_PER_LEVEL
export const getXPToNext = (xp: number) => XP_PER_LEVEL - (xp % XP_PER_LEVEL)
```

### State Global (Zustand)
```typescript
// stores/gameStore.ts
interface GameStore {
  player: IPlayer | null
  currentCity: CityId | null
  currentChallenge: IChallenge | null
  answers: Record<string, string>
  setPlayer: (p: IPlayer) => void
  addXP: (amount: number) => void
  saveAnswer: (questionId: string, answerId: string) => void
  resetChallenge: () => void
}
```

### Timer de défi
```typescript
// hooks/useTimer.ts
export function useChallengeTimer(durationSeconds: number) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds)
  const [isRunning, setIsRunning] = useState(false)
  // ... interval logic avec cleanup
  return { timeLeft, isRunning, start, pause, reset }
}
```

### Bottom Sheet modal
```typescript
// Utiliser @gorhom/bottom-sheet
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
const snapPoints = useMemo(() => ['45%', '78%'], [])
```

---

## Références à charger selon le besoin

| Besoin | Fichier à lire |
|--------|---------------|
| Animations Reanimated / Lottie | `references/animations.md` |
| Schéma Supabase + queries | `references/supabase-schema.md` |
| Architecture / navigation Expo Router | `references/architecture.md` |
| Design tokens complets + composants | `references/design-tokens.md` |
