import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { sourceManager } from '../services/sourceManager';
import { MangaUpdate } from '../types';
import { useReaderStore } from '../../../app/store/readerStore';
import { useSettingsStore } from '../../../app/store/settingsStore';
import { colors, spacing, typography } from '../../../shared/theme';
import { Card, EmptyState, LoadingSpinner, Button } from '../../../shared/components';
import { ContinueReadingSection } from '../../offline/components/ContinueReadingSection';
import { generateId } from '../../../shared/utils/imageUtils';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { openSession } = useReaderStore();
  const { defaultReaderMode } = useSettingsStore();
  const [updates, setUpdates] = useState<MangaUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUpdates();
  }, []);

  const loadUpdates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sourceManager.getLatestUpdates(20);
      setUpdates(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading updates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMangaPress = async (update: MangaUpdate) => {
    try {
      const pages = await sourceManager.getChapterPages(
        update.manga.sourceType,
        update.latestChapter.id
      );
      
      const sessionId = generateId();
      const title = `${update.manga.title} - Ch. ${update.latestChapter.chapterNumber}`;
      
      openSession({
        sessionId,
        title,
        sourceType: 'mangadex',
        content: {
          type: 'mangadex',
          manga: update.manga,
          chapter: update.latestChapter,
          pages,
        },
        readerMode: defaultReaderMode,
        currentPage: 0,
        totalPages: pages.length,
        createdAt: new Date(),
      });
      
      (navigation as any).navigate('ReaderTabs');
      console.log(`🌐 Opened "${title}" in new tab`);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const renderUpdate = ({ item }: { item: MangaUpdate }) => (
    <Card onPress={() => handleMangaPress(item)} style={styles.updateCard}>
      {item.manga.coverUrl && (
        <Image
          source={{ uri: item.manga.coverUrl }}
          style={styles.cover}
          resizeMode="cover"
        />
      )}
      <View style={styles.updateInfo}>
        <Text style={styles.mangaTitle} numberOfLines={2}>
          {item.manga.title}
        </Text>
        <Text style={styles.chapterInfo}>
          Chapter {item.latestChapter.chapterNumber}
          {item.latestChapter.title && `: ${item.latestChapter.title}`}
        </Text>
        <Text style={styles.updateTime}>
          {formatRelativeTime(item.updatedAt)}
        </Text>
      </View>
    </Card>
  );

  if (loading) {
    return <LoadingSpinner message="Loading updates..." />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Failed to load updates"
          description={error}
          actionLabel="Retry"
          onAction={loadUpdates}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MangaDex Updates</Text>
        <Button
          title="Offline Library"
          onPress={() => (navigation as any).navigate('OfflineLibrary')}
          variant="secondary"
          size="small"
        />
      </View>

      {updates.length === 0 ? (
        <>
          <ContinueReadingSection />
          <EmptyState
            title="No updates available"
            description="Check back later for new chapters"
            actionLabel="Refresh"
            onAction={loadUpdates}
          />
        </>
      ) : (
        <FlatList
          data={updates}
          renderItem={renderUpdate}
          keyExtractor={(item) => item.latestChapter.id}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadUpdates}
          ListHeaderComponent={<ContinueReadingSection />}
        />
      )}
    </View>
  );
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  list: {
    padding: spacing.md,
  },
  updateCard: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  cover: {
    width: 80,
    height: 120,
    borderRadius: 4,
    backgroundColor: colors.gray800,
  },
  updateInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  mangaTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  chapterInfo: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  updateTime: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

