import * as FileSystem from 'expo-file-system';
import { OfflineBook, Chapter, Page, FolderScanResult } from '../types';
import { isImageFile, generateId } from '../../../shared/utils/imageUtils';
import { sortFilesByName } from '../../../shared/utils/naturalSort';

interface FileInfo {
  name: string;
  uri: string;
  isDirectory: boolean;
}

export async function scanFolder(folderUri: string): Promise<FolderScanResult> {
  try {
    const items = await readDirectory(folderUri);
    
    const directories = items.filter(item => item.isDirectory);
    const imageFiles = items.filter(item => !item.isDirectory && isImageFile(item.name));
    
    if (directories.length > 0 && imageFiles.length === 0) {
      return await scanMultiChapterStructure(folderUri, directories);
    } else {
      return await scanSingleBook(folderUri, imageFiles);
    }
  } catch (error) {
    console.error('Error scanning folder:', error);
    throw new Error('Failed to scan folder. Please check permissions.');
  }
}

async function scanSingleBook(folderUri: string, imageFiles: FileInfo[]): Promise<FolderScanResult> {
  const sortedFiles = sortFilesByName(imageFiles);
  
  const pages: Page[] = sortedFiles.map((file, index) => ({
    index,
    uri: file.uri,
    type: 'image',
    name: file.name,
  }));
  
  const bookTitle = getFolderName(folderUri);
  console.log(`📁 Extracted folder name: "${bookTitle}" from URI: ${folderUri}`);
  
  const book: OfflineBook = {
    id: generateId(),
    title: bookTitle,
    folderUri,
    pages,
    coverUri: pages[0]?.uri,
  };
  
  return {
    books: [book],
    type: 'single-book',
  };
}

async function scanMultiChapterStructure(
  folderUri: string,
  directories: FileInfo[]
): Promise<FolderScanResult> {
  const sortedDirs = sortFilesByName(directories);
  const chapters: Chapter[] = [];
  
  for (let i = 0; i < sortedDirs.length; i++) {
    const dir = sortedDirs[i];
    const chapterFiles = await readDirectory(dir.uri);
    const imageFiles = chapterFiles.filter(file => !file.isDirectory && isImageFile(file.name));
    
    if (imageFiles.length > 0) {
      const sortedImages = sortFilesByName(imageFiles);
      const pages: Page[] = sortedImages.map((file, index) => ({
        index,
        uri: file.uri,
        type: 'image',
        name: file.name,
      }));
      
      chapters.push({
        id: generateId(),
        title: dir.name,
        folderUri: dir.uri,
        pages,
        index: i,
      });
    }
  }
  
  const bookTitle = getFolderName(folderUri);
  console.log(`📚 Extracted book name: "${bookTitle}" from URI: ${folderUri} (${chapters.length} chapters)`);
  
  const book: OfflineBook = {
    id: generateId(),
    title: bookTitle,
    folderUri,
    pages: chapters.length > 0 ? chapters[0].pages : [],
    coverUri: chapters[0]?.pages[0]?.uri,
  };
  
  return {
    books: [book],
    chapters,
    type: 'multi-chapter',
  };
}

async function readDirectory(uri: string): Promise<FileInfo[]> {
  try {
    if (uri.startsWith('content://')) {
      const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(uri);
      
      const fileInfos: FileInfo[] = await Promise.all(
        files.map(async (fileUri) => {
          const info = await FileSystem.StorageAccessFramework.getInfoAsync(fileUri);
          let name = info.uri.split('/').pop() || 'unknown';
          
          if (name.includes(':')) {
            const segments = name.split(':');
            name = segments[segments.length - 1];
          }
          
          return {
            name: decodeURIComponent(name),
            uri: fileUri,
            isDirectory: info.isDirectory || false,
          };
        })
      );
      
      return fileInfos;
    }
    
    const files = await FileSystem.readDirectoryAsync(uri);
    
    const fileInfos: FileInfo[] = await Promise.all(
      files.map(async (name) => {
        const fileUri = `${uri}/${name}`;
        const info = await FileSystem.getInfoAsync(fileUri);
        
        return {
          name,
          uri: fileUri,
          isDirectory: info.isDirectory ?? false,
        };
      })
    );
    
    return fileInfos;
  } catch (error) {
    console.error('Error reading directory:', uri, error);
    return [];
  }
}

function getFolderName(uri: string): string {
  try {
    if (uri.startsWith('content://')) {
      const decodedUri = decodeURIComponent(uri);
      const parts = decodedUri.split('/');
      const lastPart = parts[parts.length - 1];
      
      if (lastPart.includes(':')) {
        const segments = lastPart.split(':');
        return segments[segments.length - 1] || 'Unknown';
      }
      
      return lastPart || 'Unknown';
    }
    
    const parts = uri.split('/');
    const lastPart = parts[parts.length - 1];
    return decodeURIComponent(lastPart) || 'Unknown';
  } catch (error) {
    console.error('Error extracting folder name:', error);
    return 'Unknown Folder';
  }
}

export async function validateFolderAccess(uri: string): Promise<boolean> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    return info.exists && (info.isDirectory ?? false);
  } catch {
    return false;
  }
}

