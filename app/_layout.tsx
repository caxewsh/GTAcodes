import { Tabs } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { colors } from '../constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useBadges } from '../hooks/useBadges';
import { BadgeModal } from '../components/BadgeModal';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingModal } from '../components/OnboardingModal';

export default function AppLayout() {
  const { initialize: initializeBadges, newBadge, clearNewBadge } = useBadges();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    initializeBadges();
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (!hasLaunched) {
        setShowOnboarding(true);
        await AsyncStorage.setItem('hasLaunched', 'true');
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
    }
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <Tabs
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.header.background,
              borderBottomColor: colors.header.border,
              borderBottomWidth: 1,
            },
            headerTintColor: colors.primary,
            tabBarStyle: {
              backgroundColor: colors.tab.background,
              borderTopColor: colors.header.border,
              borderTopWidth: 1,
            },
            tabBarActiveTintColor: colors.tab.active,
            tabBarInactiveTintColor: colors.tab.inactive,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="home"
            options={{
              title: 'Accueil',
              tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
            }}
          />
          <Tabs.Screen
            name="news"
            options={{
              title: 'Actualités',
              tabBarIcon: ({ color }) => <FontAwesome size={28} name="newspaper-o" color={color} />,
              headerTitle: 'News Rockstar mag',
            }}
          />
            <Tabs.Screen
              name="maps"
              options={{
                title: 'Carte',
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="map" color={color} />,
                headerShown: true,
                headerTitle: 'Carte Interactive',
              }}
            />
          <Tabs.Screen
            name="profil"
            options={{
              title: 'Profil',
              tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
            }}
          />
        </Tabs>
        <BadgeModal 
          badge={newBadge} 
          isVisible={!!newBadge} 
          onClose={clearNewBadge}
        />
        <OnboardingModal 
          isVisible={showOnboarding}
          onClose={handleCloseOnboarding}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
