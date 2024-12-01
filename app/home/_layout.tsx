import { Stack } from 'expo-router';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          title: 'Accueil'
        }} 
      />
      <Stack.Screen 
        name="platform/[platform]" 
        options={{
          headerShown: true,
          headerTintColor: '#E5F993',
          headerBackTitle: 'Retour',
          headerStyle: {
            backgroundColor: '#000',
            borderBottomColor: '#333',
            borderBottomWidth: 1,
          } as NativeStackNavigationOptions['headerStyle'],
        }}
      />
      <Stack.Screen 
        name="codes/[codes]" 
        options={{
          headerShown: true,
          headerTintColor: '#E5F993',
          headerBackTitle: 'Retour',
          headerStyle: {
            backgroundColor: '#000',
            borderBottomColor: '#333',
            borderBottomWidth: 1,
          } as NativeStackNavigationOptions['headerStyle'],
        }}
      />
    </Stack>
  );
} 