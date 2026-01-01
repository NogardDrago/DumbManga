import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Pdf from 'react-native-pdf';
import { colors } from '../../../shared/theme';

interface PdfReaderProps {
  uri: string;
  onPageChange?: (page: number, total: number) => void;
  onError?: (error: unknown) => void;
}

export const PdfReader: React.FC<PdfReaderProps> = ({
  uri,
  onPageChange,
  onError,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleLoadComplete = (numberOfPages: number) => {
    setTotalPages(numberOfPages);
    onPageChange?.(1, numberOfPages);
  };

  const handlePageChanged = (page: number, numberOfPages: number) => {
    setCurrentPage(page);
    onPageChange?.(page, numberOfPages);
  };

  const handleError = (error: unknown) => {
    console.error('PDF loading error:', error);
    onError?.(error);
  };

  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri }}
        style={styles.pdf}
        onLoadComplete={handleLoadComplete}
        onPageChanged={handlePageChanged}
        onError={handleError}
        enablePaging
        horizontal
        spacing={0}
        renderActivityIndicator={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.white} />
            <Text style={styles.loadingText}>Loading PDF...</Text>
          </View>
        )}
      />
      
      {/* Page indicator */}
      {totalPages > 0 && (
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
});

