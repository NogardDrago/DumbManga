import React from 'react';
import { NavigationContainer as RNNavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './RootNavigator';

export const NavigationContainer: React.FC = () => {
  return (
    <RNNavigationContainer>
      <RootNavigator />
    </RNNavigationContainer>
  );
};

