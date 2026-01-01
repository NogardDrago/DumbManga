# Manga Reader App

A production-grade React Native manga reader app built with Expo, featuring offline reading, PDF support, online MangaDex integration, and multi-tab reading sessions.

## Features

### ✅ Implemented (v1.0)

- **Offline Reading**
  - Folder-based image reading (jpg, png, webp, gif, bmp)
  - Natural sorting for proper page order (1, 2, 3...10 vs 1, 10, 2)
  - Support for single-book and multi-chapter folder structures
  - Two reading modes: Page Flip (horizontal) and Long Strip (vertical)

- **PDF Reading**
  - Native PDF support with page navigation
  - Zoom and pan controls
  - Page indicator

- **Online MangaDex Integration**
  - Latest manga updates feed
  - Chapter reading with high-quality images
  - Extensible architecture for adding more sources

- **Multi-Tab Reader Sessions**
  - Open multiple manga/books simultaneously
  - Switch between tabs seamlessly
  - Independent reading state per tab

- **Modern UI/UX**
  - Black and white theme
  - Clean, minimal interface
  - Smooth performance with lazy loading
  - Reading mode toggle on the fly

## Tech Stack

| Category | Technology | Justification |
|----------|-----------|---------------|
| **Framework** | Expo 50 | Faster setup, good cross-platform support, managed workflow |
| **Navigation** | React Navigation v6 | Industry standard, flexible stack & tab navigation |
| **State Management** | Zustand | Lightweight, simple API, perfect for app-level state without boilerplate |
| **File System** | expo-file-system + expo-document-picker | Native file access, good permission handling |
| **Image Rendering** | FlatList (paging + vertical) | Optimized for large lists, built-in virtualization |
| **PDF Rendering** | react-native-pdf | Mature library with zoom/pan support |
| **Networking** | Axios | Better API than fetch, interceptors, timeout handling |
| **TypeScript** | Strict mode | Type safety, better IDE support, fewer runtime errors |

## Project Structure

```
/src
  /app
    /navigation          # Navigation setup (Stack Navigator)
    /store              # Zustand stores (reader, offline, settings)
  /features
    /offline
      /services         # Folder scanner, document picker
      /components       # Offline-specific UI
      /screens         # OfflineLibraryScreen
      types.ts         # Offline types
    /online
      /services        # MangaDex API client
      /components      # Online manga UI
      /screens        # HomeScreen
      types.ts        # Online types, source adapter interface
    /reader
      /components     # PageFlipReader, LongStripReader, PdfReader
      /screens       # ReaderScreen, ReaderTabsScreen
      types.ts      # Reader session types
  /shared
    /components      # Button, Card, EmptyState, LoadingSpinner
    /utils          # Natural sort, image utils
    /theme         # Colors, spacing, typography
```

## Installation & Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Development Server

```bash
npm start
```

Or target specific platforms:

```bash
npm run ios      # Run on iOS simulator
npm run android  # Run on Android emulator
npm run web      # Run in web browser (limited functionality)
```

### Step 3: Run on Device

1. Install **Expo Go** app on your iOS/Android device
2. Scan the QR code from the terminal
3. App will load on your device

## Platform-Specific Notes

### iOS Limitations

**Folder Picking:** iOS restricts direct folder access for security reasons. The app provides fallback options:

- **Option 1:** Select multiple image files individually
- **Option 2:** Use Files app with granted permissions (requires user to manually grant access)
- **Workaround:** Pre-organize manga in folders accessible via Files app

The app detects the platform and shows appropriate instructions.

### Android

Full folder picking support via SAF (Storage Access Framework). Users can browse and select any folder with manga images.

### Permissions

**Android** (`app.json`):
- `READ_EXTERNAL_STORAGE` - Required for accessing local files
- `WRITE_EXTERNAL_STORAGE` - Optional, for future features

**iOS** (`Info.plist` - auto-configured by Expo):
- Photo Library access (when using image picker fallback)

## Usage Guide

### Offline Reading

1. **Home Screen** → Tap "Offline Library"
2. Tap "Pick Folder" (Android) or "Pick Images" (iOS)
3. Select folder containing manga pages
4. Images will be scanned and sorted naturally
5. Tap to open in reader

**Folder Structure Support:**

```
# Single book
/MyManga/
  001.jpg
  002.jpg
  003.jpg
  ...

# Multi-chapter (TODO: v1.1)
/MyManga/
  /Chapter 1/
    001.jpg
    002.jpg
  /Chapter 2/
    001.jpg
    002.jpg
```

### PDF Reading

1. **Offline Library** → Tap "Pick PDF"
2. Select PDF file
3. Opens in reader with page flip mode

### Online Reading (MangaDex)

1. **Home Screen** shows latest manga updates
2. Tap any manga to load chapter
3. Pages load progressively
4. Opens in reader

### Reader Controls

- **Tap center of screen** → Show/hide controls
- **Mode Toggle** → Switch between Page Flip and Long Strip
- **Close button** → Exit reader (session persists)

### Multi-Tab Sessions

