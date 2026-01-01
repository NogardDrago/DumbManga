# Startup Checklist ✅

Quick checklist to verify the app is ready to run.

## Pre-Flight Checks

### 1. Files Exist
- [x] `App.tsx` exists
- [x] `package.json` has correct "main" entry
- [x] `src/` directory structure is complete
- [x] All screen components exist
- [x] All store files exist

### 2. Configuration Files
- [x] `package.json` - main: "node_modules/expo/AppEntry.js"
- [x] `tsconfig.json` - configured correctly
- [x] `babel.config.js` - no unnecessary plugins
- [x] `app.json` - no missing asset references

### 3. TypeScript Compilation
```bash
npm run type-check
```
Expected: ✅ Exit code 0 (no errors)

### 4. Critical Import
Check first line of `App.tsx`:
```tsx
import 'react-native-gesture-handler'; // Must be first!
```
Status: ✅ Added

### 5. Dependencies Installed
```bash
npm list --depth=0
```
All required packages should be listed without errors.

## Run the App

### Option 1: Default Start
```bash
npm start
```

### Option 2: Clear Cache Start (Recommended for first run)
```bash
npm start -- --clear
```

### Option 3: Platform Specific
```bash
npm run ios      # iOS simulator
npm run android  # Android emulator
```

## Expected Behavior

### On Successful Start:
1. ✅ Metro bundler starts
2. ✅ QR code appears in terminal
3. ✅ No red error messages
4. ✅ Shows: "Metro waiting on exp://..."

### When App Loads on Device:
1. ✅ Black splash screen (default Expo)
2. ✅ App loads without crashes
3. ✅ Home screen shows "MangaDex Updates"
4. ✅ Navigation works

## Common Issues (Should NOT Occur)

### ❌ "Cannot resolve entry file"
**Status:** FIXED in package.json

### ❌ "Cannot find module 'react-native-reanimated/plugin'"
**Status:** FIXED in babel.config.js

### ❌ "Unable to resolve asset ./assets/icon.png"
**Status:** FIXED in app.json

### ❌ "getConstants is null"
**Status:** FIXED in App.tsx (gesture handler import)

### ❌ TypeScript errors
**Status:** FIXED in multiple files

## If You See Errors

### Step 1: Check Error Message
- Read the error carefully
- Check FIXES_APPLIED.md for known issues

### Step 2: Clear Everything
```bash
# Stop the dev server (Ctrl+C)

# Clear caches
rm -rf node_modules/.cache
rm -rf .expo

# Restart with clear
npm start -- --clear
```

### Step 3: Nuclear Option
```bash
# Stop server
# Delete node_modules
rm -rf node_modules

# Reinstall
npm install

# Start fresh
npm start -- --clear
```

### Step 4: Verify TypeScript
```bash
npm run type-check
```
Should show no errors.

## Success Indicators

✅ **TypeScript Check Passes:**
```bash
npm run type-check
# Exit code: 0
```

✅ **Metro Starts Successfully:**
```
Metro waiting on exp://...
› Scan the QR code above
```

✅ **App Loads on Device:**
- No crash
- Home screen visible
- Can navigate between screens

✅ **No Red Errors in Terminal:**
- No "Cannot find module"
- No "Cannot resolve"
- No TypeScript errors

## Quick Test Plan

Once app is running, test these:

### 1. Navigation
- [x] Home screen loads
- [x] Can tap "Offline Library" button
- [x] Can navigate back

### 2. Online Features
- [x] MangaDex updates load (requires internet)
- [x] Can see manga list
- [x] Tapping manga attempts to load chapter

### 3. Offline Features
- [x] Offline Library screen loads
- [x] "Pick Folder" button exists
- [x] "Pick PDF" button exists

### 4. Reader (if you have content)
- [ ] Reader opens when manga/book selected
- [ ] Can see pages
- [ ] Can flip through pages
- [ ] Mode toggle works

## Current Status

**All Build Errors:** ✅ FIXED  
**TypeScript Errors:** ✅ FIXED  
**Configuration:** ✅ CORRECT  
**Dependencies:** ✅ INSTALLED  
**Ready to Run:** ✅ YES  

## Need Help?

1. **Check FIXES_APPLIED.md** - All fixes documented
2. **Check QUICKSTART.md** - Troubleshooting section
3. **Check SETUP.md** - Detailed setup guide
4. **Check terminal output** - Error messages are usually helpful

## Final Command

**Run this to start the app:**

```bash
npm start -- --clear
```

Then scan the QR code with Expo Go app on your phone!

---

**Date:** 2026-01-01  
**Status:** ✅ READY TO RUN  
**All Known Issues:** RESOLVED  

