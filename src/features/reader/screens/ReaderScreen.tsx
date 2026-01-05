import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
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
        const timeout = setTimeout(() => setShowControls(false), 3000);
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

    if (content.type === 'offline-folder') {
      const pages = content.book.pages.map((page) => ({
        index: page.index,
        uri: page.uri,
      }));

      if (readerMode === 'pageFlip') {
        return (
          <PageFlipReader
            key={sessionId}
            pages={pages}
            initialPage={session.currentPage}
            onPageChange={handlePageChange}
            readingDirection={session.readingDirection}
          />
        );
      } else {
        return (
          <LongStripReader
            key={sessionId}
            pages={pages}
            initialPage={session.currentPage}
            onPageChange={handlePageChange}
          />
        );
      }
    }

    if (content.type === 'mangadex') {
      const pages = content.pages.map((page) => ({
        index: page.index,
        uri: page.url,
      }));

      if (readerMode === 'pageFlip') {
        return (
          <PageFlipReader
            key={sessionId}
            pages={pages}
            initialPage={session.currentPage}
            onPageChange={handlePageChange}
            readingDirection={session.readingDirection}
          />
        );
      } else {
        return (
          <LongStripReader
            key={sessionId}
            pages={pages}
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

      <View style={styles.progressBar} pointerEvents="none">
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <TouchableOpacity
        style={styles.pageIndicator}
        activeOpacity={0.7}
        onPress={toggleControls}
      >
        <Text style={styles.pageText}>
          {session.currentPage + 1} / {session.totalPages}
        </Text>
      </TouchableOpacity>

      {!showControls && (
        <TouchableOpacity
          style={styles.centerTapZone}
          activeOpacity={0.3}
          onPress={toggleControls}
        >
          <View style={styles.tapHint}>
            <Text style={styles.tapHintText}>⚙️</Text>
          </View>
        </TouchableOpacity>
      )}

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
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.text,
  },
  pageIndicator: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  pageText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  centerTapZone: {
    position: 'absolute',
    top: '15%',
    right: SPACING.md,
    zIndex: 10,
  },
  tapHint: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tapHintText: {
    fontSize: 24,
  },
});
