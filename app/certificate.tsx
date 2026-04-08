import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { SoundService } from '../services/sounds';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2c4e3e',
  surface: '#fdf9f3',
  onSurface: '#1c1c18',
  gold: '#D4AF37',
  goldGradient: ['#D4AF37', '#F3E5AB'],
  white: '#ffffff',
  shadow: 'rgba(28, 28, 24, 0.08)',
};

export default function CertificateScreen() {
  const insets = useSafeAreaInsets();
  const sealScale = useSharedValue(0);

  useEffect(() => {
    // Effet sonore à l'ouverture
    SoundService.getInstance().playSound('success');
    
    // Animation du sceau
    sealScale.value = withDelay(1200, withSpring(1, { damping: 10 }));
    
    // Haptique de succès après un court délai
    setTimeout(() => {
      SoundService.getInstance().triggerHaptic('success');
    }, 1500);
  }, []);

  const sealAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sealScale.value }],
  }));

  const onShare = async () => {
    SoundService.getInstance().triggerHaptic('light');
    try {
      await Share.share({
        message: 'Je viens de recevoir mon Certificat de Compétences sur Le Voyage ! 🏆',
      });
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.surface, '#f1ede7']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          onPress={() => {
            SoundService.getInstance().triggerHaptic('light');
            router.back();
          }} 
          style={styles.backBtn}
        >
          <Ionicons name="close" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Félicitations</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Certificate Container */}
        <Animated.View 
          entering={FadeInDown.duration(1000)} 
          style={styles.certificateCard}
        >
          <View style={styles.certBorder}>
            <View style={styles.certInner}>
              {/* Patterns Zellige en fond - Optionnel avec image réelle */}
              <View style={styles.zelligePattern} />
              
              <Animated.View entering={FadeInUp.delay(300)} style={styles.certHeader}>
                {/* Remplacer par l'image réelle de Stitch si disponible */}
                <MaterialIcons name="auto-awesome" size={40} color={COLORS.gold} />
                <Text style={styles.certTitle}>CERTIFICAT DE RÉCOMPENSE</Text>
                <View style={styles.titleDivider} />
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(500)} style={styles.certBody}>
                <Text style={styles.certSubtitle}>Présenté à</Text>
                <Text style={styles.userName}>YASSINE BENALI</Text>
                <Text style={styles.certDesc}>
                  Pour avoir démontré une maîtrise exceptionnelle des compétences
                  interculturelles et stratégiques lors de son épopée à travers
                  les régions du Maroc.
                </Text>
                
                <Text style={styles.skillTitle}>Titre Honorifique</Text>
                <Text style={styles.honorBadge}>AMBASSADEUR DES COMPÉTENCES</Text>
              </Animated.View>

              <View style={styles.certFooter}>
                <View style={styles.signatureCol}>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureText}>Le Stratège</Text>
                </View>

                {/* Sceau doré animé */}
                <Animated.View style={[styles.sealContainer, sealAnimatedStyle]}>
                  <View style={styles.sealCircle}>
                    <MaterialIcons name="verified" size={40} color={COLORS.gold} />
                  </View>
                  <Text style={styles.sealText}>OFFICIEL</Text>
                </Animated.View>

                <View style={styles.signatureCol}>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureText}>Date : {new Date().toLocaleDateString()}</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Buttons Action */}
        <Animated.View entering={FadeInDown.delay(1800)} style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => SoundService.getInstance().triggerHaptic('medium')}
          >
            <LinearGradient
              colors={['#2c4e3e', '#1a3d2e']}
              style={styles.btnGradient}
            >
              <MaterialIcons name="file-download" size={24} color={COLORS.white} />
              <Text style={styles.primaryBtnText}>Télécharger le PDF</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareBtn} onPress={onShare}>
            <Ionicons name="share-social" size={22} color={COLORS.primary} />
            <Text style={styles.shareBtnText}>Partager ma réussite</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Confetti Overlay Placeholder */}
      <View style={styles.confettiOverlay} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  certificateCard: {
    width: '100%',
    aspectRatio: 0.7,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
    marginVertical: 20,
  },
  certBorder: {
    flex: 1,
    margin: 12,
    borderWidth: 2,
    borderColor: COLORS.gold,
    padding: 4,
  },
  certInner: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gold,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  zelligePattern: {
    position: 'absolute',
    opacity: 0.03,
    width: width,
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  certHeader: {
    alignItems: 'center',
    marginTop: 20,
  },
  certTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 10,
  },
  titleDivider: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.gold,
    marginTop: 8,
    alignSelf: 'center',
  },
  certBody: {
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  certSubtitle: {
    fontSize: 14,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  certDesc: {
    fontSize: 13,
    lineHeight: 20,
    color: '#404943',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  skillTitle: {
    fontSize: 11,
    color: COLORS.gold,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  honorBadge: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 4,
  },
  certFooter: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  signatureCol: {
    alignItems: 'center',
    width: '30%',
  },
  signatureLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#C0C0C0',
    marginBottom: 6,
  },
  signatureText: {
    fontSize: 10,
    color: '#808080',
  },
  sealContainer: {
    alignItems: 'center',
  },
  sealCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffcf5',
  },
  sealText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginTop: 4,
  },
  actions: {
    width: '100%',
    paddingBottom: 40,
  },
  primaryBtn: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  shareBtnText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
  },
  confettiOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  }
});
