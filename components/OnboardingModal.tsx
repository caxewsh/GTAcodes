import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal } from './Modal';
import { colors, spacing } from '../constants/theme';
import { useRouter } from 'expo-router';

interface OnboardingModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isVisible, onClose }: OnboardingModalProps) {
  const router = useRouter();

  const handleJoinCommunity = () => {
    onClose();
    router.push('/profil');
  };

  return (
    <Modal visible={isVisible} onClose={onClose}>
      <View style={styles.content} accessibilityLabel="modale-onboarding">
        <Text style={styles.title} accessibilityLabel="titre-onboarding">
          Rejoignez la communauté !
        </Text>
        
        <View style={styles.benefitsList} accessibilityLabel="liste-avantages">
          <Text style={styles.benefitText} accessibilityLabel="avantage-favoris">
            ✓ Sauvegardez tes codes favoris
          </Text>
          <Text style={styles.benefitText} accessibilityLabel="avantage-notifications">
            ✓ Notifications pour les news
          </Text>
          <Text style={styles.benefitText} accessibilityLabel="avantage-badges">
            ✓ Obtenir des badges
          </Text>
          <Text style={styles.benefitText} accessibilityLabel="avantage-premium">
            ✓ <Text style={styles.premium}>Deviens membre</Text> pour accéder à tout le contenu gratuitement
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleJoinCommunity}
          accessibilityLabel="bouton-creer-compte"
          accessibilityRole="button"
          accessibilityHint="Appuyez pour créer un compte"
        >
          <Text style={styles.buttonText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  benefitsList: {
    alignSelf: 'stretch',
    marginBottom: spacing.xl,
  },
  benefitText: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  premium: {
    fontWeight: 'bold',
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