import React, { useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { shadows } from '../../constants/theme';

export default function NewsScreen() {
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const handleBack = () => {
    if (canGoBack) {
      webViewRef.current?.goBack();
    }
  };

  const handleHome = () => {
    webViewRef.current?.injectJavaScript(`
      window.location.href = 'https://www.rockstarmag.fr/';
      true;
    `);
  };

  return (
    <SafeAreaView 
      style={styles.container} 
      edges={['top', 'left', 'right']}
    >
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={[styles.navButton, !canGoBack && styles.disabledButton]} 
          onPress={handleBack}
          disabled={!canGoBack}
        >
          <Ionicons name="arrow-back" size={24} color={canGoBack ? colors.text.primary : colors.text.secondary} />
        </TouchableOpacity>
        <Text style={styles.title}>Actualités</Text>
        <TouchableOpacity style={styles.navButton} onPress={handleHome}>
          <Ionicons name="home" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.webviewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://www.rockstarmag.fr/' }}
          style={styles.webview}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
          injectedJavaScript={`
            document.body.style.fontSize = '16px';
            true;
          `}
        />
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  navBar: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: colors.header.background,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.header.border,
    ...shadows.small,
    justifyContent: 'space-between',
  },
  navButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.secondary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
}); 