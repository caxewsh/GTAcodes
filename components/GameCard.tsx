// GameCard.tsx

import React from 'react';
import { ImageBackground, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

type GameCardProps = {
  title: string;
  image: any; // Supports both URI and require sources
  description: string;
  onPress?: () => void;
};

export default function GameCard({ title, image, description, onPress }: GameCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ImageBackground
        source={typeof image === 'string' ? { uri: image } : image}
        style={styles.card}
        imageStyle={{ borderRadius: 8 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    height: 150, // Set a fixed height for the card
    justifyContent: 'flex-end', // Align content to the bottom
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5, // Add elevation for Android shadow
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White text for better contrast
    marginBottom: 5,
  },
  description: {
    color: '#fff', // Ensure description text is visible
  },
});