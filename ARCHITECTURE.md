# Architecture Documentation

## Overview

This document describes the architectural decisions, patterns, and structure of the Manga Reader app.

## Design Principles

1. **Modularity**: Features are self-contained modules
2. **Scalability**: Easy to add new sources and features
3. **Type Safety**: Strict TypeScript for fewer bugs
4. **Performance**: Lazy loading, virtualization, minimal re-renders
5. **Separation of Concerns**: UI, business logic, and data clearly separated

## Layer Architecture

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│   (Screens, Components, Navigation) │
├─────────────────────────────────────┤
│       State Management Layer        │
│        (Zustand Stores)             │
├─────────────────────────────────────┤
│        Business Logic Layer         │
│     (Services, Utilities)           │
├─────────────────────────────────────┤
│          Data Layer                 │
│  (File System, Network, Types)      │
└─────────────────────────────────────┘
```

## Feature-Based Structure

### Why Feature-Based?

Traditional layer-based structure:
```
/src
  /components    # All components mixed together
  /screens       # All screens mixed together
  /services      # All services mixed together
```

❌ Problems:
- Hard to find related code
- Unclear dependencies
- Difficult to remove features
- Poor scalability

Feature-based structure:
```
/src
  /features
    /offline      # Everything offline-related
    /online       # Everything online-related
    /reader       # Everything reader-related
```

✅ Benefits:
- **Cohesion**: Related code is together
- **Independence**: Features can be developed separately
- **Scalability**: Easy to add new features
- **Maintenance**: Easy to find and modify code
- **Testing**: Test features in isolation

## State Management: Zustand

### Why Zustand over Redux/Context?

| Feature | Redux | Context | Zustand |
|---------|-------|---------|---------|
| Boilerplate | High | Low | Low |
| TypeScript | Good | Fair | Excellent |
| DevTools | Yes | No | Yes (optional) |
| Performance | Excellent | Poor (re-renders) | Excellent |
| Learning Curve | Steep | Easy | Easy |

### Store Design

Each store is focused and independent:

**readerStore.ts** - Multi-tab session management
```typescript
{
  sessions: ReaderSession[];
  activeSessionId: string | null;
  openSession(session): void;
  closeSession(id): void;
  switchSession(id): void;
}
```

**offlineStore.ts** - Offline library
```typescript
{
  libraryItems: OfflineLibraryItem[];
  addLibraryItem(item): void;
  removeLibraryItem(id): void;
  getRecentItems(limit): OfflineLibraryItem[];
}
```

**settingsStore.ts** - User preferences
```typescript
{
  defaultReaderMode: ReaderMode;
  defaultReadingDirection: ReadingDirection;
  setDefaultReaderMode(mode): void;
}
```

### Future: Persistence Layer

```typescript
// v1.1: Add persistence middleware
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useOfflineStore = create(
  persist(
    (set) => ({ /* store */ }),
    { name: 'offline-storage' }
  )
);
```

## Reader Architecture

### Multi-Tab System

The reader uses a session-based architecture:

```
ReaderTabsScreen
├── Tab Bar (horizontal scroll)
│   ├── Tab 1: "One Piece Ch.1"
│   ├── Tab 2: "My Folder"
│   └── Tab 3: "Some PDF"
└── Active Reader
    └── ReaderScreen (sessionId)
        ├── PageFlipReader (if mode === 'pageFlip')
        ├── LongStripReader (if mode === 'longStrip')
        └── PdfReader (if type === 'pdf')
```

**Key Design Decisions:**

1. **Session as Unit**: Each tab is a complete session with:
   - Content reference (offline/online/pdf)
   - Reading state (page, mode, direction)
   - Metadata (title, creation time)

2. **Content Union Type**: Type-safe content handling
```typescript
type ReaderContent = 
  | OfflineReaderContent
  | PdfReaderContent
  | OnlineReaderContent;
