import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';

let Pdf: any = null;
let pdfError: any = null;

try {
  Pdf = require('react-native-pdf').default;
} catch (error) {
  pdfError = error;
}

import { colors } from '../../../shared/theme';

interface PdfReaderProps {
  uri: string;
  mode?: 'pageFlip' | 'longStrip';
  onPageChange?: (page: number, total: number) => void;
  onError?: (error: unknown) => void;
}

const PdfReaderComponent: React.FC<PdfReaderProps> = ({
  uri,
  mode = 'pageFlip',
  onPageChange,
  onError,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleLoadComplete = useCallback((numberOfPages: number) => {
    setTotalPages(numberOfPages);
    onPageChange?.(1, numberOfPages);
  }, [onPageChange]);

  const handlePageChanged = useCallback((page: number, numberOfPages: number) => {
    setCurrentPage(page);
    onPageChange?.(page, numberOfPages);
  }, [onPageChange]);

  const handleError = useCallback((error: unknown) => {
    console.error('PDF loading error:', error);
    onError?.(error);
  }, [onError]);

  if (!Pdf || pdfError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>❌ PDF Module Not Available</Text>
        <Text style={styles.errorText}>
          Failed to load react-native-pdf native module.{'\n\n'}
          Error: {pdfError?.message || 'Unknown error'}{'\n\n'}
          This requires a development build with native modules.{'\n\n'}
          Run: npx expo prebuild --clean
        </Text>
      </View>
    );
  }

  const isPageFlip = mode === 'pageFlip';

  // Memoize PDF configuration to prevent unnecessary re-renders
  const pdfConfig = useMemo(() => ({
    source: { uri, cache: true },
    style: styles.pdf,
    enablePaging: isPageFlip,
    horizontal: isPageFlip,
    spacing: isPageFlip ? 0 : 10,
    singlePage: isPageFlip,
    enableAntialiasing: true,
    enableAnnotationRendering: false,
    fitPolicy: 0,
    minScale: 1.0,
    maxScale: 3.0,
    scale: 1.0,
    // Performance optimizations
    activityIndicatorProps: { color: colors.white, size: 'large' },
    // Only set page prop for pageFlip mode
    ...(isPageFlip && { page: currentPage }),
  }), [uri, isPageFlip, currentPage]);

  const renderActivityIndicator = useCallback(() => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.white} />
      <Text style={styles.loadingText}>Loading PDF...</Text>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      <Pdf
        {...pdfConfig}
        onLoadComplete={handleLoadComplete}
        onPageChanged={handlePageChanged}
        onError={handleError}
        renderActivityIndicator={renderActivityIndicator}
      />
      
      {/* Page indicator */}
      {totalPages > 0 && isPageFlip && (
        <View style={styles.pageIndicator}>
          <Text style={styles.pageText}>
            {currentPage} / {totalPages}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  pdf: {
    flex: 1,
    backgroundColor: colors.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.white,
    marginTop: 16,
    fontSize: 16,
  },
  pageIndicator: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pageText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 22,
  },
});

// Memoize component to prevent re-renders when props haven't changed
export const PdfReader = React.memo(PdfReaderComponent, (prevProps, nextProps) => {
  // Only re-render if uri or mode changed
  return prevProps.uri === nextProps.uri && prevProps.mode === nextProps.mode;
});

