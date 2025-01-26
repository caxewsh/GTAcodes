import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function MapWebView() {
  const { url, title } = useLocalSearchParams();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: loadingProgress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [loadingProgress]);

  const isValidUrl = (urlString: string | string[]) => {
    const allowedDomains = ['gta-5-map.com', 'mapgenie.io'];
    try {
      const urlObj = new URL(urlString as string);
      return allowedDomains.some(domain => urlObj.hostname.endsWith(domain));
    } catch {
      return false;
    }
  };

  if (!url || !isValidUrl(url)) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Carte non disponible</Text>
      </View>
    );
  }

  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: url as string }}
        style={styles.webview}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error:', nativeEvent);
        }}
        startInLoadingState={true}
        cacheEnabled={true}
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
        onLoadProgress={({ nativeEvent }) => {
          setLoadingProgress(nativeEvent.progress);
        }}
        renderLoading={() => (
          <View style={styles.loading}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons 
                name="map-search-outline" 
                size={80} 
                color={colors.primary} 
              />
            </View>
            <Text style={styles.loadingText}>
              Chargement de la carte {title}...
            </Text>
            <View style={styles.progressContainer}>
              <Animated.View 
                style={[
                  styles.progressBar,
                  { width }
                ]}
              />
            </View>
            <Text style={styles.loadingTip}>
              Cette carte interactive est fournie par {url?.includes('mapgenie') ? 'MapGenie' : 'GTA-5-Map'} 🗺️
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  webview: {
    flex: 1,
  },
  error: {
    color: colors.text.primary,
    textAlign: 'center',
    padding: 20,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    gap: 20,
  },
  iconWrapper: {
    padding: 20,
    borderRadius: 40,
    backgroundColor: colors.background.secondary,
  },
  loadingText: {
    color: colors.text.primary,
    fontSize: 16,
    marginTop: 10,
  },
  progressContainer: {
    width: '80%',
    height: 4,
    backgroundColor: colors.background.secondary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  loadingTip: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 40,
  }
});