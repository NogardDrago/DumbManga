import axios, { AxiosInstance } from 'axios';
import { MangaSourceAdapter } from '../base/MangaSourceAdapter';
import { MANGADEX_API_BASE, MANGADEX_TIMEOUT, MANGADEX_DEFAULT_LANGUAGE } from './constants';
import { parseMangaData, parseChapterData } from './mangadexParser';
import {
  OnlineManga,
  OnlineChapter,
  ChapterPage,
  MangaUpdate,
} from '../../../types';

export class MangaDexClient implements MangaSourceAdapter {
  sourceType = 'mangadex';
  sourceName = 'MangaDex';
  baseUrl = MANGADEX_API_BASE;
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: MANGADEX_API_BASE,
      timeout: MANGADEX_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getLatestUpdates(limit = 20): Promise<MangaUpdate[]> {
    try {
      const response = await this.client.get('/chapter', {
        params: {
          limit,
          'order[publishAt]': 'desc',
          'translatedLanguage[]': MANGADEX_DEFAULT_LANGUAGE,
          includes: ['manga', 'scanlation_group'],
        },
      });

      const chapters = response.data.data;
      const updates: MangaUpdate[] = [];

      for (const chapterData of chapters) {
        const mangaRelation = chapterData.relationships.find(
          (rel: any) => rel.type === 'manga'
        );

        if (mangaRelation) {
          const manga = parseMangaData(mangaRelation);
          const chapter = parseChapterData(chapterData);

          updates.push({
            manga,
            latestChapter: chapter,
            updatedAt: new Date(chapterData.attributes.publishAt),
          });
        }
      }

      return updates;
    } catch (error) {
      console.error('Error fetching MangaDex updates:', error);
      throw new Error('Failed to fetch manga updates from MangaDex');
    }
  }

  async getMangaDetails(mangaId: string): Promise<OnlineManga> {
    try {
      const response = await this.client.get(`/manga/${mangaId}`, {
        params: {
          includes: ['cover_art', 'author'],
        },
      });

      return parseMangaData(response.data.data);
    } catch (error) {
      console.error('Error fetching manga details:', error);
      throw new Error('Failed to fetch manga details');
    }
  }

  async getChapterList(mangaId: string): Promise<OnlineChapter[]> {
    try {
      const response = await this.client.get('/chapter', {
        params: {
          manga: mangaId,
          'translatedLanguage[]': MANGADEX_DEFAULT_LANGUAGE,
          'order[chapter]': 'asc',
          limit: 100,
        },
      });

      return response.data.data.map((chapterData: any) => 
        parseChapterData(chapterData)
      );
    } catch (error) {
      console.error('Error fetching chapter list:', error);
      throw new Error('Failed to fetch chapter list');
    }
  }

  async getChapterPages(chapterId: string): Promise<ChapterPage[]> {
    try {
      const response = await this.client.get(`/at-home/server/${chapterId}`);
      const { baseUrl, chapter } = response.data;

      const pages: ChapterPage[] = chapter.data.map((filename: string, index: number) => ({
        index,
        url: `${baseUrl}/data/${chapter.hash}/${filename}`,
      }));

      return pages;
    } catch (error) {
      console.error('Error fetching chapter pages:', error);
      throw new Error('Failed to fetch chapter pages');
    }
  }

  async searchManga(query: string): Promise<OnlineManga[]> {
    try {
      const response = await this.client.get('/manga', {
        params: {
          title: query,
          limit: 20,
          includes: ['cover_art', 'author'],
        },
      });

      return response.data.data.map((mangaData: any) => 
        parseMangaData(mangaData)
      );
    } catch (error) {
      console.error('Error searching manga:', error);
      throw new Error('Failed to search manga');
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client.get('/ping');
      return true;
    } catch {
      return false;
    }
  }
}

