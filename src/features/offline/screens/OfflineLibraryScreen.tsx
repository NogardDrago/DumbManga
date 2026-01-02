import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useOfflineStore } from '../../../app/store/offlineStore';
import { useReaderStore } from '../../../app/store/readerStore';
import { useSettingsStore } from '../../../app/store/settingsStore';
import {
  pickFolder,
  pickPdfFile,
  pickImageFiles,
} from '../services/documentPickerService';
import { scanFolder } from '../services/folderScanner';
import { COLORS, SPACING, TYPOGRAPHY, LAYOUT } from '../../../shared/theme';
import { EmptyState, LoadingSpinner } from '../../../shared/components';
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

  const handlePickImages = async () => {
    try {
      setLoading(true);
      const picked = await pickImageFiles();
      
      if (picked.length > 0) {
        handlePickedImages(picked);
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
    <TouchableOpacity
      style={styles.libraryItem}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.iconContainer}>
        {item.coverUri ? (
          <Image source={{ uri: item.coverUri }} style={styles.itemIcon} />
        ) : (
          <View style={styles.placeholderIcon}>
            <Text style={styles.placeholderIconText}>
              {item.type === 'pdf' ? '📄' : '📁'}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.itemCount}>
          {item.type === 'pdf' ? 'PDF Document' : '10 items'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appIcon}>📚</Text>
          <Text style={styles.appName}>Dumb READER</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.icon}>🏠</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ContinueReadingSection />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Add Content</Text>
      </View>

      <View style={styles.buttonGrid}>
        <TouchableOpacity style={styles.pickButton} onPress={handlePickFolder}>
          <View style={styles.buttonIconContainer}>
            <Text style={styles.buttonIcon}>📁</Text>
          </View>
          <Text style={styles.buttonText}>Folder</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.pickButton} onPress={handlePickPdf}>
          <View style={styles.buttonIconContainer}>
            <Text style={styles.buttonIcon}>📄</Text>
          </View>
          <Text style={styles.buttonText}>PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.pickButton} onPress={handlePickImages}>
          <View style={styles.buttonIconContainer}>
            <Text style={styles.buttonIcon}>🖼️</Text>
          </View>
          <Text style={styles.buttonText}>Images</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Library</Text>
      </View>

      {libraryItems.length === 0 ? (
        <EmptyState
          title="No items in library"
          description="Add folders or PDFs to start reading offline"
          actionLabel="Pick Folder"
          onAction={handlePickFolder}
        />
      ) : (
        <FlatList
          data={getRecentItems()}
          renderItem={renderLibraryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handlePickFolder}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  appIcon: {
    fontSize: 20,
  },
  appName: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  sectionHeader: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    color: COLORS.text,
  },
  buttonGrid: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  pickButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xs,
    borderRadius: LAYOUT.cardRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  buttonIcon: {
    fontSize: 24,
  },
  buttonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  libraryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: LAYOUT.cardRadius,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    marginRight: SPACING.md,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  placeholderIcon: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIconText: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  itemCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.text,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 28,
    color: COLORS.background,
    fontWeight: '300',
  },
});

