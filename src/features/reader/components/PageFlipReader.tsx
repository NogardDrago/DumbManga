import React, { useRef, useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  View,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { colors } from '../../../shared/theme';

interface Page {
  index: number;
  uri: string;
}

interface PageFlipReaderProps {
  pages: Page[];
  initialPage?: number;
  onPageChange?: (page: number) => void;
  readingDirection?: 'ltr' | 'rtl';
}

export const PageFlipReader: React.FC<PageFlipReaderProps> = ({
  pages,
  initialPage = 0,
  onPageChange,
  readingDirection = 'ltr',
}) => {
  const flatListRef = useRef<FlatList>(null);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: any) => {
      if (viewableItems.length > 0) {
        const page = viewableItems[0].index;
        onPageChange?.(page);
      }
    },
    [onPageChange]
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderPage = useCallback(
    ({ item }: { item: Page }) => (
      <View style={[styles.pageContainer, { width: screenWidth, height: screenHeight }]}>
        <Image
          source={{ uri: item.uri }}
          style={styles.pageImage}
          resizeMode="contain"
        />
      </View>
    ),
    [screenWidth, screenHeight]
  );

  const keyExtractor = useCallback((item: Page) => `page-${item.index}`, []);

  const displayPages = readingDirection === 'rtl' ? [...pages].reverse() : pages;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={displayPages}
        renderItem={renderPage}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialPage}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
  },
  pageImage: {
    width: '100%',
    height: '100%',
  },
});

