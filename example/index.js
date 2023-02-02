import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import { setupBarricade } from './mock-server';
import App from './src/App';

setupBarricade();

AppRegistry.registerComponent(appName, () => App);
