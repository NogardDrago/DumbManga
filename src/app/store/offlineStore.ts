import { create } from 'zustand';
import { OfflineLibraryItem } from '../../features/offline/types';

interface OfflineStore {
  libraryItems: OfflineLibraryItem[];
  
  addLibraryItem: (item: OfflineLibraryItem) => void;
  removeLibraryItem: (id: string) => void;
  updateLibraryItem: (id: string, updates: Partial<OfflineLibraryItem>) => void;
  getRecentItems: (limit?: number) => OfflineLibraryItem[];
}

export const useOfflineStore = create<OfflineStore>((set, get) => ({
  libraryItems: [],

  addLibraryItem: (item: OfflineLibraryItem) => {
    set((state) => {
      const exists = state.libraryItems.some(i => i.id === item.id);
      if (exists) {
        return {
          libraryItems: state.libraryItems.map(i => 
            i.id === item.id ? { ...i, lastOpened: new Date() } : i
          ),
        };
      }
      
      return {
        libraryItems: [...state.libraryItems, { ...item, lastOpened: new Date() }],
      };
    });
  },

  removeLibraryItem: (id: string) => {
    set((state) => ({
      libraryItems: state.libraryItems.filter(i => i.id !== id),
    }));
  },

  updateLibraryItem: (id: string, updates: Partial<OfflineLibraryItem>) => {
    set((state) => ({
      libraryItems: state.libraryItems.map(i => 
        i.id === id ? { ...i, ...updates } : i
      ),
    }));
  },

  getRecentItems: (limit = 10) => {
    const state = get();
    return [...state.libraryItems]
      .sort((a, b) => {
        const aTime = a.lastOpened?.getTime() ?? 0;
        const bTime = b.lastOpened?.getTime() ?? 0;
        return bTime - aTime;
      })
      .slice(0, limit);
  },
}));

