import {
  createBarricade,
  getBarricadeInstance,
} from '@mutualmobile/react-native-barricade';

import { InfoApiRequestConfig } from './api/info.api.mock';
import { RecentApiRequestConfig } from './api/recent.api.mock';
import { SearchApiRequestConfig } from './api/search.api.mock';

export const setupBarricade = () => {
  const barricade = createBarricade([
    InfoApiRequestConfig,
    RecentApiRequestConfig,
  ]);
  barricade.start(); // We can also call this like - getBarricadeInstance()?.start();
  getBarricadeInstance()?.registerRequest(SearchApiRequestConfig);
};
