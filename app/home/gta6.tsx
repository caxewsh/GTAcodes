import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../constants/theme';
import WebView from 'react-native-webview';
import { CountdownTimer } from '../../components/CountdownTimer';
import { Ionicons } from '@expo/vector-icons';

const RELEASE_DATE = new Date('2025-10-01T12:00:00+02:00'); // Date approximative pour l'automne 2025
const TRAILER_URL = 'https://www.youtube.com/embed/QdBZY2fkU-0'; // GTA VI Trailer officiel

export default function GTA6Screen() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleWebViewError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image 
          source={require('../../assets/games/GTA6banner.jpg')} 
          style={styles.headerImage} 
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>Grand Theft Auto VI</Text>
          
          <View style={styles.countdownContainer}>
            <Text style={styles.sectionTitle}>Sortie dans :</Text>
            <CountdownTimer targetDate={RELEASE_DATE} />
          </View>

          <Text style={styles.sectionTitle}>Trailer Officiel</Text>
          <View style={styles.trailerContainer}>
            {!hasError ? (
              <WebView
                style={[styles.trailer, { opacity: isLoading ? 0 : 1 }]}
                source={{ uri: TRAILER_URL }}
                allowsFullscreenVideo
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
                onError={handleWebViewError}
              />
            ) : (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  Impossible de charger la vidéo
                </Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={handleRetry}
                >
                  <Text style={styles.retryButtonText}>Réessayer</Text>
                </TouchableOpacity>
              </View>
            )}
            {isLoading && !hasError && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>À propos</Text>
          <Text style={styles.description}>
            Grand Theft Auto VI vous emmène dans l'État de Leonida, abritant les néons et les plages de Vice City. 
            L'histoire suit Lucia et son partenaire dans leur ascension criminelle, promettant d'être l'entrée la 
            plus ambitieuse de la série à ce jour.
          </Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Date de sortie</Text>
              <Text style={styles.infoValue}>Automne 2025</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Plateformes</Text>
              <View style={styles.platformsContainer}>
                <Ionicons name="logo-playstation" size={24} color={colors.text.primary} />
                <Ionicons name="logo-xbox" size={24} color={colors.text.primary} />
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
  countdownContainer: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  trailerContainer: {
    height: 200,
    marginBottom: spacing.lg,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.background.secondary,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    zIndex: 1,
  },
  trailer: {
    flex: 1,
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  errorText: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  retryButton: {
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    fontWeight: typography.weights.bold,
  },
}); 