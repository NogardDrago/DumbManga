import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../../features/online/screens';
import { OfflineLibraryScreen } from '../../features/offline/screens';
import { ReaderTabsScreen } from '../../features/reader/screens';
import { RootStackParamList } from './types';
import { colors } from '../../shared/theme';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        cardStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name="OfflineLibrary"
        component={OfflineLibraryScreen}
        options={{ title: 'Offline Library' }}
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
