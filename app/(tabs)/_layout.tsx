// personal_workspace/github.com/GTAcodes/GTAcodes/app/(tabs)/_layout.tsx

import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF5733', // Use specified color for active tabs
        tabBarStyle: { backgroundColor: '#000' }, // Dark background for tab bar
        headerStyle: { 
          backgroundColor: '#000', // Dark background for header
          borderBottomColor: '#333', // Subtle separator color
          borderBottomWidth: 1, // Define separator thickness
        },
        headerTintColor: '#FF5733', // Header text color
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
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
