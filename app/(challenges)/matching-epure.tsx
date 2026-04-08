import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import ChallengeTimer from '../../components/ChallengeTimer';

// Data for Matching Épuré
const DATA = {
  elements: [
    { id: '1', text: 'Couscous', category: 'Plat' },
    { id: '2', text: 'Thé à la menthe', category: 'Boisson' },
    { id: '3', text: 'Tajine', category: 'Plat' },
    { id: '4', text: 'Jus d\'orange', category: 'Boisson' },
  ]
};

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MatchingEpureScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  const handleAssign = (id: string, cat: string) => {
    setSelections(prev => {
      // Ensure we have a valid array even if prev[id] is undefined
      const currentRaw = prev[id];
      const current = Array.isArray(currentRaw) ? currentRaw : [];
      
      const isSelected = current.includes(cat);
      
      let next;
      if (isSelected) {
        next = current.filter(c => c !== cat);
      } else {
        next = [...current, cat];
      }
      
      const newSelections = { ...prev, [id]: next };
      return newSelections;
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ChallengeTimer duration={90} onTimeUp={() => router.back()} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <Text style={styles.title}>Classification Rapide</Text>
          <Text style={styles.subtitle}>Attribuez chaque élément à sa catégorie</Text>
        </Animated.View>

        <View style={styles.list}>
          {DATA.elements.map((item, idx) => (
            <Animated.View key={item.id} entering={FadeInUp.delay(300 + idx * 100)} style={styles.row}>
              <View style={styles.itemCard}>
                <Text style={styles.itemText}>{item.text}</Text>
              </View>
              
              <View style={styles.actions}>
                <TouchableOpacity 
                  style={[styles.catBtn, (selections[item.id] || []).includes('Plat') && styles.selectedBtn]}
                  onPress={() => handleAssign(item.id, 'Plat')}
                >
                  <Text style={[styles.catText, (selections[item.id] || []).includes('Plat') && styles.whiteText]}>Plat</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.catBtn, (selections[item.id] || []).includes('Boisson') && styles.selectedBtn]}
                  onPress={() => handleAssign(item.id, 'Boisson')}
                >
                  <Text style={[styles.catText, (selections[item.id] || []).includes('Boisson') && styles.whiteText]}>Boisson</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F2',
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.light.primary,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  list: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.light.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  catBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  selectedBtn: {
    backgroundColor: THEME.light.primary,
    borderColor: THEME.light.primary,
  },
  catText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.light.primary,
  },
  whiteText: {
    color: '#fff',
  },
  footer: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  }
});
