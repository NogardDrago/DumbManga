export interface Page {
  index: number;
  uri: string;
  type: 'image' | 'pdf';
  name: string;
}

export interface OfflineBook {
  id: string;
  title: string;
  folderUri: string;
  pages: Page[];
  coverUri?: string;
  lastOpened?: Date;
}

export interface Chapter {
  id: string;
  title: string;
  folderUri: string;
  pages: Page[];
  index: number;
}

export interface OfflineLibraryItem {
  id: string;
  title: string;
  type: 'book' | 'pdf';
  uri: string;
  chapters?: Chapter[];
  lastOpened?: Date;
  coverUri?: string;
}

export interface PdfFile {
  id: string;
  title: string;
  uri: string;
  lastOpened?: Date;
}

export interface FolderScanResult {
  books: OfflineBook[];
  chapters?: Chapter[];
  type: 'single-book' | 'multi-chapter';
}

