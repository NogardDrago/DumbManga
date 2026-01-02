import { OnlineManga } from '../../features/online/types';

export type RootStackParamList = {
  Home: undefined;
  OfflineLibrary: undefined;
  ReaderTabs: undefined;
  Settings: undefined;
  ChapterSelection: { manga: OnlineManga };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

