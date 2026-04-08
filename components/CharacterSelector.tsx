import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { CHARACTERS, Character } from '../constants/Characters';

const { width } = Dimensions.get('window');

export default function CharacterSelector() {
  const COLORS = THEME.light;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>ÉQUIPE BEN ALI</Text>
        <Text style={styles.sectionSubtitle}>Chaque membre possède un pouvoir unique</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CHARACTERS.map((char, index) => (
          <Animated.View 
            key={char.id}
            entering={FadeInRight.delay(index * 200)}
          >
            <TouchableOpacity style={styles.card} activeOpacity={0.9}>
              <View style={[styles.imageContainer, { borderColor: char.color }]}>
                <Image source={char.image} style={styles.image} />
                <View style={[styles.powerBadge, { backgroundColor: char.color }]}>
                   <MaterialIcons name="bolt" size={14} color="#fff" />
                </View>
              </View>

              <View style={styles.info}>
                <Text style={styles.name}>{char.name} <Text style={styles.arabic}>{char.arabicName}</Text></Text>
                <Text style={styles.role}>{char.role}</Text>
                
                <View style={styles.powerBox}>
                  <Text style={[styles.powerName, { color: char.color }]}>{char.power}</Text>
                  <Text style={styles.powerDesc}>{char.powerDescription}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: THEME.light.onSurfaceVariant,
    letterSpacing: 2,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.light.primary,
    marginTop: 4,
  },
  scrollContent: {
    paddingLeft: 24,
    paddingRight: 100,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    width: width * 0.75,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  imageContainer: {
    width: 90,
    height: 120,
    borderRadius: 16,
    borderWidth: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  powerBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 4,
    borderBottomLeftRadius: 8,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.light.primary,
  },
  arabic: {
    color: THEME.light.gold,
    fontSize: 16,
  },
  role: {
    fontSize: 12,
    color: THEME.light.onSurfaceVariant,
    fontWeight: '600',
    marginBottom: 12,
  },
  powerBox: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: 10,
    borderRadius: 12,
  },
  powerName: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  powerDesc: {
    fontSize: 10,
    color: THEME.light.onSurfaceVariant,
    lineHeight: 14,
  },
});
