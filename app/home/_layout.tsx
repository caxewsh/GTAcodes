import { Stack } from 'expo-router';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { colors } from '../../constants/theme';

const commonHeaderOptions: Partial<NativeStackNavigationOptions> = {
  headerShown: true,
  headerTintColor: colors.primary,
  headerBackTitle: 'Retour',
  headerStyle: {
    backgroundColor: colors.background.primary,
    borderBottomColor: colors.border.primary,
    borderBottomWidth: 1,
  } as any,
};

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
        options={commonHeaderOptions}
      />
      <Stack.Screen 
        name="codes/[codes]" 
        options={commonHeaderOptions}
      />
    </Stack>
  );
} 