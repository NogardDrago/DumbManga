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
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

// Calculate consistent item height based on screen width
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ASPECT_RATIO = 0.7; // manga page width/height ratio
const ITEM_HEIGHT = SCREEN_WIDTH / ASPECT_RATIO; // consistent height for all items

export const LongStripReader: React.FC<LongStripReaderProps> = ({
  pages,
  initialPage = 0,
  onPageChange,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(
    new Set([initialPage, initialPage > 0 ? initialPage - 1 : 0])
  );
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
        <View style={[styles.pageContainer, { height: ITEM_HEIGHT }]}>
          {shouldLoad ? (
            <Image
              source={{ uri: item.uri }}
              style={[styles.pageImage, { width: screenWidth, height: ITEM_HEIGHT }]}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.placeholder, { width: screenWidth, height: ITEM_HEIGHT }]} />
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
        initialScrollIndex={initialPage > 0 ? initialPage : undefined}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews={false}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
        decelerationRate="normal"
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
    // width and height set dynamically in renderPage
  },
  placeholder: {
    // width and height set dynamically in renderPage
    backgroundColor: colors.gray900,
  },
});

