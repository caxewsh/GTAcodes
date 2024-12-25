import { Tabs } from 'expo-router';
import { colors } from '../constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useInitializeLikes } from '../hooks/useInitializeLikes';

export default function AppLayout() {
  useInitializeLikes();
  
  return (
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
  );
}
