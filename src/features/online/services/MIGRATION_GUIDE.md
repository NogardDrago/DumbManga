# Migration Guide: Multi-Source Architecture

## What Changed

The manga source system has been refactored from a single `mangadexClient.ts` file to a modular, multi-source architecture.

### Old Structure
```
services/
└── mangadexClient.ts    # Single file with everything
```

### New Structure
```
services/
├── sourceManager.ts           # Unified API for all sources
├── sourceRegistry.ts          # Source configuration and registration
├── sources/
│   ├── base/
│   │   └── MangaSourceAdapter.ts    # Interface
│   ├── mangadex/
│   │   ├── mangadexClient.ts        # MangaDex implementation
│   │   ├── mangadexParser.ts        # Response parsing
│   │   └── constants.ts             # Constants
│   └── README.md                    # How to add new sources
└── index.ts                         # Main exports
```

## Code Changes Required

### Before (Old Code)
```typescript
import { mangadexClient } from '../services/mangadexClient';

// Get updates
const updates = await mangadexClient.getLatestUpdates(20);

// Get chapter pages
const pages = await mangadexClient.getChapterPages(chapterId);
```

### After (New Code)
```typescript
import { sourceManager } from '../services/sourceManager';

// Get updates from all enabled sources
const updates = await sourceManager.getLatestUpdates(20);

// Get updates from specific sources
const updates = await sourceManager.getLatestUpdates(20, ['mangadex']);

// Get chapter pages (now requires sourceType)
const pages = await sourceManager.getChapterPages(
  manga.sourceType,  // 'mangadex', 'mangasee', etc.
  chapterId
);
```

## Benefits

1. **Easy to Add Sources**: Create a new folder, implement the interface, register it
2. **Fallback Support**: If one source fails, others still work
3. **Aggregation**: Combine results from multiple sources
4. **Independent Testing**: Each source can be tested separately
5. **Enable/Disable**: Control sources via configuration
6. **Priority System**: Define which sources to try first

## Adding a New Source

See `sources/README.md` for detailed instructions.

Quick example:

1. Create `sources/mangasee/` folder
2. Implement `MangaSeeClient` with `MangaSourceAdapter` interface
3. Register in `sourceRegistry.ts`:
   ```typescript
   {
     id: 'mangasee',
     name: 'MangaSee',
     enabled: true,
     priority: 2,
     client: new MangaSeeClient(),
   }
   ```

That's it! The source is now available throughout the app.

## API Reference

### sourceManager

**getLatestUpdates(limit?, sourceIds?)**
- Get latest manga updates
- Aggregates from multiple sources
- Sorted by update date

**searchManga(query, sourceIds?)**
- Search across all or specific sources
- Returns combined results

**getMangaDetails(sourceType, mangaId)**
- Get details for a specific manga
- Requires source type

**getChapterList(sourceType, mangaId)**
- Get chapter list for a manga
- Requires source type

**getChapterPages(sourceType, chapterId)**
- Get page URLs for a chapter
- Requires source type

**getAvailableSources()**
- Returns list of enabled sources
- Useful for UI source selection

### sourceRegistry

**getEnabledSources()**
- Returns all enabled source configs

**getSourceById(sourceId)**
- Get specific source config

**getAllSources()**
- Returns all sources (enabled and disabled)

## Migration Checklist

- [x] Refactor MangaDex to new structure
- [x] Create sourceManager for unified API
- [x] Create sourceRegistry for configuration
- [x] Update HomeScreen to use sourceManager
- [x] Update types to support multiple sources
- [x] Create documentation (README, MIGRATION_GUIDE)
- [ ] Add more manga sources (MangaSee, MangaNato, etc.)
- [ ] Add source selection UI in settings
- [ ] Add per-source configuration (API keys, etc.)

