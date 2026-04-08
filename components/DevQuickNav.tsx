import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const ROUTES = [
  // --- LES PLUS RÉCENTS (Zellige Odyssey) ---
  { name: 'Scénario 🎭', path: '/(challenges)/scenario-dialogue' },
  { name: 'Appariement 🔗', path: '/(challenges)/matching-game' },
  { name: 'Énigme 🧩', path: '/(challenges)/puzzle-riddle' },
  { name: 'Vrai/Faux ✅', path: '/(challenges)/true-false' },
  { name: 'QCM 📝', path: '/(challenges)/multiple-choice' },
  { name: 'Trous 🕳️', path: '/(challenges)/fill-blanks' },
  { name: 'Classement 🔢', path: '/(challenges)/ranking-challenge' },

  // --- MAJLIS ---
  { name: 'Majlis Hub', path: '/majlis' },
  { name: 'Profil Majlis', path: '/profil-classique' },
  { name: 'Résumé Comp.', path: '/resume-competence' },

  // --- PAGES PROJET & CORE ---
  { name: 'Badges 🏅', path: '/badges' },
  { name: 'Certificat 🎓', path: '/certificate' },
  { name: 'Résultat Défi', path: '/defi-resultat' },
  { name: 'Intro Défi', path: '/intro-defi' },
  { name: 'Coaching', path: '/coaching' },
  { name: 'Carte 🗺️', path: '/map' },
  { name: 'Pédago', path: '/pedago' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Profil', path: '/profil' },
  { name: 'Leaderboard', path: '/leaderboard' },
  { name: 'Détail Comp.', path: '/competence-detail' },
  { name: 'Paramètres', path: '/settings' },
  
  // --- AUTH & ONBOARDING ---
  { name: 'Revelation', path: '/revelation' },
  { name: 'Quiz', path: '/quiz' },
  { name: 'Welcome', path: '/welcome' },
  { name: 'Avatar', path: '/create-profile' },
  { name: 'Accueil', path: '/accueil' },
  { name: 'Login', path: '/(auth)/login' },
  { name: 'Register', path: '/(auth)/register' },
  { name: 'Launch 🚀', path: '/' },
];

export default function DevQuickNav() {
  if (!__DEV__) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VOYAGE DEV EXPLORER | ACCÈS RAPIDE</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scroll}
        decelerationRate="fast"
      >
        {ROUTES.map((route, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => router.push(route.path as any)}
          >
            <Text style={styles.text}>{route.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 61, 46, 0.98)', // Vert Zellige Profond
    paddingTop: 18, // Ajouté +10px (était 8)
    paddingBottom: 25, // Un peu plus pour les safe areas
    zIndex: 99999,
    borderTopWidth: 2,
    borderTopColor: '#D4AF37', // Or
  },
  title: {
    color: '#D4AF37',
    fontSize: 9,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1.5,
    opacity: 0.9,
  },
  scroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  item: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)', // Light Gold
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    minWidth: 80,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
});
