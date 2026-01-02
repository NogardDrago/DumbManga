import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING } from '../../../shared/theme';
import { ReaderMode } from '../types';

interface ReaderControlsProps {
  currentMode: ReaderMode;
  onModeChange: (mode: ReaderMode) => void;
  currentPage: number;
  totalPages: number;
  onClose: () => void;
}

export const ReaderControls: React.FC<ReaderControlsProps> = ({
  currentMode,
  onModeChange,
  currentPage,
  totalPages,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, SPACING.md) }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.rightBar, { paddingTop: Math.max(insets.top, SPACING.xl) }]}>
        <TouchableOpacity
          style={[
            styles.iconButton,
            currentMode === 'pageFlip' && styles.iconButtonActive,
          ]}
          onPress={() => onModeChange('pageFlip')}
        >
          <Text style={styles.iconText}>📖</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.iconButton,
            currentMode === 'longStrip' && styles.iconButtonActive,
          ]}
          onPress={() => onModeChange('longStrip')}
        >
          <Text style={styles.iconText}>📜</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>☀️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>⚙️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    pointerEvents: 'box-none',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 22,
    pointerEvents: 'auto',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  rightBar: {
    position: 'absolute',
    top: 0,
    right: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
    pointerEvents: 'box-none',
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 22,
    pointerEvents: 'auto',
  },
  iconButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  iconText: {
    fontSize: 20,
  },
});

