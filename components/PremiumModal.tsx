import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Modal } from './Modal';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface PremiumModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function PremiumModal({ isVisible, onClose }: PremiumModalProps) {
  const router = useRouter();

  const handleJoinGang = () => {
    onClose();
    router.push('/profil');
  };

  return (
    <Modal visible={isVisible} onClose={onClose}>
      <ImageBackground
        source={require('../assets/games/GTA6.jpg')}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Deviens OG !</Text>
          
          <View style={styles.benefitsList}>
            <View style={styles.benefitRow}>
              <Ionicons name="infinite" size={24} color={colors.primary} />
              <Text style={styles.benefitText}>Likes illimités</Text>
            </View>
            <View style={styles.benefitRow}>
              <MaterialCommunityIcons name="fire" size={24} color={colors.primary} />
              <Text style={styles.benefitText}>Codes exclusifs</Text>
            </View>
            <View style={styles.benefitRow}>
              <MaterialCommunityIcons name="lock-open" size={24} color={colors.primary} />
              <Text style={styles.benefitText}>Pas de publicités</Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="rocket" size={24} color={colors.primary} />
              <Text style={styles.benefitText}>Nouvelles features à venir</Text>
            </View>
            <Text style={styles.price}>Seulement 0,99 € / an</Text>
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleJoinGang}
          >
            <Text style={styles.buttonText}>REJOINDRE LE GANG</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    overflow: 'hidden',
    margin: -20,
    borderRadius: borderRadius.lg,
  },
  backgroundImage: {
    opacity: 0.2,
    borderRadius: borderRadius.lg,
  },
  content: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  benefitsList: {
    alignSelf: 'stretch',
    marginBottom: spacing.xl,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  benefitText: {
    fontSize: 18,
    color: colors.text.primary,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 