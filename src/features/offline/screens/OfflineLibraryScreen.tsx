import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useOfflineStore } from '../../../app/store/offlineStore';
import { useReaderStore } from '../../../app/store/readerStore';
import { useSettingsStore } from '../../../app/store/settingsStore';
import {
  pickFolder,
  pickPdfFile,
  pickImageFiles,
  isFolderPickingSupported,
  getFolderAccessInstructions,
} from '../services/documentPickerService';
import { scanFolder } from '../services/folderScanner';
import { colors, spacing, typography } from '../../../shared/theme';
import { Button, EmptyState, Card, LoadingSpinner } from '../../../shared/components';
import { ContinueReadingSection } from '../components/ContinueReadingSection';
import { OfflineLibraryItem } from '../types';
import { generateId } from '../../../shared/utils/imageUtils';

export const OfflineLibraryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { libraryItems, addLibraryItem, getRecentItems } = useOfflineStore();
  const { openSession } = useReaderStore();
  const { defaultReaderMode } = useSettingsStore();
  const [loading, setLoading] = useState(false);

  const handlePickFolder = async () => {
    try {
      setLoading(true);
      
      Alert.alert(
        'Select Manga Folder',
        'You will be prompted to select a folder containing your manga images. Grant permission to access the folder.',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
          {
            text: 'Continue',
            onPress: async () => {
              try {
                const picked = await pickFolder();
                if (picked) {
                  console.log('Picked folder:', picked.uri);
                  const result = await scanFolder(picked.uri);
                  
                  if (result.books.length > 0) {
                    const book = result.books[0];
                    const item: OfflineLibraryItem = {
                      id: book.id,
                      title: book.title,
                      type: 'book',
                      uri: book.folderUri,
                      coverUri: book.coverUri,
                    };
                    
                    addLibraryItem(item);
                    openBookInReader(book);
                  } else {
                    Alert.alert('No Images Found', 'The selected folder does not contain any images.');
                  }
                }
              } catch (error: any) {
                Alert.alert('Error', error.message);
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
      setLoading(false);
    }
  };

  const handlePickPdf = async () => {
    try {
      setLoading(true);
      const picked = await pickPdfFile();
      
      if (picked) {
        const item: OfflineLibraryItem = {
          id: generateId(),
          title: picked.name,
          type: 'pdf',
          uri: picked.uri,
        };
        
        addLibraryItem(item);
        openPdfInReader(item);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePickedImages = (images: any[]) => {
    // Create a virtual book from picked images
    const pages = images.map((img, index) => ({
      index,
      uri: img.uri,
      type: 'image' as const,
      name: img.name,
    }));

    const book = {
      id: generateId(),
      title: 'Selected Images',
      folderUri: '',
      pages,
      coverUri: pages[0]?.uri,
    };

    openBookInReader(book);
  };

  const openBookInReader = (book: any) => {
    const sessionId = generateId();
    
    openSession({
      sessionId,
      title: book.title,
      sourceType: 'offline-folder',
      content: {
        type: 'offline-folder',
        book,
      },
      readerMode: defaultReaderMode,
      currentPage: 0,
      totalPages: book.pages.length,
      createdAt: new Date(),
    });
    
    (navigation as any).navigate('ReaderTabs');
    console.log(`📚 Opened "${book.title}" in new tab`);
  };

  const openPdfInReader = (item: OfflineLibraryItem) => {
    const sessionId = generateId();
    
    openSession({
      sessionId,
      title: item.title,
      sourceType: 'offline-pdf',
      content: {
        type: 'offline-pdf',
        pdf: {
          id: item.id,
          title: item.title,
          uri: item.uri,
        },
      },
      readerMode: 'pageFlip',
      currentPage: 1,
      totalPages: 0,
      createdAt: new Date(),
    });
    
    (navigation as any).navigate('ReaderTabs');
    console.log(`📄 Opened "${item.title}" in new tab`);
  };

  const handleItemPress = async (item: OfflineLibraryItem) => {
    try {
      setLoading(true);
      
      if (item.type === 'pdf') {
        openPdfInReader(item);
      } else {
        const result = await scanFolder(item.uri);
        if (result.books.length > 0) {
          openBookInReader(result.books[0]);
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderLibraryItem = ({ item }: { item: OfflineLibraryItem }) => (
    <Card onPress={() => handleItemPress(item)} style={styles.libraryItem}>
      {item.coverUri && (
        <Image source={{ uri: item.coverUri }} style={styles.cover} />
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.itemType}>
          {item.type === 'pdf' ? 'PDF' : 'Folder'}
        </Text>
      </View>
    </Card>
  );

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Offline Library</Text>
        <View style={styles.actions}>
          <Button
            title="Pick Folder"
            onPress={handlePickFolder}
            size="small"
            style={styles.actionButton}
          />
          <Button
            title="Pick PDF"
            onPress={handlePickPdf}
            size="small"
            variant="secondary"
          />
        </View>
      </View>

      {libraryItems.length === 0 ? (
        <>
          <ContinueReadingSection />
          <EmptyState
            title="No items in library"
            description="Add folders or PDFs to start reading offline"
            actionLabel="Pick Folder"
            onAction={handlePickFolder}
          />
        </>
      ) : (
        <FlatList
          data={getRecentItems()}
          renderItem={renderLibraryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={<ContinueReadingSection />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    marginRight: spacing.sm,
  },
  list: {
    padding: spacing.md,
  },
  libraryItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  cover: {
    width: 60,
    height: 90,
    borderRadius: 4,
    backgroundColor: colors.gray800,
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  itemTitle: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  itemType: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

