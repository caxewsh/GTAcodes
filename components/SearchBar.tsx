import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Rechercher...'
}) => {
  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color={colors.text.secondary} style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={colors.text.secondary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
    paddingHorizontal: spacing.sm,
    ...shadows.small,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.text.primary,
    fontSize: typography.sizes.md,
  },
}); 