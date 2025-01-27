import { Stack } from 'expo-router';
import { colors } from '../../constants/theme';

const commonHeaderOptions = {
  headerShown: true,
  headerTintColor: colors.primary,
  headerBackTitle: 'Retour',
  headerStyle: {
    backgroundColor: colors.header.background,
    borderBottomColor: colors.header.border,
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
        name="gta6" 
        options={{
          ...commonHeaderOptions,
          title: 'GTA VI'
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
      <Stack.Screen 
        name="gta4" 
        options={{
          ...commonHeaderOptions,
          title: 'GTA IV'
        }}
      />
    </Stack>
  );
} 