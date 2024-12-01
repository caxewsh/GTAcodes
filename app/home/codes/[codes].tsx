import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { supabase } from '../../../utils/supabase';
import CheatFilters from '../../../components/CheatFilters';

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
  }, [game]);

  const filteredCheats = selectedCategory
    ? cheats.filter(cheat => cheat.cheatCategory === selectedCategory)
    : cheats;

  React.useLayoutEffect(() => {
    if (game && navigation) {
      navigation.setOptions({
        headerTitle: `Cheats for ${game}`,
        headerTintColor: '#E5F993',
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: '#000',
          borderBottomColor: '#333',
          borderBottomWidth: 1,
        },
      });
    }
  }, [navigation, game]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#E5F993" />
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
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {filteredCheats.length > 0 ? (
          filteredCheats.map((item, index) => (
            <View key={`${item.cheatName}-${index}`} style={styles.card}>
              <View style={styles.cheatCategoryTag}>
                <Text style={styles.cheatCategoryText}>{item.cheatCategory.toUpperCase()}</Text>
              </View>
              <Text style={styles.cheatName}>{item.cheatName}</Text>
              <Text style={styles.cheatCode}>{item.cheatCode}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>
            No cheats available for {selectedCategory ? `${selectedCategory} category in ` : ''}{game}.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  scrollViewContainer: {
    paddingVertical: 10,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderColor: '#333',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cheatCategoryTag: {
    backgroundColor: '#E5F993',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start', // Make sure the tag doesn't stretch
    marginBottom: 8,
  },
  cheatCategoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#222', // Darker color for a good contrast with the tag background
  },
  cheatName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  cheatCode: {
    fontSize: 16,
    color: '#ddd',
    fontStyle: 'italic',
  },
  noDataText: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default GameCheatScreen;
