import React, { useEffect } from 'react';
import { SoundService } from '../services/sounds';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { SafeBlurView } from '../components/SafeBlurView';
import Animated, { 
  FadeInDown, 
  FadeInUp,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
import { AVATARS, getAvatarById } from '../constants/Avatars';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2c4e3e',
  secondary: '#8e4e14',
  gold: '#cca72f',
  surface: '#fdf9f3',
  onSurface: '#1c1c18',
  onSurfaceVariant: '#404943',
  white: '#ffffff',
  accent: '#D16B4B',
};

const LeaderboardItem = ({ rank, name, xp, isUser, delay }: { rank: number, name: string, xp: number, isUser?: boolean, delay: number }) => (
  <Animated.View 
    entering={FadeInUp.delay(delay).springify().damping(15).stiffness(80)}
    style={[styles.itemCard, isUser && styles.userItemCard]}
  >
    <View style={styles.rankContainer}>
      {rank <= 3 ? (
        <FontAwesome5 
          name="crown" 
          size={16} 
          color={rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32'} 
        />
      ) : (
        <Text style={styles.rankText}>{rank}</Text>
      )}
    </View>
    
    <View style={styles.avatarMini}>
      <Image source={getAvatarById(name === 'Yassine' ? 'explorer' : (rank % 2 === 0 ? 'boy' : 'girl'))} style={styles.avatarMiniImg} />
    </View>

    <View style={styles.nameContainer}>
      <Text style={[styles.nameText, isUser && styles.userNameText]}>{name}</Text>
      <Text style={styles.rankLabel}>{rank === 1 ? 'Légende' : 'Voyageur'}</Text>
    </View>

    <View style={styles.xpContainer}>
      <Text style={styles.xpValue}>{xp}</Text>
      <Text style={styles.xpUnit}>XP</Text>
    </View>
  </Animated.View>
);

export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    SoundService.getInstance().playSound('whoosh');
  }, []);

  const mockData = [
    { rank: 1, name: "Sofia", xp: 12450 },
    { rank: 2, name: "Amine", xp: 11200 },
    { rank: 3, name: "Leila", xp: 10850 },
    { rank: 4, name: "Yassine", xp: 9800, isUser: true },
    { rank: 5, name: "Karim", xp: 8500 },
    { rank: 6, name: "Fatima", xp: 7200 },
    { rank: 7, name: "Omar", xp: 6800 },
    { rank: 8, name: "Driss", xp: 5400 },
  ];

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={[COLORS.primary, '#1a3d2e']}
        style={styles.headerGradient}
      >
        <SafeAreaView style={styles.headerContent}>
          <View style={styles.topActions}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>CLASSEMENT</Text>
            <TouchableOpacity style={styles.backBtn}>
              <MaterialIcons name="share" size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.topThreeContainer}>
            <Animated.View entering={FadeInUp.delay(500).springify()} style={[styles.podiumItem, { marginTop: 40 }]}>
              <View style={[styles.podiumAvatar, { borderColor: '#C0C0C0' }]}>
                <Image source={AVATARS.boy} style={styles.avatarImg} />
              </View>
              <Text style={styles.podiumName}>Amine</Text>
              <View style={[styles.podiumBase, { height: 60, backgroundColor: '#C0C0C030' }]}>
                <Text style={styles.podiumRank}>2</Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.podiumItem}>
              <FontAwesome5 name="crown" size={24} color="#FFD700" style={styles.crownIcon} />
              <View style={[styles.podiumAvatar, { width: 90, height: 90, borderRadius: 45, borderColor: '#FFD700' }]}>
                <Image source={AVATARS.girl} style={styles.avatarImg} />
              </View>
              <Text style={[styles.podiumName, { fontWeight: '900' }]}>Sofia</Text>
              <View style={[styles.podiumBase, { height: 90, backgroundColor: '#FFD70030' }]}>
                <Text style={styles.podiumRank}>1</Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(700).springify()} style={[styles.podiumItem, { marginTop: 50 }]}>
              <View style={[styles.podiumAvatar, { borderColor: '#CD7F32' }]}>
                <Image source={AVATARS.mentor} style={styles.avatarImg} />
              </View>
              <Text style={styles.podiumName}>Leila</Text>
              <View style={[styles.podiumBase, { height: 45, backgroundColor: '#CD7F3230' }]}>
                <Text style={styles.podiumRank}>3</Text>
              </View>
            </Animated.View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.listContainer}>
        <SafeBlurView intensity={100} tint="light" style={styles.listBlur}>
          <ScrollView 
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Top Voyageurs</Text>
              <Text style={styles.listSubtitle}>Semaine du 7 Avril</Text>
            </View>

            {mockData.slice(3).map((item, index) => (
              <LeaderboardItem 
                key={index}
                rank={item.rank}
                name={item.name}
                xp={item.xp}
                isUser={item.isUser}
                delay={1000 + index * 100}
              />
            ))}

            <Animated.View entering={FadeInUp.delay(2000)} style={{ marginTop: 24, marginBottom: 40 }}>
              <TouchableOpacity
                style={styles.coachingBtn}
                onPress={() => router.push('/coaching')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.primary, '#1a3d2e']}
                  style={styles.coachingBtnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.coachingBtnText}>Analyser mes performances</Text>
                  <MaterialIcons name="insights" size={24} color={COLORS.white} />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </SafeBlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  headerGradient: {
    height: 400,
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginTop: 20,
    paddingBottom: 20,
  },
  podiumItem: {
    alignItems: 'center',
    width: width * 0.25,
  },
  podiumAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  podiumInitial: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '800',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  podiumName: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  podiumBase: {
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumRank: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '900',
    opacity: 0.8,
  },
  crownIcon: {
    position: 'absolute',
    top: -25,
    zIndex: 1,
  },
  listContainer: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    overflow: 'hidden',
  },
  listBlur: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  listHeader: {
    marginBottom: 24,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
  },
  listSubtitle: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    marginTop: 4,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  userItemCard: {
    backgroundColor: '#f1f8f4',
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.onSurfaceVariant,
  },
  avatarMini: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gold + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.gold,
  },
  avatarMiniImg: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  nameContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  userNameText: {
    color: COLORS.primary,
    fontWeight: '900',
  },
  rankLabel: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  xpContainer: {
    alignItems: 'flex-end',
  },
  xpValue: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
  },
  xpUnit: {
    fontSize: 10,
    color: COLORS.onSurfaceVariant,
    fontWeight: '700',
  },
  coachingBtn: {
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  coachingBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 16,
  },
  coachingBtnText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
