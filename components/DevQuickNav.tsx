import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const ROUTES = [
  // --- LES PLUS RÉCENTS ---
  { name: '📝', path: '/(challenges)/short-answer?questionIndex=6' },
  { name: '🔍', path: '/(challenges)/error-detection?questionIndex=7' },
  { name: '🎭', path: '/(challenges)/scenario-cascade?questionIndex=8' },
  { name: '🔗', path: '/(challenges)/matching?questionIndex=2' },
  { name: '🧩', path: '/(challenges)/puzzle-riddle?questionIndex=5' },
  { name: '✅', path: '/(challenges)/true-false?questionIndex=1' },
  { name: '✏️', path: '/(challenges)/multiple-choice?questionIndex=0' },
  { name: '🕳️', path: '/(challenges)/fill-blanks?questionIndex=4' },
  { name: '🔢', path: '/(challenges)/ranking-challenge?questionIndex=3' },
  { name: '💬', path: '/(challenges)/scenario-dialogue' },

  // --- MAJLIS ---
  { name: '🧔', path: '/profil-classique' },

  // --- PAGES PROJET & CORE ---
  { name: '🏅', path: '/badges' },
  { name: '🎓', path: '/certificate' },
  { name: '🏆', path: '/defi-resultat' },
  { name: '🎬', path: '/intro-defi' },
  { name: '🧠', path: '/coaching' },
  { name: '🗺️', path: '/map' },
  { name: '📖', path: '/pedago' },
  { name: '👤', path: '/profil' },
  { name: '📊', path: '/leaderboard' },
  { name: '⚙️', path: '/settings' },
  { name: '👨‍👩‍👧‍👦', path: '/family-setup' },
  
  // --- AUTH & ONBOARDING ---
  { name: '👋', path: '/welcome' },
  { name: '🚀', path: '/' },
  { name: '🏠', path: '/accueil' },
  { name: '📽️', path: '/welcome' },
  { name: '👪', path: '/family-setup' },
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
    position: 'relative',
    width: '100%',
    backgroundColor: 'rgba(26, 61, 46, 0.98)', // Vert Zellige Profond
    paddingTop: 10, 
    paddingBottom: 25, 
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
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
