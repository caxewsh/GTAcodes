export const colors = {
  primary: '#E5F993',
  background: {
    primary: '#1A1A1E',
    secondary: '#242428',
    tertiary: '#2A2A30',
  },
  border: {
    primary: '#363640',
    secondary: '#444450',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B4B4C0',
    tertiary: '#8A8A95',
    dark: '#000000',
  },
  status: {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
  },
  card: {
    gradient: ['#2A2A30', '#242428'],
    shadow: 'rgba(0, 0, 0, 0.2)',
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
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
}; 