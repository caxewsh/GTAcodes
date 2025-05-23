import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ImageStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { platformGames, comingSoonGames } from '../../constants/GameData';

export default function Index() {
  const router = useRouter();
  const allGames = platformGames.playstation; // Using PlayStation games as featured

  const handleGameSelect = (game: string, platform: string) => {
    router.push({
      pathname: '/home/codes/[codes]',
      params: { game, platform }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <StatusBar style="light" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>GTA Codes</Text>
          <Text style={styles.heroSubtitle}>
            Trouvez facilement les codes de triche pour tous les jeux GTA en un seul endroit
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prochainement... ⏳</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredGamesContainer}
          >
            {comingSoonGames.map((game, index) => (
              <TouchableOpacity
                key={index}
                style={styles.gameCard}
                onPress={() => {
                  if (game.title === "GTA VI") {
                    router.push('/home/gta6');
                  } else if (game.title === "GTA IV") {
                    router.push('/home/gta4');
                  }
                }}
                activeOpacity={0.7}
              >
                <Image source={game.image} style={styles.gameImage as ImageStyle} />
                <View style={styles.gameInfo}>
                  <Text style={styles.gameTitle}>{game.title}</Text>
                  <View style={styles.platformIcons}>
                    {game.platforms.map((platform) => (
                      <View key={platform} style={styles.platformIcon}>
                        <Ionicons 
                          name={getPlatformIcon(platform)}
                          size={16}
                          color={colors.text.secondary}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Les plus consultés 🔥</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredGamesContainer}
          >
            {allGames.map((game, index) => (
              <TouchableOpacity
                key={index}
                style={styles.gameCard}
                onPress={() => handleGameSelect(game.title, 'playstation')}
                activeOpacity={0.7}
              >
                <Image source={game.image} style={styles.gameImage as ImageStyle} />
                <View style={styles.gameInfo}>
                  <Text style={styles.gameTitle}>{game.title}</Text>
                  <View style={styles.platformIcon}>
                    <Ionicons 
                      name="logo-playstation"
                      size={16}
                      color={colors.text.secondary}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Par plateforme 🕹️</Text>
          <View style={styles.platformGrid}>
            {Object.keys(platformGames).map((platform) => (
              <TouchableOpacity
                key={platform}
                style={styles.platformCard}
                onPress={() => router.push(`/home/platform/${platform}`)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={getPlatformIcon(platform)}
                  size={32}
                  color={colors.primary}
                />
                <Text style={styles.platformText}>{platform.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'playstation': return 'logo-playstation';
    case 'xbox': return 'logo-xbox';
    case 'pc': return 'desktop-outline';
    case 'mobile': return 'phone-portrait-outline';
    default: return 'game-controller-outline';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingBottom: spacing.md,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  heroTitle: {
    color: colors.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  heroSubtitle: {
    color: colors.text.secondary,
    fontSize: typography.sizes.md,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: spacing.lg,
    marginBottom: spacing.md,
  },
  featuredGamesContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  gameCard: {
    width: 160,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gameImage: {
    width: '100%',
    height: 90,
    resizeMode: 'cover',
  } as ImageStyle,
  gameInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
  },
  gameTitle: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  platformIcon: {
    marginLeft: spacing.xs,
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  platformCard: {
    width: '45%',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  platformText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  platformIcons: {
    flexDirection: 'row',
    gap: 4,
  },
});