```

3. **Independent State**: Each session maintains its own state

### Reader Modes

**Page Flip Mode**
- Uses `FlatList` with `pagingEnabled`
- Horizontal scrolling
- One page at a time
- Optimized with `windowSize={5}`

**Long Strip Mode**
- Uses `FlatList` vertical
- Progressive loading
- Webtoon-style reading
- Lazy image loading

**Why FlatList over ScrollView?**
- Built-in virtualization
- Better performance with 100+ images
- `removeClippedSubviews` optimization
- Controlled rendering with `maxToRenderPerBatch`

## Offline Architecture

### Folder Scanner Strategy

```
User picks folder
    ↓
scanFolder(uri)
    ↓
Read directory contents
    ↓
Classify structure:
├── Images at root → Single book
└── Subdirectories → Multi-chapter
    ↓
Natural sort pages (1,2,3...10)
    ↓
Return FolderScanResult
```

**Natural Sorting Algorithm:**
```typescript
// Input:  ["1.jpg", "10.jpg", "2.jpg", "20.jpg"]
// Output: ["1.jpg", "2.jpg", "10.jpg", "20.jpg"]

function naturalSort(a, b) {
  // Split into numeric and string parts
  // Compare numerically when possible
  // Fall back to string comparison
}
```

### iOS Folder Limitation

**Problem:** iOS doesn't allow direct folder access via document picker

**Solution:** Multi-tiered fallback
1. Try folder picker (works on Android)
2. Detect platform and show instructions
3. Offer multi-image picker as fallback
4. Create virtual book from picked images

```typescript
if (!isFolderPickingSupported()) {
  // Show iOS-specific instructions
  // Offer alternative: pick multiple images
}
```

## Online Architecture

### Source Adapter Pattern

**Problem:** Different manga sites have different APIs

**Solution:** Abstract common operations into adapter interface

```typescript
interface MangaSourceAdapter {
  sourceType: string;
  getLatestUpdates(limit?): Promise<MangaUpdate[]>;
  getMangaDetails(mangaId): Promise<OnlineManga>;
  getChapterList(mangaId): Promise<OnlineChapter[]>;
  getChapterPages(chapterId): Promise<ChapterPage[]>;
  searchManga(query): Promise<OnlineManga[]>;
}
```

**Implementation:**
```typescript
class MangaDexClient implements MangaSourceAdapter {
  sourceType = 'mangadex';
  // Implement all methods
}

class MangaSeeClient implements MangaSourceAdapter {
  sourceType = 'mangasee';
  // Implement all methods
}
```

**Usage:**
```typescript
// Easy to switch sources
const source: MangaSourceAdapter = mangadexClient;
// or
const source: MangaSourceAdapter = mangaseeClient;

// Same API for all sources
const updates = await source.getLatestUpdates();
```

### MangaDex API Integration

**API Base:** `https://api.mangadex.org`

**Key Endpoints:**
- `GET /chapter` - Latest chapters (with filters)
- `GET /manga/{id}` - Manga details
- `GET /at-home/server/{chapterId}` - Image URLs

**Rate Limiting:** MangaDex has rate limits. Future: implement request queue.

**Image Loading:**
```
getChapterPages(chapterId)
    ↓
Fetch /at-home/server/{chapterId}
    ↓
Returns: { baseUrl, chapter: { hash, data: [...filenames] } }
    ↓
Construct URLs: baseUrl/data/hash/filename
    ↓
Return ChapterPage[]
```

## Performance Optimizations

### Image Rendering

**FlatList Optimization:**
```typescript
<FlatList
  removeClippedSubviews={true}      // Remove off-screen views
  maxToRenderPerBatch={3}           // Render 3 at a time
  windowSize={5}                    // Keep 5 pages in memory
  initialNumToRender={1}            // Start with 1 page
  getItemLayout={(_, index) => ({   // Skip measurement
    length: screenWidth,
    offset: screenWidth * index,
    index,
  })}
/>
```

**Progressive Loading (Long Strip):**
```typescript
const [loadedImages, setLoadedImages] = useState(new Set([0]));

onViewableItemsChanged={({ viewableItems }) => {
  // Load visible + nearby pages only
  viewableItems.forEach((item) => {
    loadedImages.add(item.index);
    loadedImages.add(item.index - 1);
    loadedImages.add(item.index + 1);
  });
}}
```

### Memory Management

**Problem:** Loading 100+ high-res images = memory overflow

