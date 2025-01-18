import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Modal } from './Modal';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { useRouter } from 'expo-router';

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
          <Text style={styles.title}>Rejoins le gang !</Text>
          
          <View style={styles.benefitsList}>
            <Text style={styles.benefitText}>✓ Likes illimités</Text>
            <Text style={styles.benefitText}>✓ Codes exclusifs</Text>
            <Text style={styles.benefitText}>✓ Pas de publicités</Text>
            <Text style={styles.benefitText}>✓ Support la communauté</Text>
            <Text style={styles.price}>Seulement 0,99 € / mois</Text>
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
    opacity: 0.3,
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
  benefitText: {
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: spacing.sm,
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