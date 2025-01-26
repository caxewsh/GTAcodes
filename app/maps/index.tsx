import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import GameCard from '../../components/GameCard';
import { colors, spacing } from '../../constants/theme';

const mapGames = [
  {
    title: 'GTA V',
    image: require('../../assets/games/GTA5.jpg'),
    description: 'Carte interactive de Los Santos',
    url: 'https://gta-5-map.com/'
  },
  {
    title: 'GTA San Andreas',
    image: require('../../assets/games/GTASA.jpg'),
    description: 'Carte interactive de San Andreas',
    url: 'https://mapgenie.io/grand-theft-auto-san-andreas/maps/san-andreas'
  },
  {
    title: 'GTA Vice City',
    image: require('../../assets/games/GTAVC.jpg'),
    description: 'Carte interactive de Vice City',
    url: 'https://mapgenie.io/grand-theft-auto-vice-city/maps/vice-city'
  },
  {
    title: 'GTA III',
    image: require('../../assets/games/GTA3.jpg'),
    description: 'Carte interactive de Liberty City',
    url: 'https://mapgenie.io/grand-theft-auto-3/maps/liberty-city'
  },
];

export default function MapsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={mapGames}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <GameCard
            game={item}
            onPress={() => router.push({
              pathname: '/maps/[id]',
              params: { title: item.title, url: item.url }
            })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
}); 