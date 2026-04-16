/**
 * app/login.tsx
 * ─────────────────────────────────────────────────────────────────
 * Écran de connexion pour les participants
 * Authentification personnalisée via la table public.app_users
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { THEME } from '../constants/theme';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Champs requis', 'Veuillez saisir votre identifiant et votre mot de passe.');
      return;
    }

    setLoading(true);
    try {
      // On récupère les infos de connexion ET le profil joueur associé
      const { data, error } = await supabase
        .from('app_users')
        .select('*, player_profiles(*)')
        .eq('username', username.toLowerCase().trim())
        .eq('password', password)
        .single();

      if (error || !data) {
        throw new Error('Identifiant ou mot de passe incorrect.');
      }

      const profile = data.player_profiles;

      // Succès - Mise à jour du store avec les données du profil joueur
      setUser({
        id: data.id,
        full_name: data.full_name,
        xp: profile.xp,
        level: profile.level,
        badges: profile.badges || [],
        created_at: data.created_at,
        username: data.username,
      } as any);

      router.replace('/accueil');
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <View style={styles.logoCircle}>
            <MaterialIcons name="explore" size={60} color={THEME.light.primary} />
          </View>
          <Text style={styles.title}>Le Voyage des Compétences</Text>
          <Text style={styles.subtitle}>رحلة المهارات</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400)} style={styles.formContainer}>
          <Text style={styles.formLabel}>Identifiant (nom_prenom)</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="person" size={20} color={THEME.light.gold} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="ex: el_ramzi_kawtar"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Text style={styles.formLabel}>Mot de passe (nom@année)</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="lock" size={20} color={THEME.light.gold} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>SE CONNECTER</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>En cas de problème, contactez votre formateur.</Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.light.background,
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.light.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '700',
    color: THEME.light.gold,
    textAlign: 'center',
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
  },
  formLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: THEME.light.onSurfaceVariant,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
    paddingHorizontal: 12,
    height: 56,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: THEME.light.onSurface,
  },
  loginBtn: {
    backgroundColor: THEME.light.primary,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    elevation: 4,
    shadowColor: THEME.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: THEME.light.onSurfaceVariant,
    textAlign: 'center',
    opacity: 0.6,
  },
});
