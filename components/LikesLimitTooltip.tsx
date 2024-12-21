import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export default function LikesLimitTooltip() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable 
        onPress={() => setShowTooltip(!showTooltip)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons 
          name="information-circle-outline" 
          size={20} 
          color={colors.text.secondary} 
        />
      </Pressable>
      
      {showTooltip && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
            Version gratuite limitée à 10 favoris.{'\n'}
            Passez en premium pour en sauvegarder plus !
          </Text>
          <Pressable 
            style={styles.closeButton}
            onPress={() => setShowTooltip(false)}
          >
            <Text style={styles.closeText}>OK</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: spacing.xs,
  },
  tooltip: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: colors.background.secondary,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    width: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: spacing.xs,
    zIndex: 1000,
  },
  tooltipText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
  closeButton: {
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  closeText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
  },
}); 