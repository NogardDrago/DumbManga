import React, { useCallback, useState, useRef } from 'react';
import {
  FlatList,
  Image,
  View,
  StyleSheet,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { colors } from '../../../shared/theme';

interface Page {
  index: number;
  uri: string;
}

interface LongStripReaderProps {
  pages: Page[];
  onPageChange?: (page: number) => void;
}

export const LongStripReader: React.FC<LongStripReaderProps> = ({
  pages,
  onPageChange,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const screenWidth = Dimensions.get('window').width;

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const viewportHeight = event.nativeEvent.layoutMeasurement.height;
      
      const approximatePage = Math.floor(offsetY / viewportHeight);
      onPageChange?.(Math.min(approximatePage, pages.length - 1));
    },
    [pages.length, onPageChange]
  );

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: any) => {
      const newLoadedImages = new Set(loadedImages);
      viewableItems.forEach((item: any) => {
        const index = item.index;
        newLoadedImages.add(index);
        if (index > 0) newLoadedImages.add(index - 1);
        if (index < pages.length - 1) newLoadedImages.add(index + 1);
      });
      setLoadedImages(newLoadedImages);
    },
    [loadedImages, pages.length]
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 10,
  }).current;

  const renderPage = useCallback(
    ({ item }: { item: Page }) => {
      const shouldLoad = loadedImages.has(item.index);

      return (
        <View style={styles.pageContainer}>
          {shouldLoad ? (
            <Image
              source={{ uri: item.uri }}
              style={[styles.pageImage, { width: screenWidth }]}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.placeholder, { width: screenWidth }]} />
          )}
        </View>
      );
    },
    [loadedImages, screenWidth]
  );

  const keyExtractor = useCallback((item: Page) => `page-${item.index}`, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={pages}
        renderItem={renderPage}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={3}
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
    alignItems: 'center',
    backgroundColor: colors.black,
  },
  pageImage: {
    height: undefined,
    aspectRatio: 0.7, // Approximate manga page ratio
  },
  placeholder: {
    height: 600,
    backgroundColor: colors.gray900,
  },
});

