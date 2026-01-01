import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useReaderStore } from '../../../app/store';
import { PageFlipReader } from '../components/PageFlipReader';
import { LongStripReader } from '../components/LongStripReader';
import { ReaderControls } from '../components/ReaderControls';
import { ReaderMode } from '../types';
import { LoadingSpinner } from '../../../shared/components';
import { colors, typography, spacing } from '../../../shared/theme';

let PdfReader: any = null;
try {
  const pdfModule = require('../components/PdfReader');
  PdfReader = pdfModule.PdfReader;
  console.log('✅ PdfReader loaded');
} catch (error) {
  console.warn('⚠️ PdfReader not available in Expo Go:', error);
}

interface ReaderScreenProps {
  sessionId: string;
}

export const ReaderScreen: React.FC<ReaderScreenProps> = ({ sessionId }) => {
  const { getSession, updateSession, updateCurrentPage } = useReaderStore();
  const session = getSession(sessionId);
  const [showControls, setShowControls] = useState(false);

  const handlePageChange = useCallback(
    (page: number) => {
      updateCurrentPage(sessionId, page);
    },
    [sessionId, updateCurrentPage]
  );

  const handleModeChange = useCallback(
    (mode: ReaderMode) => {
      updateSession(sessionId, { readerMode: mode });
      setShowControls(false);
    },
    [sessionId, updateSession]
  );

  const toggleControls = useCallback(() => {
    setShowControls((prev) => !prev);
  }, []);

  if (!session) {
    return <LoadingSpinner message="Loading reader..." />;
  }

  const renderReader = () => {
    const { content, readerMode } = session;

    if (content.type === 'offline-pdf') {
      if (!PdfReader) {
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>PDF Reader Not Available</Text>
            <Text style={styles.errorText}>
              PDF reading requires a development build.{'\n'}
              It's not supported in Expo Go.
            </Text>
            <Text style={styles.errorHint}>
              Run: expo prebuild && expo run:android
            </Text>
          </View>
        );
      }
      
      return (
        <PdfReader
          uri={content.pdf.uri}
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
            pages={pages}
            initialPage={session.currentPage}
            onPageChange={handlePageChange}
            readingDirection={session.readingDirection}
          />
        );
      } else {
        return (
          <LongStripReader
            pages={pages}
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
            pages={pages}
            initialPage={session.currentPage}
            onPageChange={handlePageChange}
            readingDirection={session.readingDirection}
          />
        );
      } else {
        return (
          <LongStripReader
            pages={pages}
            onPageChange={handlePageChange}
          />
        );
      }
    }

    return <LoadingSpinner message="Unsupported content type" />;
  };

  const { width, height } = Dimensions.get('window');
  
  return (
    <View style={styles.container}>
      {renderReader()}
      
      {!showControls && (
        <>
          <TouchableOpacity
            style={[styles.tapZone, styles.tapZoneTop, { width }]}
            activeOpacity={0.3}
            onPress={toggleControls}
          >
            <View style={styles.tapHint}>
              <Text style={styles.tapHintText}>Tap for controls</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tapZone, styles.tapZoneBottom, { width }]}
            activeOpacity={0.3}
            onPress={toggleControls}
          />
        </>
      )}

      {showControls && session.content.type !== 'offline-pdf' && (
        <ReaderControls
          currentMode={session.readerMode}
          onModeChange={handleModeChange}
          onClose={() => setShowControls(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  tapZone: {
    position: 'absolute',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapZoneTop: {
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
  },
  tapZoneBottom: {
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
  },
  tapHint: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  tapHintText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorHint: {
    ...typography.bodySmall,
    color: colors.gray600,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});
