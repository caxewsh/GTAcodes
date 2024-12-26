import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Image, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import { signInWithApple, signOut, getCurrentUser } from '../../utils/auth';
import * as Haptics from 'expo-haptics';
import EditProfileModal from '../../components/EditProfileModal';
import { supabase } from '../../utils/supabase';
import { useLikedCodes } from '../../hooks/useLikedCodes';
import FavoritesPreview from '../../components/FavoritesPreview';
import { FavoriteItem } from '../../components/FavoritesList';
import { useBadges } from '../../hooks/useBadges';
import { Badge } from '../../components/Badge';

type IconName = keyof typeof Ionicons.glyphMap;

interface Section {
  title: string;
  data: any[];
}

export default function ProfilScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const MAX_FREE_FAVORITES = 10;
  const { likedCodes } = useLikedCodes();
  const MAX_FREE_LIKES = 10;
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const { userBadges, initialize: initializeBadges } = useBadges();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const fetchAllBadges = async () => {
      const { data: badges } = await supabase
        .from('badges')
        .select('*')
        .order('trigger_value', { ascending: true });
      
      setAllBadges(badges || []);
    };
    
    fetchAllBadges();
    if (user) {
      initializeBadges();
    }
  }, [user]);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.log('Error checking user:', error);
      // Don't show alert here as it might be annoying on app launch
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      Haptics.selectionAsync();
      const data = await signInWithApple();
      
      // If sign in was cancelled or failed, data will be null
      if (!data) {
        // Don't log anything for cancellation
        return;
      }
      
      await checkUser();
    } catch (error: any) {
      if (error.message !== 'The user canceled the authorization attempt') {
        console.error('Error signing in:', error);
        Alert.alert(
          'Erreur de connexion',
          "Impossible de se connecter avec Apple. Veuillez réessayer."
        );
      }
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

  const handleUpdateProfile = async (data: { username: string }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: data.username }
      });
      
      if (error) throw error;
      checkUser(); // Refresh user data
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Erreur', "Impossible de mettre à jour le profil");
    }
  };

  const handleRemoveFavorite = async (id: string) => {
    try {
      // Remove from Supabase
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setFavorites(prev => prev.filter(fav => fav.id !== id));
    } catch (error) {
      console.error('Error removing favorite:', error);
      Alert.alert('Erreur', "Impossible de supprimer le favori");
    }
  };

  const renderProfileCard = () => (
    <View style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image 
            source={require('../../assets/carljohnson.jpg')}
            style={styles.avatar}
          />
          {user && (
            <Pressable style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color={colors.text.primary} />
            </Pressable>
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.username}>
            {user?.user_metadata?.full_name || 'Invité'}
          </Text>
          {user && (
            <Pressable 
              style={styles.editButton}
              onPress={() => setEditModalVisible(true)}
            >
              <Text style={styles.editButtonText}>Modifier le profil</Text>
            </Pressable>
          )}
        </View>
      </View>
      {!user && (
        <Pressable 
          style={styles.appleButton}
          onPress={handleSignIn}
        >
          <Ionicons name="logo-apple" size={24} color={colors.text.primary} />
          <Text style={styles.appleButtonText}>Continuer avec Apple</Text>
        </Pressable>
      )}
      {user && (
        <Pressable 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutButtonText}>Se déconnecter</Text>
        </Pressable>
      )}
    </View>
  );

  const renderBadgesSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Badges</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {allBadges
          .sort((a, b) => (a.trigger_value || 0) - (b.trigger_value || 0))
          .map(badge => (
            <Badge
              key={badge.id}
              name={badge.name}
              description={badge.description}
              trigger_type={badge.trigger_type}
              isLocked={!user || !userBadges.some(ub => ub.id === badge.id)}
              isAuthenticated={!!user}
            />
          ))}
      </ScrollView>
    </View>
  );

  const renderFeaturesList = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Fonctionnalités Premium</Text>
      </View>
      {!isPremium && (
        <Pressable 
          style={styles.premiumButton}
          onPress={() => {/* Implement in-app purchase */}}
        >
          <Text style={styles.premiumButtonText}>Débloquer (0,99 €)</Text>
        </Pressable>
      )}
      <View style={styles.featuresList}>
        {[
          { 
            icon: 'heart' as IconName, 
            text: 'Favoris illimités', 
            locked: !isPremium,
            color: colors.premium.favorite
          },
          { 
            icon: 'notifications' as IconName, 
            text: 'Alertes de nouveaux codes', 
            locked: !isPremium,
            color: colors.premium.notification
          },
          { 
            icon: 'trophy' as IconName, 
            text: 'Débloquez des badges exclusifs', 
            locked: !isPremium,
            color: colors.premium.badge
          },
          { 
            icon: 'color-palette' as IconName, 
            text: 'Thèmes personnalisés', 
            locked: !isPremium,
            color: colors.premium.theme
          },
          { 
            icon: 'bookmark' as IconName, 
            text: 'Collections illimitées', 
            locked: !isPremium,
            color: colors.premium.collection
          },
        ].map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons 
              name={feature.icon} 
              size={24} 
              color={feature.color}
              style={{ opacity: feature.locked ? 0.5 : 1 }}
            />
            <Text style={[
              styles.featureText,
              feature.locked && styles.featureTextLocked
            ]}>{feature.text}</Text>
            {feature.locked && <Ionicons name="lock-closed" size={20} color={colors.text.secondary} />}
          </View>
        ))}
      </View>
    </View>
  );

  const renderFavoritesPreview = () => (
    <FavoritesPreview isPremium={isPremium} />
  );

  const sections = [
    { title: 'profile', data: [null] },
    { title: 'favorites', data: [null] },
    { title: 'badges', data: [null] },
    { title: 'features', data: [null] }
  ];

  const renderSection = ({ section }: { section: Section }) => {
    switch (section.title) {
      case 'profile':
        return renderProfileCard();
      case 'favorites':
        return renderFavoritesPreview();
      case 'badges':
        return renderBadgesSection();
      case 'features':
        return renderFeaturesList();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        renderItem={renderSection}
        renderSectionHeader={() => null}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleUpdateProfile}
        currentUsername={user?.user_metadata?.full_name || ''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.md,
  },
  section: {
    padding: spacing.md,
  },
  sectionHeader: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  profileCard: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.small,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  editAvatarButton: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: colors.background.tertiary,
    padding: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profileInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  username: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  editButton: {
    marginTop: spacing.xs,
  },
  editButtonText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
  },
  badgeCard: {
    width: 120,
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  badgeCardLocked: {
    opacity: 0.7,
  },
  badgeName: {
    color: colors.text.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  badgeDescription: {
    color: colors.text.secondary,
    fontSize: typography.sizes.xs,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  badgeLockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  featureText: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    marginLeft: spacing.md,
    flex: 1,
  },
  featureTextLocked: {
    color: colors.text.secondary,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.tertiary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  appleButtonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  signOutButton: {
    backgroundColor: colors.background.tertiary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  signOutButtonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
  },
  premiumButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  premiumButtonText: {
    color: colors.text.dark,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  featuresList: {
    gap: spacing.sm,
  },
  achievementCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.primary,
    width: '100%',
    minHeight: 140,
    ...shadows.small,
  },
  achievementName: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.sm,
    paddingRight: spacing.xl * 2,
    width: '100%',
  },
  achievementsContainer: {
    paddingHorizontal: 0,
  },
  premiumOverlay: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background.tertiary,
    padding: spacing.xs,
    borderRadius: borderRadius.full,
  },
  emptyBadgeState: {
    width: 200,
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
    minHeight: 150,
  },
  emptyStateText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
}); 