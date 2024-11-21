// personal_workspace/github.com/GTAcodes/GTAcodes/app/platform/[platform].tsx

import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { platformGames } from '../../constants/GameData';
import GameCard from '../../components/GameCard'; // Ensure this import path is correct

const PlatformGamesScreen = () => {
  const { platform } = useLocalSearchParams();
  const platformKey = Array.isArray(platform) ? platform[0] : platform;
  const games = platformKey && platformGames[platformKey.toLowerCase()];

  // Hook into the navigation to configure header options
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    if (navigation) {
      navigation.setOptions({
        headerTitle: `Jeux ${platformKey}`,
        headerTintColor: '#FF5733',
        headerBackTitleVisible: false, // Hides the back title
        headerStyle: {
          backgroundColor: '#000',
          borderBottomColor: '#333',
          borderBottomWidth: 1,
        },
      });
    }
  }, [navigation, platformKey]);

  return (
    <View style={styles.container}>
      {games && (
        <FlatList
          data={games}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <GameCard
              title={item.title}
              image={item.image}
              description={item.description}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
});

export default PlatformGamesScreen;