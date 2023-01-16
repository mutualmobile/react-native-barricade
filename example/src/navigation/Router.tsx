import { NavigationContainer } from '@react-navigation/native';
import React, { Suspense } from 'react';
import { View } from 'react-native';

import { Colors } from '../assets';

const Stack = React.lazy(() => import('./Stack'));

export const AppRouter = function (): JSX.Element {
  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: Colors.primary,
          background: Colors.background,
          card: Colors.primary,
          text: Colors.text,
          border: Colors.border,
          notification: Colors.secondary,
        },
      }}>
      <Suspense fallback={<View />}>
        <Stack />
      </Suspense>
    </NavigationContainer>
  );
};
