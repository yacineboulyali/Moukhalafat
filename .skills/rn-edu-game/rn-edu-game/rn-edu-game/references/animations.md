# Animations — React Native Reanimated 3 + Lottie

## Principes fondamentaux
- Toutes les animations DOIVENT tourner sur le **UI thread** (pas le JS thread)
- Utiliser `useSharedValue`, `useAnimatedStyle`, `withSpring`, `withTiming`
- Jamais `Animated` de React Native core — toujours `react-native-reanimated`
- Lottie pour animations complexes (célébrations, loading, personnages)

---

## Animations d'entrée d'écran

### FadeIn + SlideUp (standard pour cartes)
```typescript
import Animated, { FadeIn, SlideInDown, SlideInRight } from 'react-native-reanimated'

// Carte qui entre par le bas
<Animated.View entering={SlideInDown.springify().damping(18)}>
  <Card />
</Animated.View>

// Texte qui fade in avec délai
<Animated.Text entering={FadeIn.delay(300).duration(500)}>
  Bienvenue !
</Animated.Text>

// Liste d'items en cascade (staggered)
{items.map((item, index) => (
  <Animated.View
    key={item.id}
    entering={FadeIn.delay(index * 120).springify()}
  >
    <ItemCard item={item} />
  </Animated.View>
))}
```

### Entrée cinématique (E9 — Intro ville)
```typescript
// Hero image fade + scale
const heroScale = useSharedValue(1.08)
const heroOpacity = useSharedValue(0)

useEffect(() => {
  heroOpacity.value = withTiming(1, { duration: 800 })
  heroScale.value = withTiming(1, { duration: 1200 })
}, [])

const heroStyle = useAnimatedStyle(() => ({
  opacity: heroOpacity.value,
  transform: [{ scale: heroScale.value }]
}))
```

---

## Micro-interactions

### Bouton CTA (press feedback)
```typescript
function AnimatedButton({ onPress, children }) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15 })
  }
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12 })
  }

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </Pressable>
  )
}
```

### Card de réponse sélectionnée (E4 / E12 / E13)
```typescript
function AnswerCard({ selected, onPress, children }) {
  const borderColor = useSharedValue('#E5E7EB')
  const bgOpacity = useSharedValue(0)
  const scale = useSharedValue(1)

  useEffect(() => {
    if (selected) {
      borderColor.value = withTiming('#2D6A4F', { duration: 250 })
      bgOpacity.value = withTiming(1, { duration: 250 })
      scale.value = withSequence(
        withSpring(1.03, { damping: 10 }),
        withSpring(1, { damping: 15 })
      )
    } else {
      borderColor.value = withTiming('#E5E7EB', { duration: 200 })
      bgOpacity.value = withTiming(0, { duration: 200 })
    }
  }, [selected])

  const cardStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
    transform: [{ scale: scale.value }]
  }))

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
    backgroundColor: 'rgba(45,106,79,0.06)'
  }))

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Animated.View style={[StyleSheet.absoluteFill, overlayStyle, { borderRadius: 16 }]} />
        {children}
      </Animated.View>
    </Pressable>
  )
}
```

### Progress bar XP animée
```typescript
function XPBar({ progress }: { progress: number }) {
  const width = useSharedValue(0)

  useEffect(() => {
    width.value = withDelay(300, withSpring(progress, {
      damping: 20, stiffness: 90
    }))
  }, [progress])

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`
  }))

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, barStyle]} />
    </View>
  )
}
```

---

## Animations de célébration (E5 / E17 / E19)

### Confetti (Lottie)
```typescript
import LottieView from 'lottie-react-native'

function CelebrationOverlay({ visible }: { visible: boolean }) {
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 })
    }
  }, [visible])

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }))

  if (!visible) return null

  return (
    <Animated.View style={[StyleSheet.absoluteFill, style, { pointerEvents: 'none' }]}>
      <LottieView
        source={require('@/assets/animations/confetti.json')}
        autoPlay
        loop={false}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  )
}
```

### Badge reveal (E5 / E19)
```typescript
function BadgeReveal({ profileColor }: { profileColor: string }) {
  const scale = useSharedValue(0)
  const rotation = useSharedValue(-15)
  const opacity = useSharedValue(0)

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 })
    scale.value = withSequence(
      withSpring(1.15, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 14 })
    )
    rotation.value = withSpring(0, { damping: 12 })
  }, [])

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ]
  }))

  return (
    <Animated.View style={[styles.badge, { borderColor: profileColor }, badgeStyle]}>
      {/* avatar + glow ring */}
    </Animated.View>
  )
}
```

---

## Animations de carte (E6 — Carte du Maroc)

### Pin pulsant (ville courante)
```typescript
function CityPin({ isActive, color }: { isActive: boolean; color: string }) {
  const pulseScale = useSharedValue(1)
  const pulseOpacity = useSharedValue(0.6)

  useEffect(() => {
    if (isActive) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 900 }),
          withTiming(1, { duration: 900 })
        ),
        -1, // infinite
        false
      )
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 900 }),
          withTiming(0.6, { duration: 900 })
        ),
        -1,
        false
      )
    }
  }, [isActive])

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
    backgroundColor: color,
  }))

  return (
    <View>
      {isActive && <Animated.View style={[styles.pulsing, pulseStyle]} />}
      <View style={[styles.pin, { backgroundColor: color }]} />
    </View>
  )
}
```

---

## Transitions d'écrans (Expo Router)

```typescript
// app/(game)/_layout.tsx
import { Stack } from 'expo-router'

export default function GameLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        headerShown: false,
        contentStyle: { backgroundColor: '#FFF8F0' }
      }}
    />
  )
}

// Transition spéciale pour E5 (reveal) — fade
<Stack.Screen
  name="e5-profile-reveal"
  options={{ animation: 'fade' }}
/>

// Transition cinématique E9 (intro ville) — fade_from_bottom
<Stack.Screen
  name="e9-city-intro"
  options={{ animation: 'fade_from_bottom' }}
/>
```

---

## Sons & Haptics

```typescript
import * as Haptics from 'expo-haptics'
import { Audio } from 'expo-av'

// Feedback tactile sur sélection de réponse
const onAnswerSelect = async () => {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
}

// Vibration succès
const onSuccess = async () => {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
}

// Son de niveau gagné
const playLevelUp = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require('@/assets/sounds/level-up.mp3')
  )
  await sound.playAsync()
}
```

---

## Fichiers Lottie recommandés
Placer dans `assets/animations/` :
- `confetti.json` — célébration générale (E5, E19)
- `level-up.json` — montée de niveau (E17)
- `loading-map.json` — chargement carte (E6)
- `badge-unlock.json` — déverrouillage badge (E19)
- `character-wave.json` — personnage qui salue (E10)
- `stars-burst.json` — étoiles pour score parfait (E17)

Source recommandée : LottieFiles.com (filtrer "education", "celebration", "map")
