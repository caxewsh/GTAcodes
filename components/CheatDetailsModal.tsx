import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import Animated, { 
  Layout,
  FadeIn,
} from 'react-native-reanimated';

interface CheatCode {
  id: number;
  cheatName: string;
  cheatCode: string;
  cheatCategory: string;
  game: string;
  platform: string;
}

interface CheatDetailsModalProps {
  isVisible: boolean;
  cheat: CheatCode | null;
  onClose: () => void;
}

export function CheatDetailsModal({ isVisible, cheat, onClose }: CheatDetailsModalProps) {
  if (!cheat) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Pressable onPress={onClose} style={styles.backButton}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </Pressable>
            <Text style={styles.title}>Détails du code</Text>
          </View>

          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
          >
            <Animated.View 
              entering={FadeIn.duration(200)}
              layout={Layout.springify().damping(15)}
              style={styles.cheatCard}
            >
              <View style={styles.cheatInfo}>
                <View style={styles.textContainer}>
                  <Text style={styles.cheatName} numberOfLines={2}>
                    {cheat.cheatName}
                  </Text>
                  <Text style={styles.gameText}>{cheat.game}</Text>
                </View>
                <View style={styles.platformContainer}>
                  <Ionicons 
                    name={cheat.platform === 'playstation' ? 'logo-playstation' : 
                          cheat.platform === 'xbox' ? 'logo-xbox' :
                          cheat.platform === 'pc' ? 'desktop-outline' :
                          'game-controller-outline'} 
                    size={20} 
                    color={colors.text.secondary}
                  />
                </View>
              </View>
              
              <Animated.View 
                entering={FadeIn.duration(150)}
                style={styles.expandedContent}
              >
                <Text style={styles.categoryText}>
                  Catégorie : {cheat.cheatCategory}
                </Text>
                <View style={styles.separator} />
                <Text style={styles.codeTitle}>Code :</Text>
                <Text style={styles.codeText}>{cheat.cheatCode}</Text>
              </Animated.View>
            </Animated.View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.background.primary,
    marginTop: 50,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  backButton: {
    padding: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  cheatCard: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  cheatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  cheatName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  gameText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  platformContainer: {
    marginLeft: spacing.md,
    padding: spacing.xs,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.sm,
  },
  expandedContent: {
    marginTop: spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border.primary,
    marginVertical: spacing.md,
  },
  categoryText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  codeTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  codeText: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.sm,
  },
}); 