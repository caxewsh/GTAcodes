// GameCard.tsx

import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, View, ImageStyle } from 'react-native';
import { colors, spacing, shadows, borderRadius } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface GameCardProps {
  game: {
    title: string;
    image: any;
    description: string;
  };
  onPress: () => void;
}

const GameCard = ({ game, onPress }: GameCardProps) => {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image 
        source={game.image} 
        style={styles.image as ImageStyle}
      />
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{game.title}</Text>
          <Text style={styles.description}>{game.description}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={colors.text.secondary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.small,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  iconContainer: {
    marginLeft: spacing.sm,
  },
});

export default GameCard;