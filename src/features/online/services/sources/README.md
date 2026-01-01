# Manga Sources

This directory contains modular manga source implementations. Each source is isolated and can be added/removed independently.

## Structure

```
sources/
├── base/
│   └── MangaSourceAdapter.ts    # Interface all sources must implement
├── mangadex/
│   ├── mangadexClient.ts        # MangaDex implementation
│   ├── mangadexParser.ts        # Response parsing helpers
│   └── constants.ts             # MangaDex-specific constants
└── [new-source]/                # Add new sources here
    ├── [source]Client.ts
    ├── [source]Parser.ts
    └── constants.ts
```

## Adding a New Source

### Step 1: Create Source Directory

Create a new folder under `sources/` with your source name (e.g., `mangasee/`, `manganato/`)

### Step 2: Implement the Client

Create `[source]Client.ts` that implements `MangaSourceAdapter`:

```typescript
import { MangaSourceAdapter } from '../base/MangaSourceAdapter';
import { OnlineManga, OnlineChapter, ChapterPage, MangaUpdate } from '../../../types';

export class MangaSeeClient implements MangaSourceAdapter {
  sourceType = 'mangasee';
  sourceName = 'MangaSee';
  baseUrl = 'https://mangasee123.com';
  
  async getLatestUpdates(limit = 20): Promise<MangaUpdate[]> {
    // Implementation
  }
  
  async getMangaDetails(mangaId: string): Promise<OnlineManga> {
    // Implementation
  }
  
  async getChapterList(mangaId: string): Promise<OnlineChapter[]> {
    // Implementation
  }
  
  async getChapterPages(chapterId: string): Promise<ChapterPage[]> {
    // Implementation
  }
  
  async searchManga(query: string): Promise<OnlineManga[]> {
    // Implementation
  }
  
  async isAvailable(): Promise<boolean> {
    // Optional: health check
  }
}
```

### Step 3: Create Parser (Optional but Recommended)

Create `[source]Parser.ts` to separate parsing logic:

```typescript
import { OnlineManga, OnlineChapter } from '../../../types';

export function parseMangaData(data: any): OnlineManga {
  return {
    id: data.id,
    title: data.title,
    sourceType: 'mangasee',
    sourceId: data.id,
    // ... other fields
  };
}

export function parseChapterData(data: any): OnlineChapter {
  // ... parsing logic
}
```

### Step 4: Create Constants

Create `constants.ts` for source-specific values:

```typescript
export const MANGASEE_BASE_URL = 'https://mangasee123.com';
export const MANGASEE_API_URL = 'https://mangasee123.com/api';
export const MANGASEE_TIMEOUT = 10000;
```

### Step 5: Export the Client

Update `sources/index.ts`:

```typescript
export * from './mangadex/mangadexClient';
export * from './mangasee/mangaseeClient';  // Add this line
export * from './base/MangaSourceAdapter';
```

### Step 6: Register the Source

Update `../sourceRegistry.ts`:

```typescript
import { MangaSeeClient } from './sources/mangasee/mangaseeClient';

export const sourceRegistry: SourceConfig[] = [
  {
    id: 'mangadex',
    name: 'MangaDex',
    enabled: true,
    priority: 1,
    client: new MangaDexClient(),
  },
  {
    id: 'mangasee',
    name: 'MangaSee',
    enabled: true,
    priority: 2,
    client: new MangaSeeClient(),
  },
];
```

## Usage

The `sourceManager` automatically handles all registered sources:

```typescript
import { sourceManager } from '../services/sourceManager';

// Get updates from all enabled sources
const updates = await sourceManager.getLatestUpdates(20);

// Get updates from specific sources
const mangadexOnly = await sourceManager.getLatestUpdates(20, ['mangadex']);

// Search across all sources
const results = await sourceManager.searchManga('One Piece');

// Get chapter pages (requires sourceType)
const pages = await sourceManager.getChapterPages('mangadex', 'chapter-id');
```

## Best Practices

1. **Error Handling**: Always wrap API calls in try-catch blocks
2. **Timeouts**: Set reasonable timeouts for HTTP requests
3. **Rate Limiting**: Respect source API rate limits
4. **Parsing**: Separate parsing logic from API calls
5. **Constants**: Use constants for URLs, timeouts, etc.
6. **Health Checks**: Implement `isAvailable()` for better UX
7. **Logging**: Use descriptive console logs for debugging

## Testing

Test your source implementation:

```typescript
const client = new MangaSeeClient();

// Test availability
const available = await client.isAvailable();

// Test latest updates
const updates = await client.getLatestUpdates(5);

// Test search
const results = await client.searchManga('Naruto');
```

