import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Image, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import { signInWithApple, signOut, getCurrentUser } from '../../utils/auth';
import * as Haptics from 'expo-haptics';
import EditProfileModal from '../../components/EditProfileModal';
import { supabase } from '../../utils/supabase';
import FavoritesPreview from '../../components/FavoritesPreview';
import { FavoriteItem } from '../../components/FavoritesList';
import { useBadges } from '../../hooks/useBadges';
import { Badge, BadgeProps } from '../../components/Badge';
import { usePremium } from '../../hooks/usePremium';
import { useRouter } from 'expo-router';

type IconName = keyof typeof Ionicons.glyphMap;

interface Section {
  title: string;
  data: any[];
}

export default function ProfilScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [allBadges, setAllBadges] = useState<BadgeProps[]>([]);
  const { userBadges, initialize: initializeBadges } = useBadges();
  const { isPremium } = usePremium();
  const router = useRouter();

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

  const renderProfileCard = () => {
    const truncateUsername = (name: string) => {
      return name.length > 10 ? `${name.slice(0, 10)}..` : name;
    };

    return (
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
            <View style={styles.profileTopRow}>
              <Text style={styles.username}>
                {truncateUsername(user?.user_metadata?.full_name || 'Invité')}
              </Text>
              {isPremium && (
                <View style={styles.premiumBadge}>
                  <Ionicons name="diamond" size={14} color={colors.premium.badge} />
                  <Text style={styles.premiumBadgeText}>OG</Text>
                </View>
              )}
            </View>
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
            style={styles.infoButton}
            onPress={() => router.push("/profil/user-info")}
          >
            <Ionicons name="settings-outline" size={24} color={colors.text.primary} />
            <Text style={styles.infoButtonText}>Mes informations</Text>
          </Pressable>
        )}
      </View>
    );
  };

  const renderBadgesSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Badges</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {allBadges
          .sort((a, b) => (a.trigger_value || 0) - (b.trigger_value || 0))
          .map(badge => (
            <Badge
              key={badge.id}
              id={badge.id}
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

  const renderFeaturesList = () => {
    if (isPremium) return null;
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>A venir dans l'offre Premium</Text>
        </View>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <Ionicons name="rocket-outline" size={16} color={colors.text.secondary} />
            <Text style={styles.legendText}>Arrivée imminente</Text>
          </View>
          <View style={styles.legendItem}>
            <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
            <Text style={styles.legendText}>En développement</Text>
          </View>
        </View>
        <View style={styles.featuresList}>
          {[
            { 
              icon: 'heart' as IconName, 
              text: 'Favoris illimités', 
              color: colors.premium.favorite,
              statusIcon: 'rocket-outline' as IconName
            },
            { 
              icon: 'ban' as IconName, 
              text: 'Pas de publicités', 
              color: colors.premium.notification,
              statusIcon: 'time-outline' as IconName
            },
            { 
              icon: 'notifications' as IconName, 
              text: 'Alertes de nouveaux codes', 
              color: colors.premium.notification,
              statusIcon: 'time-outline' as IconName
            },
            { 
              icon: 'trophy' as IconName, 
              text: 'Badges exclusifs', 
              color: colors.premium.badge,
              statusIcon: 'time-outline' as IconName
            },
            { 
              icon: 'bookmark' as IconName, 
              text: 'Système de collections', 
              color: colors.premium.collection,
              statusIcon: 'time-outline' as IconName
            },
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons 
                name={feature.icon} 
                size={24} 
                color={feature.color}
                style={{ opacity: 0.5 }}
              />
              <Text style={[styles.featureText, styles.featureTextLocked]}>
                {feature.text}
              </Text>
              <Ionicons name={feature.statusIcon} size={20} color={colors.text.secondary} />
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderFavoritesPreview = () => (
    <FavoritesPreview />
  );

  const sections = [
    { title: 'profile', data: [null] },
    { title: 'favorites', data: [null] },
    { title: 'badges', data: [null] },
    { title: 'features', data: [null] },
    { title: 'logout', data: [null] }
  ];

  const renderLogoutSection = () => {
    if (!user) return null;
    
    return (
      <View style={styles.logoutSection}>
        <Pressable 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutButtonText}>Se déconnecter</Text>
        </Pressable>
      </View>
    );
  };

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
      case 'logout':
        return renderLogoutSection();
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
    paddingBottom: spacing.xs,
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
    padding: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
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
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.premium.badge,
    gap: spacing.xs,
  },
  premiumBadgeText: {
    color: colors.premium.badge,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  premiumButtonDisabled: {
    backgroundColor: colors.background.tertiary,
    opacity: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  premiumButtonTextDisabled: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  legendContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  logoutSection: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.tertiary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  infoButtonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
}); 