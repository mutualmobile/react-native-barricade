import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { BarricadeView } from 'react-native-barricade';
import { Provider } from 'react-redux';

import { Colors } from './assets';
import AppRouter from './navigation/Router';
import store from './redux/store';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.primary}
      />
      <AppRouter />
      <BarricadeView />
    </Provider>
  );
};

export default App;
