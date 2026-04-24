import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface FullScreenLoaderProps {
  message?: string;
  error?: string | null;
  onRetry?: () => void;
}

export function FullScreenLoader({ message = 'Chargement en cours...', error, onRetry }: FullScreenLoaderProps) {
  const { colors } = useTheme();

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ fontSize: 40, marginBottom: 16 }}>⚠️</Text>
        <Text style={[styles.errorText, { color: '#ef4444' }]}>Oups! Une erreur est survenue.</Text>
        <Text style={[styles.errorDetail, { color: colors.onSurfaceVariant }]}>{error}</Text>
        
        {onRetry && (
          <View style={{ marginTop: 24 }}>
            <Text 
              onPress={onRetry} 
              style={[styles.retryButton, { backgroundColor: colors.gold, color: colors.white }]}
            >
              RÉESSAYER
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.gold} />
      <Text style={[styles.message, { color: colors.onSurfaceVariant }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorDetail: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    fontWeight: 'bold',
    overflow: 'hidden',
  }
});
