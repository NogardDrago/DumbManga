import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';

interface ChapterListItemProps {
  chapterNumber: string;
  title: string;
  timeAgo?: string;
  season?: string;
  isRead?: boolean;
  onPress: () => void;
}

export const ChapterListItem: React.FC<ChapterListItemProps> = ({
  chapterNumber,
  title,
  timeAgo,
  season,
  isRead,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.bullet}>
        <View style={styles.bulletDot} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.chapter}>{chapterNumber}</Text>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {season && <Text style={styles.season}>{season}</Text>}
      </View>
      {isRead && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  bullet: {
    width: 24,
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textTertiary,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  chapter: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '600',
  },
  timeAgo: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  title: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  season: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  checkmarkText: {
    fontSize: 14,
    color: COLORS.success,
  },
});

