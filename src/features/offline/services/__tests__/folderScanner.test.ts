import { getFolderName } from '../folderScanner';

describe('Folder Name Extraction', () => {
  it('should extract folder name from regular file path', () => {
    const uri = '/storage/emulated/0/Download/My Manga Folder';
    const name = getFolderName(uri);
    expect(name).toBe('My Manga Folder');
  });

  it('should extract folder name from SAF content URI', () => {
    const uri = 'content://com.android.externalstorage.documents/tree/primary%3ADownload%2FMy%20Manga';
    const name = getFolderName(uri);
    expect(name).toBe('My Manga');
  });

  it('should decode URL encoded names', () => {
    const uri = '/storage/emulated/0/Download/One%20Piece%20-%20Chapter%201';
    const name = getFolderName(uri);
    expect(name).toBe('One Piece - Chapter 1');
  });

  it('should handle SAF URIs with document ID', () => {
    const uri = 'content://com.android.externalstorage.documents/tree/primary:Download/Naruto';
    const name = getFolderName(uri);
    expect(name).toBe('Naruto');
  });

  it('should return Unknown for empty URI', () => {
    const uri = '';
    const name = getFolderName(uri);
    expect(name).toBe('Unknown');
  });
});

