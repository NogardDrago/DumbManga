import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../theme';

interface MangaCardProps {
  title: string;
  coverUrl?: string;
  chapter?: string;
  isNew?: boolean;
  newCount?: number;
  onPress: () => void;
}

export const MangaCard: React.FC<MangaCardProps> = ({
  title,
  coverUrl,
  chapter,
  isNew,
  newCount,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.coverContainer}>
        {coverUrl ? (
          <Image source={{ uri: coverUrl }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.placeholder]}>
            <Text style={styles.placeholderText}>📚</Text>
          </View>
        )}
        {isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>New</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.meta}>
          {chapter && <Text style={styles.chapter}>{chapter}</Text>}
          {newCount !== undefined && newCount > 0 && (
            <Text style={styles.newCount}>{newCount} New</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: SPACING.md,
  },
  coverContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 0.7,
    borderRadius: LAYOUT.cardRadius,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  newBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.badge,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
  },
  newBadgeText: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.text,
    fontWeight: '600',
  },
  info: {
    marginTop: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  chapter: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  newCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
});

