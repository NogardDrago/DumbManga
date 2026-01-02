import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { sourceManager } from '../services/sourceManager';
import { MangaUpdate } from '../types';
import { useReaderStore } from '../../../app/store/readerStore';
import { useSettingsStore } from '../../../app/store/settingsStore';
import { EmptyState, LoadingSpinner, MangaCard } from '../../../shared/components';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../../../shared/theme';
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

  const handleMangaPress = (update: MangaUpdate) => {
    (navigation as any).navigate('ChapterSelection', { manga: update.manga });
  };

  const renderUpdate = ({ item, index }: { item: MangaUpdate; index: number }) => (
    <View style={[styles.gridItem, index % 2 === 0 ? styles.gridItemLeft : styles.gridItemRight]}>
      <MangaCard
        title={item.manga.title}
        coverUrl={item.manga.coverUrl}
        chapter={`Ch. ${item.latestChapter.chapterNumber}`}
        isNew={true}
        onPress={() => handleMangaPress(item)}
      />
    </View>
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appIcon}>📚</Text>
          <Text style={styles.appName}>Dumb READER</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => (navigation as any).navigate('OfflineLibrary')}
          >
            <Text style={styles.icon}>📁</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={updates}
        renderItem={renderUpdate}
        keyExtractor={(item) => item.latestChapter.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadUpdates}
        ListHeaderComponent={
          <>
            <ContinueReadingSection />
            
            <TouchableOpacity 
              style={styles.offlineButton}
              onPress={() => (navigation as any).navigate('OfflineLibrary')}
            >
              <View style={styles.offlineIconContainer}>
                <Text style={styles.offlineIcon}>📁</Text>
              </View>
              <View style={styles.offlineTextContainer}>
                <Text style={styles.offlineTitle}>Offline Library</Text>
                <Text style={styles.offlineSubtitle}>Read from device storage</Text>
              </View>
              <Text style={styles.offlineArrow}>›</Text>
            </TouchableOpacity>

            {updates.length > 0 && (
              <Text style={styles.sectionTitle}>Latest Updates</Text>
            )}
          </>
        }
        ListEmptyComponent={
          <EmptyState
            title="No updates available"
            description="Check back later for new chapters"
            actionLabel="Refresh"
            onAction={loadUpdates}
          />
        }
      />
    </SafeAreaView>
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
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  appIcon: {
    fontSize: 20,
  },
  appName: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  list: {
    padding: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  gridItem: {
    flex: 1,
  },
  gridItemLeft: {
    paddingRight: SPACING.sm,
  },
  gridItemRight: {
    paddingLeft: SPACING.sm,
  },
  offlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  offlineIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  offlineIcon: {
    fontSize: 24,
  },
  offlineTextContainer: {
    flex: 1,
  },
  offlineTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  offlineSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  offlineArrow: {
    fontSize: 24,
    color: COLORS.textSecondary,
  },
});

