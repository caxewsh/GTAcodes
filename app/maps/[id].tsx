import React from 'react';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

export default function MapWebView() {
  const { url } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: url as string }}
        style={styles.webview}
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
});