# Manga Reader App

POC manga reading app with manga sources integration, and multi-tab reading sessions (important feature that I need).

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

### Current Limitations

1. **No persistence** - Library and sessions lost on app restart
2. **iOS folder picking** - Limited by platform restrictions
3. **No chapter navigation** - Multi-chapter books show first chapter only
4. **No search** - MangaDex search not exposed in UI yet
5. **No download manager** - Online chapters not cached

# Roadmap: I update whenever I want

- **MangaDex API**: https://api.mangadex.org
- **React Native**: https://reactnative.dev
- **Expo**: https://expo.dev



