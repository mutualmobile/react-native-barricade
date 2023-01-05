import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { BarricadeView } from 'react-native-barricade';
import { Provider } from 'react-redux';

import { Colors } from './assets';
import { useAppDispatch } from './hooks/reduxHooks';
import AppRouter from './navigation/Router';
import { setNetworkChange } from './redux/actions/global.action';
import store from './redux/store';

const AppContent = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useAppDispatch();

  useEffect(() => {
    NetInfo.addEventListener(handleConnectivityChange);
  }, []);

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
      <BarricadeView />
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
