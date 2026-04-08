import React from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../constants/theme';
import { BADGES, Badge } from '../constants/Badges';

const { width } = Dimensions.get('window');

export default function BadgeShowcase() {
  const COLORS = THEME.light;

  const renderBadge = ({ item, index }: { item: Badge; index: number }) => {
    const rarityColor = 
      item.rarity === 'legendary' ? '#FFD700' : 
      item.rarity === 'epic' ? '#A335EE' : 
      item.rarity === 'rare' ? '#0070DD' : '#4CAF50';

    return (
      <Animated.View 
        entering={ZoomIn.delay(index * 100).duration(500)}
        style={styles.badgeCard}
      >
        <LinearGradient
          colors={['#fff', '#fefefe']}
          style={styles.cardGradient}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${rarityColor}15`, borderColor: rarityColor }]}>
            <MaterialIcons name={item.icon as any} size={32} color={rarityColor} />
            {item.rarity === 'legendary' && (
              <View style={styles.shine} />
            )}
          </View>
          
          <View style={styles.badgeInfo}>
            <Text style={styles.badgeName}>{item.name}</Text>
            <Text style={styles.badgeArabic}>{item.arabicName}</Text>
            <View style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
              <Text style={styles.rarityText}>{item.rarity.toUpperCase()}</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialIcons name="auto-awesome" size={24} color={THEME.light.gold} />
          <Text style={styles.sectionTitle}>BIJOUX DE COMPÉTENCES</Text>
        </View>
        <Text style={styles.sectionSubtitle}>Collectionnez les trésors de votre voyage</Text>
      </View>

      <FlatList
        data={BADGES}
        renderItem={renderBadge}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={width * 0.45 + 16}
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: THEME.light.onSurfaceVariant,
    letterSpacing: 2,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.light.primary,
    marginTop: 4,
  },
  listContent: {
    paddingLeft: 24,
    paddingRight: 100,
    gap: 16,
  },
  badgeCard: {
    width: width * 0.45,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 10,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  badgeInfo: {
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '900',
    color: THEME.light.primary,
    textAlign: 'center',
  },
  badgeArabic: {
    fontSize: 16,
    color: THEME.light.gold,
    fontWeight: '700',
    marginBottom: 8,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rarityText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.4)',
    transform: [{ rotate: '45deg' }, { translateY: -40 }],
  },
});
