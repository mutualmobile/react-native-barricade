import { Barricade } from 'react-native-barricade';

import env from '../src/config';
import { RecentApiRequestConfig } from './api/recent.api.mock';
import { SearchApiRequestConfig } from './api/search.api.mock';

export const mockServer = () => {
  const server = new Barricade(env.baseUrl, [
    RecentApiRequestConfig,
    SearchApiRequestConfig,
  ]);

  return server;
};
