import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');

export const MainBottomNav = () => {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { colors, isDark } = useTheme();

  const navItems = [
    { label: 'Ligue', icon: 'leaderboard', path: '/leaderboard' },
    { label: 'Carte', icon: 'map', path: '/map' },
    { label: 'Profil', icon: 'person', path: '/profil' },
    { label: 'Réglages', icon: 'settings', path: '/settings' },
  ];

  return (
    <BlurView 
      intensity={80} 
      tint={isDark ? 'dark' : 'light'} 
      style={[
        styles.bottomNav, 
        { 
          paddingBottom: Math.max(insets.bottom, 16), 
          height: 64 + Math.max(insets.bottom, 16) 
        }
      ]}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        
        return (
          <TouchableOpacity 
            key={item.path}
            style={isActive ? [styles.navItemActive, { backgroundColor: colors.primary }] : styles.navItem} 
            onPress={() => router.push(item.path as any)}
          >
            <MaterialIcons 
              name={item.icon as any} 
              size={isActive ? 22 : 24} 
              color={isActive ? colors.white : colors.onSurfaceVariant} 
            />
            {isActive ? (
              <Text style={[styles.navTextActive, { color: colors.white }]}>
                {item.label.toUpperCase()}
              </Text>
            ) : (
              <Text style={[styles.navText, { color: colors.onSurfaceVariant }]}>
                {item.label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 12,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(191, 201, 193, 0.15)',
    zIndex: 1000,
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
    minWidth: 60,
  },
  navItemActive: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  navTextActive: {
    fontSize: 10,
    fontWeight: '800',
  },
});
