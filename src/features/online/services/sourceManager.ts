import { MangaUpdate, OnlineManga, OnlineChapter, ChapterPage } from '../types';
import { getEnabledSources, getSourceById } from './sourceRegistry';

class SourceManager {
  async getLatestUpdates(limit = 20, sourceIds?: string[]): Promise<MangaUpdate[]> {
    const sources = sourceIds 
      ? sourceIds.map(id => getSourceById(id)).filter(Boolean)
      : getEnabledSources();
    
    const allUpdates: MangaUpdate[] = [];
    
    for (const source of sources) {
      if (!source) continue;
      try {
        const updates = await source.client.getLatestUpdates(Math.ceil(limit / sources.length));
        allUpdates.push(...updates);
      } catch (error) {
        console.warn(`Failed to fetch from ${source.name}:`, error);
      }
    }
    
    return allUpdates
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);
  }

  async searchManga(query: string, sourceIds?: string[]): Promise<OnlineManga[]> {
    const sources = sourceIds 
      ? sourceIds.map(id => getSourceById(id)).filter(Boolean)
      : getEnabledSources();
    
    const allResults: OnlineManga[] = [];
    
    await Promise.allSettled(
      sources.map(async (source) => {
        if (!source) return;
        try {
          const results = await source.client.searchManga(query);
          allResults.push(...results);
        } catch (error) {
          console.warn(`Search failed for ${source.name}:`, error);
        }
      })
    );
    
    return allResults;
  }

  async getMangaDetails(sourceType: string, mangaId: string): Promise<OnlineManga> {
    const source = getSourceById(sourceType);
    if (!source) {
      throw new Error(`Source ${sourceType} not found`);
    }
    return source.client.getMangaDetails(mangaId);
  }

  async getChapterList(sourceType: string, mangaId: string): Promise<OnlineChapter[]> {
    const source = getSourceById(sourceType);
    if (!source) {
      throw new Error(`Source ${sourceType} not found`);
    }
    return source.client.getChapterList(mangaId);
  }

  async getChapterPages(sourceType: string, chapterId: string): Promise<ChapterPage[]> {
    const source = getSourceById(sourceType);
    if (!source) {
      throw new Error(`Source ${sourceType} not found`);
    }
    return source.client.getChapterPages(chapterId);
  }

  getAvailableSources() {
    return getEnabledSources().map(s => ({
      id: s.id,
      name: s.name,
      priority: s.priority,
    }));
  }

  async checkSourceAvailability(sourceId: string): Promise<boolean> {
    const source = getSourceById(sourceId);
    if (!source?.client.isAvailable) {
      return true;
    }
    return source.client.isAvailable();
  }
}

export const sourceManager = new SourceManager();

