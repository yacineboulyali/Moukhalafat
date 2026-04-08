import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { 
  FadeIn, 
  FadeInUp, 
  SlideInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const CITIES_DATA: Record<string, any> = {
  rabat: {
    img: require('../assets/images/intro-rabat.png'),
    cityTitle: 'Rabat | الرباط',
    headline: 'Le Cœur Institutionnel du Royaume',
    desc: "Depuis la Kasbah des Oudayas, la famille Ben Ali contemple l'avenir. Sous le regard de la Tour Mohammed VI, découvrez comment Rabat concilie héritage et leadership moderne.",
    focus: 'Gouvernance & Patrimoine',
    stepTitle: 'ÉTAPE 1 / 4',
    progress: 0.25,
    color: '#735c00'
  },
  chefchaouen: {
    img: require('../assets/images/intro-chefchaouen.png'),
    cityTitle: 'Chefchaouen | شفشاون',
    headline: 'La Cité Bleue | المدينة الزرقاء',
    desc: "La famille Ben Ali arrive au cœur de la médina. Pourront-ils s'orienter dans ce labyrinthe azuré en communiquant avec les habitants ?",
    focus: 'Communication & Orientation',
    stepTitle: 'DÉFI 1 — CHEFCHAOUEN',
    progress: 0.25,
    color: '#4A90D9'
  },
  fes: {
    img: require('../assets/images/intro-fes.png'),
    cityTitle: 'Fès | فاس',
    headline: 'Le Cœur Historique du Royaume',
    desc: "Au seuil de Bab Boujloud, la famille Ben Ali s'imprègne de douze siècles d'histoire. Explorez les ruelles labyrinthiques de la plus grande médina du monde, où chaque pierre conte le savoir ancestral de Fès.",
    focus: 'Artisanat & Spiritualité',
    stepTitle: 'DÉFI 2 — FÈS',
    progress: 0.5,
    color: '#d4a843'
  },
  marrakech: {
    img: require('../assets/images/marrakech-intro-bg.jpg'),
    cityTitle: 'Marrakech | مراكش',
    headline: 'Le Cœur Battant du Sud | قلب الجنوب النابض',
    desc: "Au milieu de l'effervescence de Jemaa el-Fna, la famille Ben Ali s'apprête à relever un défi de taille. Apprenez à naviguer dans la complexité des échanges commerciaux au cœur de la ville ocre.",
    focus: 'Commerce & Négociation',
    stepTitle: 'DÉFI 3 — MARRAKECH',
    progress: 0.75,
    color: '#e2711d' 
  },
  laayoune: {
    img: require('../assets/images/intro-laayoune-v2.png'),
    cityTitle: 'Laâyoune | العيون',
    headline: "Le Désert de l'Innovation",
    desc: "Au cœur du Sahara, la famille Ben Ali découvre les opportunités d'un territoire en pleine transformation. Apprenez à cultiver la créativité et l'esprit d'initiative dans ce paysage grandiose.",
    focus: "Innovation & Développement",
    stepTitle: 'DÉFI 4 — LAÂYOUNE',
    progress: 0.9,
    color: '#f4a261'
  },
  dakhla: {
    img: require('../assets/images/intro-dakhla.png'),
    cityTitle: 'Dakhla | الداخلة',
    headline: 'Le Défilé des Falaises',
    desc: "Fin du voyage. Le vent, la mer et le désert se rencontrent ici. Préparez-vous pour l'ultime défi d'endurance et de sagesse.",
    focus: 'Endurance & Sagesse',
    stepTitle: 'DÉFI FINAL — DAKHLA',
    progress: 1.0,
    color: '#2a9d8f'
  }
};

export default function IntroDefiScreen() {
  const router = useRouter();
  const { city } = useLocalSearchParams();
  
  const cityName = (city as string) || 'rabat';
  const data = CITIES_DATA[cityName] || CITIES_DATA.rabat;

  const translateY = useSharedValue(height); // Start hidden for entry animation
  const context = useSharedValue({ y: 0 });
  const isExpanded = useSharedValue(true);

  // Define collapsed and expanded positions
  // Collapsed will hide most of the text but leave the drag handle and title
  const expandedY = 0;
  const collapsedY = height * 0.4; 

  // Entry animation
  useEffect(() => {
    translateY.value = withSpring(expandedY, { damping: 15, mass: 1, stiffness: 100 });
  }, []);

  const toggleSheet = () => {
    if (isExpanded.value) {
      translateY.value = withSpring(collapsedY, { damping: 15 });
      isExpanded.value = false;
    } else {
      translateY.value = withSpring(expandedY, { damping: 15 });
      isExpanded.value = true;
    }
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      // Allow dragging but don't pull too far up above 0 (add resistance)
      let currentTranslationY = event.translationY + context.value.y;
      if (currentTranslationY < 0) {
        currentTranslationY = currentTranslationY / 3; // Resistance feeling
      }
      translateY.value = currentTranslationY;
    })
    .onEnd((event) => {
      // Snap logic based on velocity or distance
      if (event.translationY > 50 || event.velocityY > 300) {
        // Going down -> Snap to collapsed
        translateY.value = withSpring(collapsedY, { damping: 15 });
        isExpanded.value = false;
      } else if (event.translationY < -50 || event.velocityY < -300) {
        // Going up -> Snap to expanded
        translateY.value = withSpring(expandedY, { damping: 15 });
        isExpanded.value = true;
      } else {
        // Snap back to nearest state
        if (isExpanded.value) {
          translateY.value = withSpring(expandedY, { damping: 15 });
        } else {
          translateY.value = withSpring(collapsedY, { damping: 15 });
        }
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Background Hero Image */}
      <Animated.Image 
        entering={FadeIn.duration(800)}
        source={data.img} 
        style={[StyleSheet.absoluteFillObject, styles.bgImage]} 
        resizeMode="cover"
      />
      
      {/* Dark overlay for readability */}
      <View style={styles.overlay} />
      
      {/* Zellige Pattern overlay */}
      <View style={styles.zelligeOverlay} />

      {/* Top App Bar */}
      <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${data.progress * 100}%`, backgroundColor: data.color }]} />
          </View>
          <Text style={styles.stepTitle}>{data.stepTitle}</Text>
        </View>

        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="more-vert" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Main Bottom Sheet wrapped in GestureDetector */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheet, rBottomSheetStyle]}>
          <BlurView intensity={80} tint="light" style={styles.blurContainer}>
            
            {/* Drag Handle to indicate swipeability */}
            <TouchableOpacity onPress={toggleSheet} style={styles.dragHandleContainer} activeOpacity={0.8}>
              <View style={styles.dragHandle} />
            </TouchableOpacity>
            
            <Animated.View entering={FadeInUp.delay(700)} style={styles.badgeContainer}>
              <View style={[styles.cityBadge, { backgroundColor: `${data.color}15`, borderColor: `${data.color}30` }]}>
                <MaterialIcons name="location-on" size={18} color={data.color} />
                <Text style={[styles.cityBadgeText, { color: data.color }]}>{data.cityTitle}</Text>
              </View>
            </Animated.View>

            <Animated.Text entering={FadeInUp.delay(800)} style={styles.title}>
              {data.headline}
            </Animated.Text>
            
            <Animated.Text entering={FadeInUp.delay(900)} style={styles.description}>
              {data.desc}
            </Animated.Text>

            {/* Action Button */}
            <Animated.View entering={FadeInUp.delay(1000)} style={{ width: '100%', marginTop: 24 }}>
              <TouchableOpacity 
                style={[styles.primaryBtn, { backgroundColor: data.color }]}
                onPress={() => {
                  if (cityName === 'marrakech') {
                    router.push('/pedago' as any);
                  } else if (cityName === 'fes') {
                    router.push('/defi-resultat' as any);
                  } else {
                    router.back();
                  }
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryBtnText}>Découvrir le défi</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>

              <View style={styles.socialProof}>
                <View style={styles.avatarsRow}>
                  <Image source={{uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1_hR4-L6Fp9q1m7_u-XfNqX2s0r4e_v0W7m8p9q1m7_u-XfNqX2s0r4e_v0W7m'}} style={styles.avatarMini} />
                  <Image source={{uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1_hR4-L6Fp9q1m7_u-XfNqX2s0r4e_v0W7m8p9q1m7_u-XfNqX2s0r4e_v0W7m'}} style={[styles.avatarMini, { marginLeft: -10 }]} />
                  <View style={[styles.avatarMiniNum, { marginLeft: -10, backgroundColor: `${data.color}20` }]}>
                    <Text style={[styles.avatarNumText, { color: data.color }]}>+12</Text>
                  </View>
                </View>
                <Text style={styles.socialText}>12 autres voyageurs</Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeIn.delay(1200)} style={styles.focusChip}>
              <MaterialIcons name="menu-book" size={14} color="rgba(26,26,46,0.6)" />
              <Text style={styles.focusText}>Focus: {data.focus}</Text>
            </Animated.View>

          </BlurView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bgImage: {
    width,
    height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  zelligeOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 50,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  stepTitle: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: 'Plus Jakarta Sans',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
  },
  dragHandleContainer: {
    width: '100%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  dragHandle: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  blurContainer: {
    padding: 32,
    paddingTop: 36,
    paddingBottom: 48,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  badgeContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  cityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  cityBadgeText: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 26,
    fontWeight: '900',
    color: '#1A1A2E',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 16,
  },
  description: {
    fontFamily: 'Be Vietnam Pro',
    fontSize: 15,
    color: '#404943',
    textAlign: 'center',
    lineHeight: 24,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
  },
  primaryBtnText: {
    color: '#fff',
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 'bold',
    fontSize: 16,
  },
  socialProof: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 12,
  },
  avatarsRow: {
    flexDirection: 'row',
  },
  avatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#ccc',
  },
  avatarMiniNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarNumText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  socialText: {
    fontSize: 12,
    color: 'rgba(26,26,46,0.5)',
    fontWeight: '600',
  },
  focusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },
  focusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(26,26,46,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }
});
