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
      {/* Top Header Bar */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, SPACING.md) }]}>
        <TouchableOpacity onPress={onClose} style={styles.iconButton}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.titleText} numberOfLines={1}>Reader</Text>
          <Text style={styles.statsText}>{currentPage + 1} of {totalPages}</Text>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Controls Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, SPACING.md) }]}>
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={[styles.bottomButton, currentMode === 'pageFlip' && styles.bottomButtonActive]}
            onPress={() => onModeChange('pageFlip')}
          >
            <Text style={[styles.bottomButtonText, currentMode === 'pageFlip' && styles.bottomButtonTextActive]}>
              Paging
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bottomButton, currentMode === 'longStrip' && styles.bottomButtonActive]}
            onPress={() => onModeChange('longStrip')}
          >
            <Text style={[styles.bottomButtonText, currentMode === 'longStrip' && styles.bottomButtonTextActive]}>
              Webtoon
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionIcon}>
            <Text style={styles.iconText}>☀️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIcon}>
            <Text style={styles.iconText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: 'rgba(15, 15, 15, 0.9)',
    pointerEvents: 'auto',
  },
  bottomBar: {
    backgroundColor: 'rgba(15, 15, 15, 0.9)',
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    pointerEvents: 'auto',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: SPACING.md,
  },
  titleText: {
    ...TYPOGRAPHY.title,
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },
  statsText: {
    ...TYPOGRAPHY.caption,
    color: '#A0A0A0',
    marginTop: 2,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 22,
    color: COLORS.text,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
    marginBottom: SPACING.md,
  },
  bottomButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  bottomButtonActive: {
    backgroundColor: COLORS.text,
  },
  bottomButtonText: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
    color: '#A0A0A0',
  },
  bottomButtonTextActive: {
    color: COLORS.background, // inverted for active
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
  },
});
