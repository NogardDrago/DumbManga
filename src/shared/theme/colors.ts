export const colors = {
  black: '#000000',
  white: '#FFFFFF',
  
  gray100: '#F5F5F5',
  gray200: '#E5E5E5',
  gray300: '#D4D4D4',
  gray400: '#A3A3A3',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',
  
  background: '#000000',
  surface: '#171717',
  text: '#FFFFFF',
  textSecondary: '#A3A3A3',
  border: '#404040',
  divider: '#262626',
  
  hover: '#262626',
  pressed: '#404040',
  disabled: '#525252',
} as const;

export type ColorName = keyof typeof colors;