**Solutions:**
1. Virtualization (FlatList)
2. Remove clipped subviews
3. Lazy loading
4. Image caching (future: LRU cache)

### Network Optimization

**Problem:** Fetching 50+ page URLs sequentially is slow

**Future Solutions:**
1. Parallel fetching
2. Image preloading
3. CDN optimization
4. Progressive image formats (WebP)

## Navigation Architecture

### Stack Navigator

```
RootStack
├── Home Screen
├── Offline Library Screen
└── Reader Tabs Screen (modal)
```

**Why Stack over Tabs?**
- Reader should be full-screen modal
- Home and Library are separate flows
- Tabs would show persistent nav bar (unwanted in reader)

**Modal Presentation:**
```typescript
<Stack.Screen
  name="ReaderTabs"
  options={{
    headerShown: false,
    presentation: 'modal',  // iOS modal animation
  }}
/>
```

## Type System

### Type Hierarchy

```
ReaderSession
    ↓
ReaderContent (union)
    ↓
├── OfflineReaderContent
│       ↓
│   OfflineBook
│       ↓
│   Page[]
├── PdfReaderContent
│       ↓
│   PdfFile
└── OnlineReaderContent
        ↓
    OnlineManga + OnlineChapter
        ↓
    ChapterPage[]
```

### Union Types for Content

```typescript
type ReaderContent = 
  | { type: 'offline-folder'; book: OfflineBook }
  | { type: 'offline-pdf'; pdf: PdfFile }
  | { type: 'mangadex'; manga: OnlineManga; chapter: OnlineChapter; pages: ChapterPage[] };
```

**Benefits:**
- Type-safe content access
- Compiler ensures all cases handled
- Easy to add new content types

### Type Guards

```typescript
function renderReader(content: ReaderContent) {
  if (content.type === 'offline-folder') {
    // TypeScript knows: content.book exists
    return <ImageReader pages={content.book.pages} />;
  }
  if (content.type === 'offline-pdf') {
    // TypeScript knows: content.pdf exists
    return <PdfReader uri={content.pdf.uri} />;
  }
  // etc.
}
```

## Testing Strategy

### Unit Tests (Future)

```
src/
  shared/
    utils/
      naturalSort.test.ts      # Test sorting algorithm
      imageUtils.test.ts       # Test file type detection
  features/
    offline/
      services/
        folderScanner.test.ts  # Test folder scanning logic
    online/
      services/
        mangadexClient.test.ts # Test API parsing
```

### Integration Tests (Future)

```
tests/
  integration/
    offline-flow.test.ts    # Folder → Reader flow
    online-flow.test.ts     # MangaDex → Reader flow
    multi-tab.test.ts       # Tab management
```

### E2E Tests with Detox (Future)

```
e2e/
  homeScreen.e2e.ts
  offlineLibrary.e2e.ts
  reader.e2e.ts
```

## Security Considerations

### File Access

- Use scoped directory access (Android SAF)
- No direct file system access
- User must grant permission per folder

### Network Security

- HTTPS only for MangaDex
- No sensitive data stored
- No authentication in v1 (future: secure token storage)

### Data Privacy

- No analytics or tracking (v1)
- No personal data collection
- Library data stored locally only

## Future Architectural Changes

### v1.1: Persistence

```typescript
// Add SQLite or AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Persist stores
const useOfflineStore = create(
  persist(/* store */, { 
    name: 'offline-storage',
    getStorage: () => AsyncStorage,
  })
);
```

### v1.2: Download Manager

```
DownloadQueue
    ↓
Chapter → Pages
    ↓
Download sequentially with retry
    ↓
Store in FileSystem.documentDirectory
    ↓
Update download progress
    ↓
Make available offline
```

### v2.0: Plugin System

```typescript
interface SourcePlugin {
  name: string;
  version: string;
  adapter: MangaSourceAdapter;
  icon?: string;
}

// User-installable sources
registerPlugin(mangaseePlugin);
registerPlugin(manganatoPlugin);
```

## Conclusion

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Type safety throughout
- ✅ Easy to extend and maintain
- ✅ Good performance
- ✅ Scalable to v2+ features

The modular design allows independent development of features while maintaining a cohesive app experience.

