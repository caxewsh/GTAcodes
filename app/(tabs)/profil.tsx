import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Profil() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>profil!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Dark background
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FF5733', // Updated text color
  },
});