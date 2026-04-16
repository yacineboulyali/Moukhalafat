import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { SoundService } from '../../services/sounds';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Data for Matching Épuré
const DATA = {
  elements: [
    { id: '1', text: 'Couscous', category: 'Plat' },
    { id: '2', text: 'Thé à la menthe', category: 'Boisson' },
    { id: '3', text: 'Tajine', category: 'Plat' },
    { id: '4', text: 'Jus d\'orange', category: 'Boisson' },
  ]
};

export default function MatchingEpureScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  const handleAssign = (id: string, cat: string) => {
    setSelections(prev => {
      const currentRaw = prev[id];
      const current = Array.isArray(currentRaw) ? currentRaw : [];
      const isSelected = current.includes(cat);
      let next;
      if (isSelected) {
        next = current.filter(c => c !== cat);
      } else {
        next = [...current, cat];
        SoundService.getInstance().playSound('click');
        // Check if this item is now correctly classified
        const item = DATA.elements.find(e => e.id === id);
        if (item && item.category === cat) {
          SoundService.getInstance().playSound('match');
        }
      }
      return { ...prev, [id]: next };
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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

      <View style={[styles.footer, { paddingBottom: (insets.bottom || 24) + 10, backgroundColor: '#fff' }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity 
            style={styles.skipIconBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="fast-forward" size={24} color={THEME.light.primary} />
          </TouchableOpacity>
        </View>
      </View>
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
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  skipIconBtn: {
    paddingHorizontal: 24,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: THEME.light.primary + '40',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
