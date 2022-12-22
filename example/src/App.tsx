import React, { useState } from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { BarricadeView } from 'react-native-barricade';
import { Provider } from 'react-redux';

import { Colors } from './assets';
import AppRouter from './navigation/Router';
import store from './redux/store';

const infoIcon = '\u0069';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [visible, setVisible] = useState(false);

  const renderButton = () => {
    return (
      <TouchableOpacity
        onPress={() => setVisible(!visible)}
        style={styles.button}>
        <Text style={styles.buttonText}>{infoIcon}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Provider store={store}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.primary}
      />
      <AppRouter />
      {renderButton()}
      <BarricadeView
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </Provider>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    borderRadius: 50,
    right: 30,
    bottom: 70,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.bodyAlt,
  },
});

export default App;
