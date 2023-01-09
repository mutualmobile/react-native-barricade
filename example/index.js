import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { mockServer } from './mock-server';

const enableMock = true;
if (enableMock) {
  mockServer();
}

AppRegistry.registerComponent(appName, () => App);
