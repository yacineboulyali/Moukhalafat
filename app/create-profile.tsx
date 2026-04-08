import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { THEME } from '../constants/theme';
import { useAuthStore } from '../stores/authStore';

const { width } = Dimensions.get('window');

const AVATARS = [
  { id: '1', source: require('../assets/images/avatar-1.jpg') },
  { id: '2', source: require('../assets/images/avatar-2.jpg') },
  { id: '3', source: require('../assets/images/avatar-3.jpg') },
  { id: '4', source: require('../assets/images/avatar-4.jpg') },
  { id: '5', source: require('../assets/images/avatar-5.jpg') },
  { id: '6', source: require('../assets/images/avatar-6.jpg') },
];

export default function CreateProfileScreen() {
  const [selectedAvatar, setSelectedAvatar] = useState('1');
  const user = useAuthStore((state) => state.user);
  const COLORS = THEME.light;

  const handleComplete = () => {
    // Dans un vrai flux, on mettrait à jour le profil ici
    router.push('/quiz');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choisis ton Avatar</Text>
        <Text style={styles.subtitle}>Sélectionne l'apparence qui te représente le mieux au Maroc.</Text>
      </View>

      <View style={styles.selectionContainer}>
        <Animated.View 
          entering={FadeInDown.duration(600)}
          style={styles.mainAvatarWrapper}
        >
          <Image 
            source={AVATARS.find(a => a.id === selectedAvatar)?.source} 
            style={styles.mainAvatar}
          />
          <View style={styles.editBadge}>
            <MaterialIcons name="check" size={20} color="#fff" />
          </View>
        </Animated.View>

        <ScrollView 
          contentContainerStyle={styles.avatarGrid}
          showsVerticalScrollIndicator={false}
        >
          {AVATARS.map((avatar, index) => (
            <Animated.View 
              key={avatar.id}
              entering={FadeInUp.delay(index * 100)}
            >
              <TouchableOpacity
                style={[
                  styles.avatarOption,
                  selectedAvatar === avatar.id && styles.avatarOptionSelected
                ]}
                onPress={() => setSelectedAvatar(avatar.id)}
              >
                <Image source={avatar.source} style={styles.avatarMini} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity 
        style={styles.nextButton}
        onPress={handleComplete}
      >
        <Text style={styles.nextButtonText}>VALIDER MON PROFIL</Text>
        <MaterialIcons name="chevron-right" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.light.background,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: THEME.light.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: THEME.light.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  selectionContainer: {
    flex: 1,
    alignItems: 'center',
  },
  mainAvatarWrapper: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 6,
    borderColor: THEME.light.gold,
    padding: 6,
    marginBottom: 40,
    position: 'relative',
    elevation: 12,
    shadowColor: THEME.light.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  mainAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 85,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 15,
    backgroundColor: THEME.light.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 40,
  },
  avatarOption: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 2,
  },
  avatarOptionSelected: {
    borderColor: THEME.light.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  avatarMini: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
  },
  nextButton: {
    backgroundColor: THEME.light.primary,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
    elevation: 4,
    shadowColor: THEME.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
