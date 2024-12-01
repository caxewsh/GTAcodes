// personal_workspace/github.com/GTAcodes/GTAcodes/app/platform/[platform].tsx

import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { platformGames } from '../../../constants/GameData';
import GameCard from '../../../components/GameCard'; // Ensure this import path is correct

const PlatformGamesScreen = () => {
  const { platform } = useLocalSearchParams();
  const router = useRouter();
  const platformKey = Array.isArray(platform) ? platform[0] : platform;
  const games = platformKey && platformGames[platformKey.toLowerCase()];

  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    if (navigation) {
      navigation.setOptions({
        headerTitle: `Jeux ${platformKey}`,
        headerTintColor: '#E5F993',
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: '#000',
          borderBottomColor: '#333',
          borderBottomWidth: 1,
        },
      });
    }
  }, [navigation, platformKey]);

  const handleGameSelect = (gameTitle: string) => {
    router.push({
      pathname: '/home/codes/[codes]',
      params: { game: gameTitle, platform: platformKey },
      
    });
    console.log(gameTitle, platformKey);
  };

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
              onPress={() => handleGameSelect(item.title)}
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
    paddingBottom: 80,
  },
});

export default PlatformGamesScreen;