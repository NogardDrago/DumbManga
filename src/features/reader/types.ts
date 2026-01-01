import { OfflineBook, PdfFile } from '../offline/types';
import { OnlineManga, OnlineChapter, ChapterPage } from '../online/types';

export type ReaderMode = 'pageFlip' | 'longStrip';
export type ReadingDirection = 'ltr' | 'rtl';
export type SourceType = 'offline-folder' | 'offline-pdf' | 'mangadex';

export interface OfflineReaderContent {
  type: 'offline-folder';
  book: OfflineBook;
}

export interface PdfReaderContent {
  type: 'offline-pdf';
  pdf: PdfFile;
}

export interface OnlineReaderContent {
  type: 'mangadex';
  manga: OnlineManga;
  chapter: OnlineChapter;
  pages: ChapterPage[];
}

export type ReaderContent = OfflineReaderContent | PdfReaderContent | OnlineReaderContent;

export interface ReaderSession {
  sessionId: string;
  title: string;
  sourceType: SourceType;
  content: ReaderContent;
  readerMode: ReaderMode;
  currentPage: number;
  totalPages: number;
  readingDirection?: ReadingDirection;
  createdAt: Date;
}

export interface ReaderState {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error?: string;
}

export interface ReaderSettings {
  defaultMode: ReaderMode;
  defaultDirection: ReadingDirection;
  doublePage: boolean;
  backgroundColor: string;
}

