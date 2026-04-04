# Design Tokens complets — React Native
## Le Voyage des Compétences

## Fichier principal

```typescript
// constants/design-tokens.ts
import { Platform } from 'react-native'

// ─── COULEURS ───────────────────────────────────────────
export const colors = {
  // Marque
  primary: '#2D6A4F',
  primaryLight: '#52B788',
  primaryDark: '#1A3D2E',
  accent: '#F4A261',
  accentWarm: '#E76F51',
  gold: '#D4AF37',

  // Fonds
  bgMain: '#FFF8F0',
  bgCard: '#FFFFFF',
  bgOverlay: 'rgba(0,0,0,0.45)',

  // Textes
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textOnPrimary: '#FFFFFF',
  textDisabled: '#D1D5DB',
  textMuted: '#9CA3AF',

  // Statuts
  success: '#52B788',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Bordures
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  // Villes (couleur signature)
  cities: {
    casablanca: '#1D3557',
    marrakech: '#C1440E',
    fes: '#D4AF37',
    tanger: '#2980B9',
    agadir: '#27AE60',
    rabat: '#8E44AD',
  },

  // Profils joueurs
  profiles: {
    stratege: '#7B2D8B',
    empathique: '#E91E8C',
    creatif: '#F4A261',
    leader: '#E53E3E',
    analyste: '#2980B9',
    adaptable: '#27AE60',
  },

  // Skills compétences
  skills: {
    decision: '#7B2D8B',
    communication: '#2980B9',
    teamwork: '#27AE60',
    stress: '#F4A261',
    creativity: '#F59E0B',
    leadership: '#E53E3E',
  }
}

// ─── ESPACEMENT ─────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  screenH: 20,   // marge horizontale écran standard
  screenV: 16,   // marge verticale écran standard
}

// ─── BORDER RADIUS ──────────────────────────────────────
export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24,
  pill: 50,
  circle: 9999,
}

// ─── TYPOGRAPHIE ────────────────────────────────────────
export const typography = {
  h1: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: 'Poppins-ExtraBold',
    fontWeight: '800' as const,
  },
  h2: {
    fontSize: 22,
    lineHeight: 30,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700' as const,
  },
  h3: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'Poppins-Regular',
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Poppins-Regular',
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Poppins-Regular',
    fontWeight: '400' as const,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700' as const,
  },
  labelSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
  overline: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
}

// ─── OMBRES ─────────────────────────────────────────────
export const shadows = {
  sm: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
           shadowOpacity: 0.08, shadowRadius: 4 },
    android: { elevation: 2 }
  }),
  md: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
           shadowOpacity: 0.10, shadowRadius: 8 },
    android: { elevation: 4 }
  }),
  lg: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
           shadowOpacity: 0.12, shadowRadius: 16 },
    android: { elevation: 8 }
  }),
  upward: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
           shadowOpacity: 0.10, shadowRadius: 12 },
    android: { elevation: 8 }
  }),
}

// ─── TIMING ANIMATIONS ──────────────────────────────────
export const timing = {
  fast: 150,
  normal: 250,
  slow: 400,
  entrance: 500,
  spring: { damping: 15, stiffness: 180 },
  springBouncy: { damping: 10, stiffness: 200 },
  springSmooth: { damping: 20, stiffness: 120 },
}
```

---

## Composants UI réutilisables

### AnimatedButton
```typescript
// components/ui/AnimatedButton.tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { Pressable, Text, StyleSheet } from 'react-native'
import { colors, radius, typography, shadows } from '@/constants/design-tokens'

interface Props {
  label: string
  labelAr?: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'city'
  cityColor?: string
  disabled?: boolean
  fullWidth?: boolean
}

export function AnimatedButton({
  label, labelAr, onPress, variant = 'primary', cityColor, disabled, fullWidth = true
}: Props) {
  const scale = useSharedValue(1)

  const bg = variant === 'city' && cityColor
    ? cityColor
    : variant === 'primary' ? colors.primary : 'transparent'

  const borderColor = variant === 'secondary' ? colors.primary : 'transparent'

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.96, { damping: 15 }) }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 12 }) }}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View style={[
        styles.button,
        { backgroundColor: bg, borderColor, opacity: disabled ? 0.5 : 1 },
        fullWidth && { width: '100%' },
        animStyle,
        shadows.md,
      ]}>
        <Text style={[styles.label, { color: variant === 'secondary' ? colors.primary : '#fff' }]}>
          {label}
        </Text>
        {labelAr && (
          <Text style={[styles.labelAr, { color: variant === 'secondary' ? colors.primary : '#fff' }]}>
            {labelAr}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 56, borderRadius: radius.pill, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24,
  },
  label: { ...typography.label, color: '#fff' },
  labelAr: { ...typography.caption, color: '#fff', opacity: 0.85 },
})
```

### XPBar
```typescript
// components/ui/XPBar.tsx
export function XPBar({ current, max, showLabel = true }: {
  current: number; max: number; showLabel?: boolean
}) {
  const progress = Math.min(current / max, 1)
  const width = useSharedValue(0)

  useEffect(() => {
    width.value = withDelay(400, withSpring(progress, timing.springSmooth))
  }, [progress])

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%` as any
  }))

  return (
    <View>
      {showLabel && (
        <View style={styles.row}>
          <Text style={styles.label}>⭐ {current} XP</Text>
          <Text style={styles.muted}>encore {max - current} XP</Text>
        </View>
      )}
      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle]} />
      </View>
    </View>
  )
}
```

### SkillCircle
```typescript
// components/ui/SkillCircle.tsx
// Cercle de compétence avec anneau de progression (style Apple Watch)
export function SkillCircle({ skill, level, color }: {
  skill: string; level: number; color: string
}) {
  // Utiliser react-native-svg pour l'anneau de progression
  const circumference = 2 * Math.PI * 28 // rayon 28
  const strokeDash = (level / 100) * circumference

  return (
    <View style={styles.container}>
      <Svg width={72} height={72}>
        {/* Track */}
        <Circle cx={36} cy={36} r={28} stroke="#E5E7EB" strokeWidth={5} fill="none" />
        {/* Progress */}
        <Circle
          cx={36} cy={36} r={28}
          stroke={color} strokeWidth={5} fill="none"
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.icon}>{skillIcons[skill]}</Text>
      </View>
      <Text style={styles.label}>{skillLabels[skill]}</Text>
    </View>
  )
}
```

---

## Composant bilingue standard

```typescript
// components/ui/BilingualText.tsx
import { I18nManager } from 'react-native'

interface Props {
  fr: string
  ar: string
  style?: TextStyle
  arStyle?: TextStyle
}

export function BilingualText({ fr, ar, style, arStyle }: Props) {
  return (
    <View>
      <Text style={[typography.body, { color: colors.textPrimary }, style]}>
        {fr}
      </Text>
      <Text style={[
        typography.bodySmall,
        { color: colors.textSecondary, textAlign: 'right' },
        arStyle
      ]}>
        {ar}
      </Text>
    </View>
  )
}
```
