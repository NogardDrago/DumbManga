export type RootStackParamList = {
  Home: undefined;
  OfflineLibrary: undefined;
  ReaderTabs: undefined;
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

