import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen, ChapterSelectionScreen } from '../../features/online/screens';
import { OfflineLibraryScreen } from '../../features/offline/screens';
import { ReaderTabsScreen } from '../../features/reader/screens';
import { RootStackParamList } from './types';
import { COLORS } from '../../shared/theme';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
          borderBottomColor: COLORS.border,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        cardStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OfflineLibrary"
        component={OfflineLibraryScreen}
        options={{ title: 'Offline Library' }}
      />
      <Stack.Screen
        name="ChapterSelection"
        component={ChapterSelectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReaderTabs"
        component={ReaderTabsScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};
