import { MangaUpdate, OnlineManga, OnlineChapter, ChapterPage } from '../../../types';

export interface MangaSourceAdapter {
  sourceType: string;
  sourceName: string;
  baseUrl: string;
  
  getLatestUpdates(limit?: number): Promise<MangaUpdate[]>;
  getMangaDetails(mangaId: string): Promise<OnlineManga>;
  getChapterList(mangaId: string): Promise<OnlineChapter[]>;
  getChapterPages(chapterId: string): Promise<ChapterPage[]>;
  searchManga(query: string): Promise<OnlineManga[]>;
  
  authenticate?(credentials: any): Promise<void>;
  isAvailable?(): Promise<boolean>;
}

