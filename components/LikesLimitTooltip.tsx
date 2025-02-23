import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { PREMIUM_LIMITS } from '../constants/premium';
import { usePremium } from '../hooks/usePremium';

export default function LikesLimitTooltip() {
  const [showTooltip, setShowTooltip] = useState(false);
  const { isPremium } = usePremium();

  if (isPremium) return null;

  return (
    <View style={styles.container}>
      <Pressable 
        onPress={() => setShowTooltip(true)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons 
          name="information-circle-outline" 
          size={20} 
          color={colors.text.secondary} 
        />
      </Pressable>
      
      <Modal
        visible={showTooltip}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTooltip(false)}
      >
        <Pressable 
          style={styles.modalContainer}
          onPress={() => setShowTooltip(false)}
        >
          <View style={styles.tooltipWrapper}>
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>
                Version gratuite limitée à {PREMIUM_LIMITS.FREE.LIKES} favoris.{'\n\n'}
                Passez en premium pour en sauvegarder plus !
              </Text>
              <Pressable 
                style={styles.closeButton}
                onPress={() => setShowTooltip(false)}
              >
                <Text style={styles.closeText}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: spacing.xs,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipWrapper: {
    padding: spacing.md,
  },
  tooltip: {
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
  },
  tooltipText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
  closeButton: {
    marginTop: spacing.sm,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  closeText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
  },
}); 