import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../../shared/theme';
import { ChapterListItem, LoadingSpinner } from '../../../shared/components';
import { sourceManager } from '../services/sourceManager';
import { OnlineManga, OnlineChapter } from '../types';
import { useReaderStore } from '../../../app/store/readerStore';
import { useSettingsStore } from '../../../app/store/settingsStore';
import { generateId } from '../../../shared/utils/imageUtils';

type ChapterSelectionScreenRouteProp = RouteProp<
  { ChapterSelection: { manga: OnlineManga } },
  'ChapterSelection'
>;

export const ChapterSelectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ChapterSelectionScreenRouteProp>();
  const { manga } = route.params;
  const { openSession } = useReaderStore();
  const { defaultReaderMode } = useSettingsStore();

  const [chapters, setChapters] = useState<OnlineChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    loadChapters();
  }, [manga.id]);

  const loadChapters = async () => {
    try {
      setLoading(true);
      const chapterList = await sourceManager.getChapterList(manga.sourceType, manga.id);
      setChapters(chapterList);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterPress = async (chapter: OnlineChapter) => {
    try {
      const pages = await sourceManager.getChapterPages(manga.sourceType, chapter.id);

      const sessionId = generateId();
      const title = `${manga.title} - Ch. ${chapter.chapterNumber}`;

      openSession({
        sessionId,
        title,
        sourceType: manga.sourceType,
        content: {
          type: manga.sourceType,
          manga,
          chapter,
          pages,
        },
        readerMode: defaultReaderMode,
        currentPage: 0,
        totalPages: pages.length,
        createdAt: new Date(),
      });

      (navigation as any).navigate('ReaderTabs');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const formatTimeAgo = (date?: Date | string): string => {
    if (!date) return 'Unknown';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Unknown';
    
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 1) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    return dateObj.toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {manga.title}
        </Text>
        <View style={styles.menuButton} />
      </View>

      <ScrollView>
        <View style={styles.mangaInfo}>
          <View style={styles.coverContainer}>
            {manga.coverUrl ? (
              <Image source={{ uri: manga.coverUrl }} style={styles.cover} />
            ) : (
              <View style={[styles.cover, styles.coverPlaceholder]}>
                <Text style={styles.coverPlaceholderText}>📚</Text>
              </View>
            )}
          </View>
          <View style={styles.infoText}>
            <Text style={styles.mangaTitle} numberOfLines={2}>
              {manga.title}
            </Text>
            <Text style={styles.infoLabel}>
              Author: <Text style={styles.infoValue}>Unknown</Text>
            </Text>
            <Text style={styles.infoLabel}>
              Artist: <Text style={styles.infoValue}>Unknown</Text>
            </Text>
            <Text style={styles.infoLabel}>
              Status: <Text style={styles.infoValue}>Ongoing</Text>
            </Text>
          </View>
        </View>

        <View style={styles.sourceToggle}>
          <View style={styles.toggleLeft}>
            <Text style={styles.toggleLabel}>Online Source:</Text>
            <Text style={styles.toggleValue}>
              {manga.sourceType.charAt(0).toUpperCase() + manga.sourceType.slice(1)}
            </Text>
          </View>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: COLORS.inactive, true: COLORS.active }}
            thumbColor={COLORS.text}
          />
          <Text style={styles.offlineLabel}>Offline Chapters</Text>
        </View>

        {loading ? (
          <LoadingSpinner message="Loading chapters..." />
        ) : (
          <View style={styles.chapterList}>
            {chapters.map((chapter, index) => (
              <ChapterListItem
                key={chapter.id}
                chapterNumber={`Ch. ${chapter.chapterNumber}`}
                title={chapter.title || manga.title}
                timeAgo={formatTimeAgo(chapter.publishedAt)}
                season={`Season ${Math.ceil(parseFloat(chapter.chapterNumber) / 50)}`}
                isRead={false}
                onPress={() => handleChapterPress(chapter)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  headerTitle: {
    flex: 1,
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    marginHorizontal: SPACING.sm,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  mangaInfo: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  coverContainer: {
    marginRight: SPACING.md,
  },
  cover: {
    width: 100,
    height: 140,
    borderRadius: 8,
  },
  coverPlaceholder: {
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPlaceholderText: {
    fontSize: 40,
  },
  infoText: {
    flex: 1,
    justifyContent: 'center',
  },
  mangaTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  infoLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  infoValue: {
    color: COLORS.text,
  },
  sourceToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  toggleLeft: {
    flex: 1,
  },
  toggleLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  toggleValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '600',
  },
  offlineLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  chapterList: {
    paddingBottom: SPACING.xl,
  },
});

