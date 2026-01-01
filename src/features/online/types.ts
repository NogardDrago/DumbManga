export interface OnlineManga {
  id: string;
  title: string;
  coverUrl?: string;
  description?: string;
  author?: string;
  status?: string;
  sourceType: string;
  sourceId: string;
}

export interface OnlineChapter {
  id: string;
  mangaId: string;
  chapterNumber: string;
  title?: string;
  volume?: string;
  pages: number;
  publishDate?: Date;
  scanlationGroup?: string;
  sourceType: string;
}

export interface ChapterPage {
  index: number;
  url: string;
  width?: number;
  height?: number;
}

export interface MangaUpdate {
  manga: OnlineManga;
  latestChapter: OnlineChapter;
  updatedAt: Date;
}

