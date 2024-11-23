import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { supabase } from '../../utils/supabase'; // Ensure supabase is configured correctly

interface CheatCode {
  cheatName: string; // Corresponds to cheatName in Supabase
  cheatCode: string; // Corresponds to cheatCode in Supabase
}

const GameCheatScreen = () => {
  const { game } = useLocalSearchParams();
  const navigation = useNavigation();
  const [cheats, setCheats] = useState<CheatCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheats = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('CheatsGTA5V2') // Replace with your Supabase table name
          .select('cheatName: cheatName, cheatCode: cheatCode') // Map columns to your desired structure
          .eq('game', game);

        if (error) {
          console.error('Error fetching cheats:', error);
          setCheats([]); // Ensure state is set even on error
        } else {
          setCheats(data || []);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheats();
  }, [game]);

  React.useLayoutEffect(() => {
    if (game && navigation) {
      navigation.setOptions({
        headerTitle: `Cheats for ${game}`,
        headerTintColor: '#FF5733',
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
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cheats}
        keyExtractor={(item) => item.cheatName}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cheatName}>{item.cheatName}</Text>
            <Text style={styles.cheatCode}>{item.cheatCode}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noDataText}>
            No cheats available for {game}.
          </Text>
        }
      />
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
  card: {
    backgroundColor: '#333',
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    borderWidth: 1,
  },
  cheatName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  cheatCode: {
    fontSize: 16,
    color: '#fff',
  },
  noDataText: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default GameCheatScreen;