- Each book/manga opens in a new tab
- **Tab bar** at top shows all open sessions
- Tap tab to switch
- Tap **✕** to close a tab
- Reading position saved per tab

## Configuration

### Default Settings

Edit `src/app/store/settingsStore.ts`:

```typescript
{
  defaultReaderMode: 'pageFlip',  // or 'longStrip'
  defaultReadingDirection: 'ltr', // or 'rtl'
}
```

### Theme Colors

Edit `src/shared/theme/colors.ts` for UI customization (currently black/white per user preference).

## Architecture Highlights

### State Management (Zustand)

**Why Zustand?**
- No boilerplate (vs Redux)
- Simple API
- Good TypeScript support
- Perfect for small-to-medium apps

**Stores:**
- `readerStore`: Multi-tab session management
- `offlineStore`: In-memory library (no persistence yet)
- `settingsStore`: User preferences

### Reader Sessions

Each reading session is a self-contained unit:

```typescript
interface ReaderSession {
  sessionId: string;
  title: string;
  sourceType: 'offline-folder' | 'offline-pdf' | 'mangadex';
  content: ReaderContent;  // Union type for different sources
  readerMode: 'pageFlip' | 'longStrip';
  currentPage: number;
  totalPages: number;
  readingDirection?: 'ltr' | 'rtl';
  createdAt: Date;
}
```

### Extensible Source System

Adding new manga sources is easy:

```typescript
interface MangaSourceAdapter {
  sourceType: string;
  getLatestUpdates(limit?: number): Promise<MangaUpdate[]>;
  getMangaDetails(mangaId: string): Promise<OnlineManga>;
  getChapterList(mangaId: string): Promise<OnlineChapter[]>;
  getChapterPages(chapterId: string): Promise<ChapterPage[]>;
  searchManga(query: string): Promise<OnlineManga[]>;
}
```

Implement this interface for new sources (e.g., MangaSee, Manganato).

## Known Limitations & Roadmap

### Current Limitations

1. **No persistence** - Library and sessions lost on app restart
2. **iOS folder picking** - Limited by platform restrictions
3. **No chapter navigation** - Multi-chapter books show first chapter only
4. **No search** - MangaDex search not exposed in UI yet
5. **No download manager** - Online chapters not cached

### Roadmap (v1.1+)

#### Phase 1: Persistence (v1.1)
- [ ] Add AsyncStorage or SQLite
- [ ] Persist library items
- [ ] Persist reading sessions and positions
- [ ] Persist user settings

#### Phase 2: Enhanced Features (v1.2)
- [ ] Chapter list navigation
- [ ] Bookmarks
- [ ] Reading history
- [ ] MangaDex search UI
- [ ] User authentication (MangaDex follows)

#### Phase 3: Performance (v1.3)
- [ ] Image caching for online sources
- [ ] Download manager for offline reading
- [ ] Progressive image loading
- [ ] Memory optimization

#### Phase 4: Additional Sources (v2.0)
- [ ] MangaSee adapter
- [ ] Manganato adapter
- [ ] Plugin system for community sources

## Testing Strategy

### Manual Testing Checklist

- [ ] Offline: Pick folder (Android) / images (iOS)
- [ ] Offline: Page flip mode navigation
- [ ] Offline: Long strip mode scrolling
- [ ] PDF: Open and navigate
- [ ] Online: Load MangaDex updates
- [ ] Online: Open and read chapter
- [ ] Multi-tab: Open multiple items
- [ ] Multi-tab: Switch between tabs
- [ ] Multi-tab: Close tabs
- [ ] Reader: Toggle modes
- [ ] Reader: Page indicator accuracy

### Automated Testing (Future)

```bash
# Unit tests (TODO)
npm test

# E2E tests with Detox (TODO)
npm run e2e:ios
npm run e2e:android
```

## Troubleshooting

### Build Errors

**Issue:** `expo-document-picker` not found
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
expo start -c
```

**Issue:** React Native PDF errors on iOS
```bash
cd ios && pod install && cd ..
```

### Runtime Errors

**Issue:** Images not loading
- Check file permissions
- Verify image URIs are valid
- Check console for errors

**Issue:** MangaDex API fails
- Check internet connection
- API rate limits may apply
- Use browser to verify API status: https://api.mangadex.org

### Performance Issues

**Issue:** Slow page flipping
- Reduce `windowSize` in FlatList (currently 5)
- Check device performance
- Images may be too large (optimize source)

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Follow existing code structure
4. Add types for new features
5. Test on both iOS and Android
6. Submit pull request

## Code Style

- TypeScript strict mode (enforced)
- ESLint configuration included
- Functional components with hooks
- Modular architecture (features/)

```bash
# Lint code
npm run lint

# Type check
npm run type-check
```

## License

MIT License - See LICENSE file for details

## Credits

- **MangaDex API**: https://api.mangadex.org
- **React Native**: https://reactnative.dev
- **Expo**: https://expo.dev

## Support

For issues and questions:
1. Check this README
2. Search existing issues
3. Create new issue with reproduction steps

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-01  
**Minimum OS:** iOS 13+ / Android 6+  

