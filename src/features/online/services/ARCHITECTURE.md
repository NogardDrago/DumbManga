# Multi-Source Architecture

## Overview

The manga source system is designed to support multiple manga websites/APIs through a modular, plugin-like architecture.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Application Layer                     │
│  (HomeScreen, SearchScreen, MangaDetailsScreen, etc.)       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      sourceManager                           │
│  • Unified API for all sources                              │
│  • Aggregates results from multiple sources                 │
│  • Handles errors and fallbacks                             │
│  • Sorts and filters results                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    sourceRegistry                            │
│  • Registers all available sources                          │
│  • Manages enabled/disabled state                           │
│  • Defines priority order                                   │
│  • Provides source lookup                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┬─────────────┐
         ▼               ▼               ▼             ▼
    ┌─────────┐    ┌─────────┐    ┌─────────┐   ┌─────────┐
    │MangaDex │    │MangaSee │    │MangaNato│   │  More   │
    │ Client  │    │ Client  │    │ Client  │   │ Sources │
    └────┬────┘    └────┬────┘    └────┬────┘   └────┬────┘
         │              │              │              │
         │              │              │              │
    Implements     Implements     Implements     Implements
         │              │              │              │
         └──────────────┴──────────────┴──────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ MangaSourceAdapter   │
              │   (Interface)        │
              │                      │
              │ • getLatestUpdates() │
              │ • searchManga()      │
              │ • getMangaDetails()  │
              │ • getChapterList()   │
              │ • getChapterPages()  │
              │ • isAvailable()      │
              └──────────────────────┘
```

## Data Flow

### 1. Get Latest Updates
```
User opens HomeScreen
    ↓
HomeScreen calls: sourceManager.getLatestUpdates(20)
    ↓
sourceManager gets enabled sources from sourceRegistry
    ↓
sourceManager calls each source's getLatestUpdates()
    ↓
Results are aggregated, sorted by date, and limited
    ↓
HomeScreen displays combined results
```

### 2. Open Chapter
```
User taps manga
    ↓
HomeScreen calls: sourceManager.getChapterPages(sourceType, chapterId)
    ↓
sourceManager looks up source by sourceType
    ↓
Calls specific source's getChapterPages()
    ↓
Returns page URLs
    ↓
ReaderScreen displays pages
```

## Component Responsibilities

### sourceManager
- **Purpose**: Single entry point for all manga source operations
- **Responsibilities**:
  - Route requests to appropriate sources
  - Aggregate results from multiple sources
  - Handle errors gracefully
  - Sort and filter results
- **Does NOT**: Know implementation details of any source

### sourceRegistry
- **Purpose**: Central registry of all manga sources
- **Responsibilities**:
  - Store source configurations
  - Provide source lookup by ID
  - Filter enabled/disabled sources
  - Maintain priority order
- **Does NOT**: Make API calls or process data

### MangaSourceAdapter (Interface)
- **Purpose**: Contract that all sources must follow
- **Responsibilities**:
  - Define required methods
  - Define method signatures
  - Ensure consistency across sources
- **Does NOT**: Contain implementation

### Individual Source Clients (e.g., MangaDexClient)
- **Purpose**: Implement specific manga source
- **Responsibilities**:
  - Make API calls to source
  - Parse responses
  - Transform data to common format
  - Handle source-specific logic
- **Does NOT**: Know about other sources or sourceManager

## Key Design Principles

### 1. Separation of Concerns
Each component has a single, well-defined responsibility.

### 2. Open/Closed Principle
- Open for extension (add new sources easily)
- Closed for modification (existing code doesn't change)

### 3. Dependency Inversion
- High-level modules (sourceManager) depend on abstractions (MangaSourceAdapter)
- Low-level modules (MangaDexClient) implement abstractions

### 4. Interface Segregation
- MangaSourceAdapter defines only what's needed
- Optional methods (authenticate, isAvailable) are truly optional

### 5. Single Responsibility
- Each source handles only its own API
- sourceManager handles only coordination
- sourceRegistry handles only configuration

## Adding a New Source - Step by Step

```
1. Create source folder
   sources/newsource/

2. Implement client
   newsource/newsourceClient.ts
   - Implements MangaSourceAdapter
   - Makes API calls
   - Parses responses

3. Create helpers (optional)
   newsource/newsourceParser.ts
   newsource/constants.ts

4. Register source
   sourceRegistry.ts
   - Add to sourceRegistry array
   - Set enabled/priority

5. Done! Source is now available
```

## Error Handling Strategy

### Source-Level Errors
- Each source handles its own API errors
- Throws descriptive error messages
- Logs errors for debugging

### Manager-Level Errors
- sourceManager catches source errors
- Continues with other sources
- Logs warnings for failed sources
- Returns partial results if some sources succeed

### Application-Level Errors
- UI components handle final errors
- Display user-friendly messages
- Provide retry mechanisms

## Performance Considerations

### Parallel Requests
- sourceManager can query multiple sources in parallel
- Uses Promise.allSettled for concurrent requests
- Doesn't wait for slow sources to finish

### Caching (Future Enhancement)
- Can add caching layer in sourceManager
- Cache latest updates for X minutes
- Cache search results
- Per-source cache invalidation

### Rate Limiting (Future Enhancement)
- Implement rate limiting per source
- Respect source API limits
- Queue requests if needed

## Testing Strategy

### Unit Tests
- Test each source client independently
- Mock API responses
- Test parsing logic

### Integration Tests
- Test sourceManager with multiple sources
- Test error handling
- Test result aggregation

### E2E Tests
- Test full flow from UI to source
- Test with real API calls (optional)
- Test fallback scenarios

## Future Enhancements

1. **Source Settings**
   - Per-source configuration
   - API keys/authentication
   - Language preferences

2. **Source Health Monitoring**
   - Track source availability
   - Auto-disable failing sources
   - Re-enable when recovered

3. **Smart Source Selection**
   - Learn user preferences
   - Prioritize faster sources
   - Prefer sources with better quality

4. **Offline Support**
   - Cache manga metadata
   - Queue downloads
   - Sync when online

5. **Advanced Search**
   - Filter by source
   - Cross-source deduplication
   - Advanced filters (genre, status, etc.)

