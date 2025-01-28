export const colors = {
  primary: '#adc178',
  error: '#FF3B30', // Ajout d'une couleur d'erreur (rouge iOS)
  premium: {
    favorite: '#FF6B6B',    // Coral red
    notification: '#FFD700', // Gold
    badge: '#4CAF50',       // Green
    theme: '#9C27B0',       // Purple
    collection: '#2196F3',  // Blue
  },
  background: {
    primary: '#1C1C1E',
    secondary: '#2C2C2E',
    tertiary: '#3C3C3E',
  },
  border: {
    primary: '#3C3C3E',
    secondary: '#48484A',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#8E8E93',
    tertiary: '#6C6C70',
    dark: '#000000',
  },
  tab: {
    inactive: '#8E8E93',
    active: '#A6E22E',
    background: '#2C2C2E',
  },
  header: {
    background: '#2C2C2E',
    border: '#3C3C3E',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  } as const,
};

export default {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
}; 