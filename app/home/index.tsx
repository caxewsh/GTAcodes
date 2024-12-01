import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PlatformCard from '../../components/PlatformCard';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.text}>Choisi ta plateforme :</Text>
      </View>
      
      <View style={styles.separator} />

      <View style={styles.cardsContainer}>
        <PlatformCard platformName="PLAYSTATION" iconName="logo-playstation" />
        <PlatformCard platformName="XBOX" iconName="logo-xbox" />
        <PlatformCard platformName="PC" iconName="desktop-outline" />
        <PlatformCard platformName="MOBILE" iconName="phone-portrait-outline" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Dark background
  },
  header: {
    alignItems: 'center',
    marginVertical: 20, // Space above and below the header
  },
  text: {
    color: '#E5F993',
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    height: 2,
    backgroundColor: '#222', // Color of the separator
    width: '80%', // Optional: Width of the separator; can be adjusted
    alignSelf: 'center',
    marginVertical: 10, // Space around the separator
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
});