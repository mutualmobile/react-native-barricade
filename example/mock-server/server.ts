import { enableBarricade } from 'react-native-barricade';

import env from '../src/config';
import { RecentApiRequestConfig } from './api/recent.api.mock';
import { SearchApiRequestConfig } from './api/search.api.mock';

export const mockServer = () => {
  enableBarricade(env.baseUrl, [
    RecentApiRequestConfig,
    SearchApiRequestConfig,
  ]);
};