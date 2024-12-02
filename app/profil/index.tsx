import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, shadows, borderRadius } from '../../constants/theme';
import { signInWithApple, signOut, getCurrentUser } from '../../utils/auth';
import * as Haptics from 'expo-haptics';

export default function ProfilScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.log('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSignIn = async () => {
    try {
      Haptics.selectionAsync();
      await signInWithApple();
      checkUser();
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Erreur', "Impossible de se connecter avec Apple");
    }
  };

  const handleSignOut = async () => {
    try {
      Haptics.selectionAsync();
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Erreur', "Impossible de se déconnecter");
    }
  };

  const renderAuthSection = () => (
    <View style={styles.authSection}>
      <Ionicons name="person-circle-outline" size={64} color={colors.primary} />
      <Text style={styles.authTitle}>
        {user ? `Bienvenue ${user.user_metadata?.full_name || ''}!` : 'Connectez-vous'}
      </Text>
      <Text style={styles.authSubtitle}>
        {user 
          ? 'Gérez vos codes favoris et vos préférences'
          : 'Créez un compte pour sauvegarder vos codes favoris'}
      </Text>
      
      {!user ? (
        <Pressable 
          style={styles.appleButton}
          onPress={handleSignIn}
        >
          <Ionicons name="logo-apple" size={24} color={colors.text.primary} />
          <Text style={styles.appleButtonText}>Continuer avec Apple</Text>
        </Pressable>
      ) : (
        <Pressable 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutButtonText}>Se déconnecter</Text>
        </Pressable>
      )}
    </View>
  );

  const renderFavoritesSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Vos favoris</Text>
      {user ? (
        <>
          <Pressable style={styles.favoriteCard}>
            <Ionicons name="star" size={24} color={colors.primary} />
            <Text style={styles.favoriteTitle}>Codes favoris</Text>
            <Text style={styles.favoriteCount}>0 codes</Text>
          </Pressable>
          
          <Pressable style={styles.favoriteCard}>
            <Ionicons name="game-controller" size={24} color={colors.primary} />
            <Text style={styles.favoriteTitle}>Jeux suivis</Text>
            <Text style={styles.favoriteCount}>0 jeux</Text>
          </Pressable>

          <Pressable style={styles.favoriteCard}>
            <Ionicons name="apps" size={24} color={colors.primary} />
            <Text style={styles.favoriteTitle}>Plateformes préférées</Text>
            <Text style={styles.favoriteCount}>0 plateformes</Text>
          </Pressable>
        </>
      ) : (
        <Text style={styles.emptyText}>
          Connectez-vous pour voir vos favoris
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {renderAuthSection()}
        {renderFavoritesSection()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  authSection: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  authTitle: {
    color: colors.text.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginTop: spacing.md,
  },
  authSubtitle: {
    color: colors.text.secondary,
    fontSize: typography.sizes.md,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  authButtons: {
    width: '100%',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.text.dark,
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.md,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.border.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.md,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
  },
  favoriteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.small,
  },
  favoriteTitle: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginLeft: spacing.md,
    flex: 1,
  },
  favoriteCount: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
  },
  emptyText: {
    color: colors.text.secondary,
    textAlign: 'center',
    fontSize: typography.sizes.md,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  appleButtonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  signOutButton: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  signOutButtonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
  },
}); 