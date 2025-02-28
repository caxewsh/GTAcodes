import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { router } from 'expo-router';

const PLATFORMS = [
  { id: 'ps5', name: 'PlayStation 5', icon: 'logo-playstation' },
  { id: 'ps4', name: 'PlayStation 4', icon: 'logo-playstation' },
  { id: 'xbox', name: 'Xbox Series', icon: 'logo-xbox' },
  { id: 'pc', name: 'PC', icon: 'desktop-outline' },
];

const GAMES = [
  { id: 'gta6', name: 'GTA VI' },
  { id: 'gtav', name: 'GTA V' },
  { id: 'gta4', name: 'GTA IV' },
  { id: 'gtasa', name: 'GTA San Andreas' },
  { id: 'gtavc', name: 'GTA Vice City' },
  { id: 'gta3', name: 'GTA III' },
];

export default function UserInfoScreen() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [completedGames, setCompletedGames] = useState<string[]>([]);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const toggleGame = (gameId: string) => {
    setCompletedGames(prev =>
      prev.includes(gameId)
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  const savePreferences = () => {
    // Pour l'instant, on ferme simplement la modale
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.title}>Mes informations</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes plateformes</Text>
          <View style={styles.platformsList}>
            {PLATFORMS.map(platform => (
              <Pressable
                key={platform.id}
                style={[
                  styles.platformItem,
                  selectedPlatforms.includes(platform.id) && styles.platformItemSelected
                ]}
                onPress={() => togglePlatform(platform.id)}
              >
                <Ionicons 
                  name={platform.icon as any} 
                  size={24} 
                  color={selectedPlatforms.includes(platform.id) 
                    ? colors.primary 
                    : colors.text.secondary
                  } 
                />
                <Text style={[
                  styles.platformText,
                  selectedPlatforms.includes(platform.id) && styles.platformTextSelected
                ]}>
                  {platform.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jeux complétés</Text>
          <View style={styles.gamesList}>
            {GAMES.map(game => (
              <View key={game.id} style={styles.gameItem}>
                <Text style={styles.gameText}>{game.name}</Text>
                <Switch
                  value={completedGames.includes(game.id)}
                  onValueChange={() => toggleGame(game.id)}
                  trackColor={{ false: colors.background.tertiary, true: colors.primary }}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Pressable style={styles.saveButton} onPress={savePreferences}>
        <Text style={styles.saveButtonText}>Enregistrer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  backButton: {
    padding: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  platformsList: {
    gap: spacing.sm,
  },
  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  platformItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.background.tertiary,
  },
  platformText: {
    marginLeft: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
  platformTextSelected: {
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  gamesList: {
    gap: spacing.sm,
  },
  gameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  gameText: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  saveButton: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.text.dark,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
}); 