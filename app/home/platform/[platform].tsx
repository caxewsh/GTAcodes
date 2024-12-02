// personal_workspace/github.com/GTAcodes/GTAcodes/app/platform/[platform].tsx

import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { platformGames, Game } from '../../../constants/GameData';
import GameCard from '../../../components/GameCard';
import { colors, spacing } from '../../../constants/theme';

const PlatformGamesScreen = () => {
  const { platform } = useLocalSearchParams();
  const router = useRouter();
  const platformKey = Array.isArray(platform) ? platform[0] : platform;
  const games = platformKey ? platformGames[platformKey.toLowerCase()] : [];

  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    if (navigation) {
      navigation.setOptions({
        title: `Jeux ${platformKey}`,
      });
    }
  }, [navigation, platformKey]);

  return (
    <View style={styles.container}>
      <FlatList<Game>
        data={games || []}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <GameCard
            game={item}
            onPress={() => router.push({
              pathname: '/home/codes/[codes]',
              params: { game: item.title, platform: platformKey }
            })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

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

export default PlatformGamesScreen;