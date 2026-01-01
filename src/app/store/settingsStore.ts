import { create } from 'zustand';
import { ReaderMode, ReadingDirection } from '../../features/reader/types';

interface SettingsStore {
  defaultReaderMode: ReaderMode;
  defaultReadingDirection: ReadingDirection;
  
  setDefaultReaderMode: (mode: ReaderMode) => void;
  setDefaultReadingDirection: (direction: ReadingDirection) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  defaultReaderMode: 'pageFlip',
  defaultReadingDirection: 'ltr',

  setDefaultReaderMode: (mode: ReaderMode) => {
    set({ defaultReaderMode: mode });
  },

  setDefaultReadingDirection: (direction: ReadingDirection) => {
    set({ defaultReadingDirection: direction });
  },
}));

