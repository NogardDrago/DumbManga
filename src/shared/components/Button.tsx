import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { colors, typography } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
}) => {
  const containerStyle = [
    styles.base,
    styles[variant],
    styles[`${size}Container` as keyof typeof styles] as ViewStyle,
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text` as keyof typeof styles] as TextStyle,
    styles[`${size}Text` as keyof typeof styles] as TextStyle,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.black : colors.white} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  primary: {
    backgroundColor: colors.white,
  },
  secondary: {
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray600,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.body,
    fontWeight: '600',
  },
  primaryText: {
    color: colors.black,
  } as TextStyle,
  secondaryText: {
    color: colors.white,
  } as TextStyle,
  ghostText: {
    color: colors.white,
  } as TextStyle,
  smallContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  } as ViewStyle,
  mediumContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  } as ViewStyle,
  largeContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  } as ViewStyle,
  smallText: {
    fontSize: 14,
  } as TextStyle,
  mediumText: {
    fontSize: 16,
  } as TextStyle,
  largeText: {
    fontSize: 18,
  } as TextStyle,
});

