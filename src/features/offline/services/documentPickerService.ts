import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export interface PickedDocument {
  uri: string;
  name: string;
  type?: string;
  size?: number;
}

export async function pickFolder(): Promise<PickedDocument | null> {
  try {
    if (Platform.OS === 'android' && FileSystem.StorageAccessFramework) {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      
      if (!permissions.granted) {
        return null;
      }
      
      return {
        uri: permissions.directoryUri,
        name: 'Selected Folder',
        type: 'directory',
      };
    }
    
    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
      copyToCacheDirectory: false,
      multiple: false,
    });
    
    if (result.canceled) {
      return null;
    }
    
    const asset = result.assets[0];
    const pathParts = asset.uri.split('/');
    pathParts.pop();
    const folderUri = pathParts.join('/');
    
    return {
      uri: folderUri,
      name: pathParts[pathParts.length - 1] || 'Selected Folder',
      type: 'directory',
    };
  } catch (error) {
    console.error('Error picking folder:', error);
    throw new Error('Failed to pick folder. Please check permissions.');
  }
}

export async function pickPdfFile(): Promise<PickedDocument | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
      multiple: false,
    });
    
    if (result.canceled) {
      return null;
    }
    
    const asset = result.assets[0];
    return {
      uri: asset.uri,
      name: asset.name,
      type: asset.mimeType,
      size: asset.size,
    };
  } catch (error) {
    console.error('Error picking PDF:', error);
    throw new Error('Failed to pick PDF file.');
  }
}

export async function pickImageFiles(): Promise<PickedDocument[]> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
      copyToCacheDirectory: false,
      multiple: true,
    });
    
    if (result.canceled) {
      return [];
    }
    
    return result.assets.map(asset => ({
      uri: asset.uri,
      name: asset.name,
      type: asset.mimeType,
      size: asset.size,
    }));
  } catch (error) {
    console.error('Error picking images:', error);
    throw new Error('Failed to pick image files.');
  }
}

export function isFolderPickingSupported(): boolean {
  return Platform.OS === 'android';
}

export function getFolderAccessInstructions(): string {
  if (Platform.OS === 'ios') {
    return 'On iOS, please select individual image files. Folder access is limited by iOS restrictions.';
  }
  return 'Please select a folder containing your manga images.';
}

