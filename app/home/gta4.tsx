import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const PLATFORMS = [
  { name: 'PlayStation 3', codes: 16, icon: 'logo-playstation' },
  { name: 'Xbox 360', codes: 16, icon: 'logo-xbox' },
];

export default function GTA4Screen() {
  const [isSaved, setIsSaved] = React.useState(false);
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image 
          source={require('../../assets/games/GTA4.jpg')} 
          style={styles.headerImage} 
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>Grand Theft Auto IV</Text>

          <Text style={styles.sectionTitle}>À propos</Text>
          <Text style={styles.description}>
            Niko Bellic cherche à fuir son passé et à réaliser le rêve américain à Liberty City. 
            GTA IV propose une expérience narrative mature et réaliste dans un monde ouvert 
            détaillé inspiré de New York.
          </Text>

          <View style={styles.codeSection}>
            <Text style={styles.sectionTitle}>Codes disponibles prochainement</Text>
            <View style={styles.platformList}>
              {PLATFORMS.map((platform, index) => (
                <View key={index} style={styles.platformItem}>
                  <Ionicons name={platform.icon as any} size={24} color={colors.text.primary} />
                  <Text style={styles.platformName}>{platform.name}</Text>
                  <Text style={styles.codeCount}>{platform.codes} codes</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => setIsSaved(!isSaved)}
          >
            <Ionicons 
              name={isSaved ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={colors.text.primary}
            />
            <Text style={styles.saveButtonText}>
              {isSaved ? 'Enregistré' : 'Enregistrer pour plus tard'}
            </Text>
          </TouchableOpacity>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Date de sortie</Text>
              <Text style={styles.infoValue}>29 Avril 2008</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Plateformes</Text>
              <View style={styles.platformsContainer}>
                <Ionicons name="logo-playstation" size={24} color={colors.text.primary} />
                <Ionicons name="logo-xbox" size={24} color={colors.text.primary} />
                <Ionicons name="desktop-outline" size={24} color={colors.text.primary} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  content: {
    padding: spacing.lg,
    marginTop: -20,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
    backgroundColor: colors.background.primary,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    marginHorizontal: spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  codeSection: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  platformList: {
    gap: spacing.md,
  },
  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.background.primary,
    borderRadius: 8,
  },
  platformName: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  codeCount: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  saveButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  infoItem: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: 12,
    marginHorizontal: spacing.xs,
  },
  infoLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    fontWeight: typography.weights.bold,
  },
  platformsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
}); 