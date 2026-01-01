# Example: Adding MangaSee Source

This is a complete example of how to add a new manga source to the application.

## Step 1: Create Folder Structure

```
sources/mangasee/
├── mangaseeClient.ts
├── mangaseeParser.ts
└── constants.ts
```

## Step 2: constants.ts

```typescript
export const MANGASEE_BASE_URL = 'https://mangasee123.com';
export const MANGASEE_API_URL = 'https://mangasee123.com/api';
export const MANGASEE_TIMEOUT = 10000;
```

## Step 3: mangaseeParser.ts

```typescript
import { OnlineManga, OnlineChapter } from '../../../types';

export function parseMangaData(data: any): OnlineManga {
  return {
    id: data.i,
    title: data.s,
    coverUrl: `https://cover.mangasee123.com/cover/${data.i}.jpg`,
    description: data.d,
    author: data.a?.[0],
    status: data.ss,
    sourceType: 'mangasee',
    sourceId: data.i,
  };
}

export function parseChapterData(mangaId: string, data: any): OnlineChapter {
  return {
    id: `${mangaId}-chapter-${data.Chapter}`,
    mangaId: mangaId,
    chapterNumber: data.Chapter,
    title: data.ChapterName || `Chapter ${data.Chapter}`,
    pages: parseInt(data.Page) || 0,
    publishDate: new Date(data.Date),
    sourceType: 'mangasee',
  };
}
```

## Step 4: mangaseeClient.ts

```typescript
import axios, { AxiosInstance } from 'axios';
import { MangaSourceAdapter } from '../base/MangaSourceAdapter';
import { MANGASEE_API_URL, MANGASEE_TIMEOUT } from './constants';
import { parseMangaData, parseChapterData } from './mangaseeParser';
import {
  OnlineManga,
  OnlineChapter,
  ChapterPage,
  MangaUpdate,
} from '../../../types';

export class MangaSeeClient implements MangaSourceAdapter {
  sourceType = 'mangasee';
  sourceName = 'MangaSee';
  baseUrl = MANGASEE_API_URL;
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: MANGASEE_API_URL,
      timeout: MANGASEE_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getLatestUpdates(limit = 20): Promise<MangaUpdate[]> {
    try {
      const response = await this.client.get('/latest-updates');
      const updates: MangaUpdate[] = [];

      for (const item of response.data.slice(0, limit)) {
        const manga = parseMangaData(item.manga);
        const chapter = parseChapterData(manga.id, item.chapter);

        updates.push({
          manga,
          latestChapter: chapter,
          updatedAt: new Date(item.chapter.Date),
        });
      }

      return updates;
    } catch (error) {
      console.error('Error fetching MangaSee updates:', error);
      throw new Error('Failed to fetch manga updates from MangaSee');
    }
  }

  async getMangaDetails(mangaId: string): Promise<OnlineManga> {
    try {
      const response = await this.client.get(`/manga/${mangaId}`);
      return parseMangaData(response.data);
    } catch (error) {
      console.error('Error fetching manga details:', error);
      throw new Error('Failed to fetch manga details');
    }
  }

  async getChapterList(mangaId: string): Promise<OnlineChapter[]> {
    try {
      const response = await this.client.get(`/manga/${mangaId}/chapters`);
      return response.data.map((chapterData: any) => 
        parseChapterData(mangaId, chapterData)
      );
    } catch (error) {
      console.error('Error fetching chapter list:', error);
      throw new Error('Failed to fetch chapter list');
    }
  }

  async getChapterPages(chapterId: string): Promise<ChapterPage[]> {
    try {
      const response = await this.client.get(`/chapter/${chapterId}/pages`);
      
      const pages: ChapterPage[] = response.data.images.map(
        (imageUrl: string, index: number) => ({
          index,
          url: imageUrl,
        })
      );

      return pages;
    } catch (error) {
      console.error('Error fetching chapter pages:', error);
      throw new Error('Failed to fetch chapter pages');
    }
  }

  async searchManga(query: string): Promise<OnlineManga[]> {
    try {
      const response = await this.client.get('/search', {
        params: { q: query },
      });

      return response.data.map((mangaData: any) => 
        parseMangaData(mangaData)
      );
    } catch (error) {
      console.error('Error searching manga:', error);
      throw new Error('Failed to search manga');
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}
```

## Step 5: Update sources/index.ts

```typescript
export * from './mangadex/mangadexClient';
export * from './mangasee/mangaseeClient';  // Add this line
export * from './base/MangaSourceAdapter';
```

## Step 6: Register in sourceRegistry.ts

```typescript
import { MangaSourceAdapter } from './sources/base/MangaSourceAdapter';
import { MangaDexClient } from './sources/mangadex/mangadexClient';
import { MangaSeeClient } from './sources/mangasee/mangaseeClient';  // Add import

export const sourceRegistry: SourceConfig[] = [
  {
    id: 'mangadex',
    name: 'MangaDex',
    enabled: true,
    priority: 1,
    client: new MangaDexClient(),
  },
  {
    id: 'mangasee',              // Add this entry
    name: 'MangaSee',
    enabled: true,
    priority: 2,
    client: new MangaSeeClient(),
  },
];
```

## Done!

Your new source is now:
- ✅ Automatically included in latest updates
- ✅ Available for search
- ✅ Integrated with the reader
- ✅ Managed by sourceManager

## Testing Your Source

```typescript
import { sourceManager } from '../services/sourceManager';

// Test getting updates from MangaSee only
const updates = await sourceManager.getLatestUpdates(10, ['mangasee']);

// Test searching
const results = await sourceManager.searchManga('Naruto', ['mangasee']);

// Test getting chapter pages
const pages = await sourceManager.getChapterPages('mangasee', 'some-chapter-id');

// Check if source is available
const available = await sourceManager.checkSourceAvailability('mangasee');
```

## Common Pitfalls

1. **Forgetting to export** - Always update `sources/index.ts`
2. **Wrong sourceType** - Must match the ID in sourceRegistry
3. **Not handling errors** - Always wrap API calls in try-catch
4. **Inconsistent data format** - Use the parsers to normalize data
5. **Missing fields** - Ensure all required OnlineManga/OnlineChapter fields are set

## Tips

- Start by implementing just `getLatestUpdates()` to test the integration
- Use console.log to debug API responses
- Test with real API calls before registering
- Check the source's API documentation for rate limits
- Consider adding retry logic for flaky APIs

