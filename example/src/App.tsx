import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { BarricadeView, showBarricadeView } from 'react-native-barricade';
import { Provider } from 'react-redux';

import { Colors, Images } from './assets';
import { IconButton } from './components';
import { Env } from './config';
import { useAppDispatch, useMountEffect } from './hooks';
import { AppRouter } from './navigation';
import { setNetworkChange, store } from './redux';

const AppContent = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useAppDispatch();

  useMountEffect(() => {
    NetInfo.addEventListener(handleConnectivityChange);
  });

  const handleConnectivityChange = (state: NetInfoState) => {
    dispatch(setNetworkChange(!!state.isInternetReachable));
  };

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.primary}
      />
      <AppRouter />
      {!__DEV__ && Env.enableBarricade && (
        <IconButton icon={Images.logo} onPress={showBarricadeView} />
      )}
      {Env.enableBarricade && <BarricadeView />}
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
