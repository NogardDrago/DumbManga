import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReaderStore } from '../../../app/store';
import { PageFlipReader } from '../components/PageFlipReader';
import { LongStripReader } from '../components/LongStripReader';
import { PdfReader } from '../components/PdfReader';
import { ReaderControls } from '../components/ReaderControls';
import { ReaderMode } from '../types';
import { LoadingSpinner } from '../../../shared/components';
import { COLORS, TYPOGRAPHY, SPACING } from '../../../shared/theme';

interface ReaderScreenProps {
  sessionId: string;
}

export const ReaderScreen: React.FC<ReaderScreenProps> = ({ sessionId }) => {
  const { getSession, updateSession, updateCurrentPage } = useReaderStore();
  const session = getSession(sessionId);
  const [showControls, setShowControls] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const insets = useSafeAreaInsets();

  const handlePageChange = useCallback(
    (page: number) => {
      updateCurrentPage(sessionId, page);
    },
    [sessionId, updateCurrentPage]
  );

  const handleModeChange = useCallback(
    (mode: ReaderMode) => {
      updateSession(sessionId, { readerMode: mode });
    },
    [sessionId, updateSession]
  );

  const toggleControls = useCallback(() => {
    setShowControls((prev) => {
      const newValue = !prev;
      if (newValue) {
        if (hideTimeout) clearTimeout(hideTimeout);
        const timeout = setTimeout(() => setShowControls(false), 4000);
        setHideTimeout(timeout);
      } else {
        if (hideTimeout) clearTimeout(hideTimeout);
      }
      return newValue;
    });
  }, [hideTimeout]);

  useEffect(() => {
    return () => {
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [hideTimeout]);

  // Memoize the pages array to prevent catastrophic re-renders on page change
  const memoizedPages = useMemo(() => {
    if (!session) return [];
    
    if (session.content.type === 'offline-folder') {
      return session.content.book.pages.map((page) => ({
        index: page.index,
        uri: page.uri,
      }));
    }
    
    if (session.content.type === 'mangadex') {
      return session.content.pages.map((page) => ({
        index: page.index,
        uri: page.url,
      }));
    }
    
    return [];
  }, [session?.content]);

  if (!session) {
    return <LoadingSpinner message="Loading reader..." />;
  }

  const renderReader = () => {
    const { content, readerMode } = session;

    if (content.type === 'offline-pdf') {
      return (
        <PdfReader
          key={sessionId}
          uri={content.pdf.uri}
          mode={readerMode}
          onPageChange={(page: number, total: number) => {
            updateSession(sessionId, { currentPage: page, totalPages: total });
          }}
        />
      );
    }

    if (content.type === 'offline-folder' || content.type === 'mangadex') {
      if (readerMode === 'pageFlip') {
        return (
          <PageFlipReader
            key={sessionId}
            pages={memoizedPages}
            initialPage={session.currentPage}
            onPageChange={handlePageChange}
            readingDirection={session.readingDirection}
          />
        );
      } else {
        return (
          <LongStripReader
            key={sessionId}
            pages={memoizedPages}
            initialPage={session.currentPage}
            onPageChange={handlePageChange}
          />
        );
      }
    }

    return <LoadingSpinner message="Unsupported content type" />;
  };

  const progress = session.totalPages > 0 ? session.currentPage / session.totalPages : 0;
  
  return (
    <View style={styles.container}>
      {renderReader()}

      {/* Invisible center tap zone for toggling controls */}
      {!showControls && (
        <Pressable 
          style={styles.touchableOverlay} 
          onPress={toggleControls}
        />
      )}

      {/* Progress Bar */}
      <View style={[styles.progressBar, { top: insets.top }]} pointerEvents="none">
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Page Indicator */}
      <TouchableOpacity
        style={[styles.pageIndicator, { bottom: Math.max(insets.bottom, SPACING.lg) }]}
        activeOpacity={0.7}
        onPress={toggleControls}
      >
        <Text style={styles.pageText}>
          {session.currentPage + 1} / {session.totalPages}
        </Text>
      </TouchableOpacity>

      {/* Modern Controls */}
      {showControls && (
        <ReaderControls
          currentMode={session.readerMode}
          onModeChange={handleModeChange}
          currentPage={session.currentPage}
          totalPages={session.totalPages}
          onClose={() => setShowControls(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  touchableOverlay: {
    position: 'absolute',
    top: '20%',
    bottom: '20%',
    left: '20%',
    right: '20%',
    zIndex: 10,
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.text,
  },
  pageIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  pageText: {
    ...TYPOGRAPHY.caption,
    color: '#E0E0E0',
    backgroundColor: 'rgba(20, 20, 20, 0.85)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    overflow: 'hidden',
  },
});
