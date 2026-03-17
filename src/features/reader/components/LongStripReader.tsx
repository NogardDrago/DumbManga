import React, { useCallback, useRef, memo, useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_ASPECT_RATIO = 0.7;

// A memoized image component that calculates its own aspect ratio 
// avoiding full list re-renders on scroll
const ReaderImage = memo(({ page, width }: { page: Page; width: number }) => {
  const [aspectRatio, setAspectRatio] = useState(DEFAULT_ASPECT_RATIO);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isActive = true;
    Image.getSize(
      page.uri,
      (w, h) => {
        if (isActive && w > 0 && h > 0) {
          setAspectRatio(w / h);
          setLoading(false);
        }
      },
      () => {
        if (isActive) {
          setError(true);
          setLoading(false);
        }
      }
    );
    return () => {
      isActive = false;
    };
  }, [page.uri]);

  const height = width / aspectRatio;

  return (
    <View style={[styles.pageContainer, { width, height }]}>
      {loading && !error && (
        <View style={[StyleSheet.absoluteFill, styles.center]}>
          <ActivityIndicator color={colors.white} />
        </View>
      )}
      {!error ? (
        <Image
          source={{ uri: page.uri }}
          style={{ width, height }}
          resizeMode="contain"
          onLoad={() => setLoading(false)}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.center]}>
          <Image 
            source={{ uri: page.uri }} // try again natively
            style={{ width, height }}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
}, (prev, next) => prev.page.uri === next.page.uri && prev.width === next.width);

export const LongStripReader: React.FC<LongStripReaderProps> = ({
  pages,
  initialPage = 0,
  onPageChange,
}) => {
  const flatListRef = useRef<FlatList>(null);

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: any) => {
      if (viewableItems && viewableItems.length > 0) {
        // Finding the item with the highest visibility could be better, 
        // but viewableItems[0] represents the topmost visible item.
        const page = viewableItems[0].index;
        if (onPageChange) {
          onPageChange(page);
        }
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 40,
    minimumViewTime: 100, // Debounce page change event
  }).current;

  const renderPage = useCallback(
    ({ item }: { item: Page }) => (
      <ReaderImage page={item} width={SCREEN_WIDTH} />
    ),
    []
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
        initialScrollIndex={initialPage}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
          });
        }}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={initialPage === 0 ? 2 : 1}
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
    backgroundColor: colors.black,
    overflow: 'hidden',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
