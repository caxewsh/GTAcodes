import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewsScreen() {
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaView 
      style={styles.container} 
      edges={['left', 'right']}
    >
      <View style={styles.container}>
        <WebView
          source={{ uri: 'https://www.rockstarmag.fr/' }}
          style={styles.webview}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
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