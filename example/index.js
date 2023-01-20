import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import { mockServer } from './mock-server';
import App from './src/App';
import { Env } from './src/config';

if (Env.enableBarricade) {
  mockServer();
}

AppRegistry.registerComponent(appName, () => App);
