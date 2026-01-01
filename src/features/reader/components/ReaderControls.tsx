import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../../shared/theme';
import { ReaderMode } from '../types';

interface ReaderControlsProps {
  currentMode: ReaderMode;
  onModeChange: (mode: ReaderMode) => void;
  onClose: () => void;
}

export const ReaderControls: React.FC<ReaderControlsProps> = ({
  currentMode,
  onModeChange,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get('window');
  
  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, spacing.md) }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕ Close</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            currentMode === 'pageFlip' && styles.modeButtonActive,
          ]}
          onPress={() => onModeChange('pageFlip')}
        >
          <Text style={[
            styles.modeText,
            currentMode === 'pageFlip' && styles.modeTextActive,
          ]}>📖 Page Flip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            currentMode === 'longStrip' && styles.modeButtonActive,
          ]}
          onPress={() => onModeChange('longStrip')}
        >
          <Text style={[
            styles.modeText,
            currentMode === 'longStrip' && styles.modeTextActive,
          ]}>📜 Long Strip</Text>
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  closeButton: {
    padding: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  closeText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modeButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  modeButtonActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  modeText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modeTextActive: {
    color: colors.black,
  },
});

