import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { supabase } from '../../../utils/supabase';
import CheatFilters from '../../../components/CheatFilters';
import { colors, spacing, typography, borderRadius, shadows } from '../../../constants/theme';

interface CheatCode {
  cheatName: string;
  cheatCode: string;
  cheatCategory: string;
}

const GameCheatScreen = () => {
  const { game, platform } = useLocalSearchParams();
  const navigation = useNavigation();
  const [cheats, setCheats] = useState<CheatCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  React.useLayoutEffect(() => {
    if (game && navigation) {
      navigation.setOptions({
        headerTitle: `Codes ${game}`,
        headerBackTitle: 'Retour'
      });
    }
  }, [navigation, game]);

  useEffect(() => {
    const fetchCheats = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('CheatsGTA5V2')
          .select('cheatName, cheatCode, cheatCategory')
          .eq('game', game)
          .eq('platform', platform);

        if (error) {
          console.error('Error fetching cheats:', error);
          setCheats([]);
        } else {
          setCheats(data || []);
          const uniqueCategories = [...new Set(data?.map(cheat => cheat.cheatCategory))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheats();
  }, [game, platform]);

  const filteredCheats = selectedCategory
    ? cheats.filter(cheat => cheat.cheatCategory === selectedCategory)
    : cheats;

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CheatFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <ScrollView 
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredCheats.length > 0 ? (
          filteredCheats.map((item, index) => (
            <View key={`${item.cheatName}-${index}`} style={styles.card}>
              <View style={styles.cheatCategoryTag}>
                <Text style={styles.cheatCategoryText}>
                  {item.cheatCategory.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.cheatName}>{item.cheatName}</Text>
              <Text style={styles.cheatCode}>{item.cheatCode}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>
            Aucun code disponible pour {selectedCategory ? `la catégorie ${selectedCategory} dans ` : ''}{game}.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  scrollViewContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.small,
  },
  cheatCategoryTag: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  cheatCategoryText: {
    color: colors.text.dark,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  cheatName: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  cheatCode: {
    color: colors.text.secondary,
    fontSize: typography.sizes.md,
    fontFamily: 'monospace',
  },
  noDataText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.md,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

export default GameCheatScreen;
