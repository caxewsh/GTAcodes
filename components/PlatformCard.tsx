import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

interface PlatformCardProps {
  platformName: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
}

const PlatformCard: React.FC<PlatformCardProps> = ({ platformName, iconName }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
        pathname: '/home/platform/[platform]',
        params: { platform: platformName.toLowerCase() },
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Ionicons name={iconName} size={50} color="#FFFFFF" />
      <Text style={styles.text}>{platformName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 20,
    borderRadius: 15,
    width: '40%',
    borderColor: '#E5F993',
    borderWidth: 2,
    backgroundColor: '#1e1e1e',
  },
  text: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PlatformCard;