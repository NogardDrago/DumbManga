# Assets Folder

This folder contains placeholder images. For production, replace these with your actual app icons.

## Required Assets

### 1. icon.png
- **Size:** 1024x1024 px
- **Purpose:** App icon for iOS and Android
- **Format:** PNG with transparency

### 2. splash.png
- **Size:** 1242x2436 px (iPhone X dimensions)
- **Purpose:** Splash screen shown while app loads
- **Background:** #000000 (black)
- **Format:** PNG

### 3. adaptive-icon.png
- **Size:** 1024x1024 px
- **Purpose:** Android adaptive icon
- **Background:** #000000 (black)
- **Format:** PNG

### 4. favicon.png
- **Size:** 48x48 px
- **Purpose:** Web favicon (if running as web app)
- **Format:** PNG

## Current Status

**No icon files are included.** The app uses Expo's default icons during development. This is intentional to avoid build errors with placeholder files. The app functionality is completely unaffected.

## How to Create Icons

### Quick Option: Use Expo's Icon Generator
```bash
# Install expo-cli globally if not already
npm install -g expo-cli

# Generate icons from a single 1024x1024 image
expo generate-icon path/to/your-icon.png
```

### Manual Option:
1. Design your icon (1024x1024 px)
2. Use an online tool like https://appicon.co or https://makeappicon.com
3. Replace the files in this folder

### Simple Black/White Icon
Since this app uses a black and white theme, a simple minimalist icon would work well:
- Black background
- White "M" or book icon
- Clean, modern design

## Testing Without Real Icons

The app works perfectly fine without icons during development. You'll see:
- Expo's default icon in development builds
- Black splash screen
- Full app functionality

## Before Publishing

⚠️ **Important:** Add icons before submitting to app stores!

1. Create proper icons at the sizes listed above
2. Add files to this folder (icon.png, splash.png, etc.)
3. Update `app.json` to reference them:
   ```json
   {
     "expo": {
       "icon": "./assets/icon.png",
       "splash": {
         "image": "./assets/splash.png"
       },
       "android": {
         "adaptiveIcon": {
           "foregroundImage": "./assets/adaptive-icon.png"
         }
       }
     }
   }
   ```
4. Run `expo prebuild` to regenerate native projects
5. Test on real devices

