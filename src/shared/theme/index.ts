export * from './colors';
export * from './spacing';
export * from './typography';

export const COLORS = {
  background: '#000000',
  surface: '#121212',
  elevated: '#1E1E1E',
  card: '#1A1A1A',
  
  text: '#FFFFFF',
  textSecondary: '#999999',
  textTertiary: '#666666',
  
  border: '#2A2A2A',
  divider: '#1A1A1A',
  overlay: 'rgba(0, 0, 0, 0.8)',
  
  active: '#FFFFFF',
  inactive: '#666666',
  pressed: '#333333',
  
  badge: '#FF4444',
  success: '#4CAF50',
};

export const COLORS_LIGHT = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  elevated: '#FFFFFF',
  card: '#FFFFFF',
  
  text: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  
  border: '#E0E0E0',
  divider: '#F0F0F0',
  overlay: 'rgba(255, 255, 255, 0.9)',
  
  active: '#000000',
  inactive: '#999999',
  pressed: '#CCCCCC',
  
  badge: '#FF4444',
  success: '#4CAF50',
};

export const TYPOGRAPHY = {
  titleLarge: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  tiny: {
    fontSize: 10,
    fontWeight: '400' as const,
    lineHeight: 14,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const LAYOUT = {
  screenPadding: SPACING.md,
  cardRadius: 8,
  buttonRadius: 8,
  gridGap: SPACING.md,
  listItemHeight: 72,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};
