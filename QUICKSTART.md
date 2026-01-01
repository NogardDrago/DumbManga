# Quick Start Guide

Get the app running in 5 minutes.

## TL;DR

```bash
# 1. Install dependencies
npm install

# 2. Start the app
npm start

# 3. Scan QR code with Expo Go app on your phone
```

## Prerequisites

- Node.js 18+
- npm
- Expo Go app on your phone (optional but easiest)

## Step 1: Install Dependencies

```bash
cd E:\MangaApp
npm install
```

Wait 2-3 minutes for installation to complete.

## Step 2: Start Development Server

```bash
npm start
```

You'll see a QR code in your terminal.

## Step 3: Open on Phone

### iOS:
1. Open Camera app
2. Point at QR code
3. Tap notification to open in Expo Go

### Android:
1. Open Expo Go app
2. Tap "Scan QR Code"
3. Point at QR code

**First load takes 30-60 seconds.**

## Step 4: Test Features

1. **Home Screen:** See MangaDex latest updates
2. **Tap "Offline Library":** Pick folder or PDF
3. **Tap any manga:** Opens in reader
4. **Tap screen:** Show/hide reader controls
5. **Toggle reading mode:** Page Flip ↔ Long Strip

## Using Simulator (Optional)

### iOS Simulator (Mac only):
```bash
npm run ios
```

### Android Emulator:
```bash
npm run android
```

## Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

### "getConstants" is null error
This means gesture handler isn't initialized. **Already fixed!**
- First line of App.tsx must be: `import 'react-native-gesture-handler';`
- Clear cache: `npm start -- --clear`

### Connection issues
- Ensure phone and computer on same WiFi
- Try tunnel mode: `npm start -- --tunnel`

### App won't load
- Check terminal for errors
- Reload: Shake phone → "Reload"
- Or press `r` in terminal

### Type errors
Run type check to see what's wrong:
```bash
npm run type-check
```

All type errors should be fixed. If you see any, check FIXES_APPLIED.md

## What's Next?

- **Read README.md** for full feature list
- **Read SETUP.md** for detailed installation
- **Read ARCHITECTURE.md** to understand code structure

## Key Files to Know

```
App.tsx                           # Entry point
src/app/navigation/              # Navigation setup
src/features/reader/screens/     # Reader screens
src/features/offline/services/   # Folder scanning
src/features/online/services/    # MangaDex API
```

## Common Tasks

### Clear cache and restart:
```bash
npm start -- --clear
```

### Check for type errors:
```bash
npm run type-check
```

### Run linter:
```bash
npm run lint
```

## You're Ready! 🚀

The app should now be running. Start exploring the code and adding features!

