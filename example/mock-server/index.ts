import {
  createBarricade,
  getBarricadeInstance,
} from '@mutualmobile/react-native-barricade';

import { RecentApiRequestConfig } from './api/recent.api.mock';
import { SearchApiRequestConfig } from './api/search.api.mock';

export const mockServer = () => {
  const barricade = createBarricade([RecentApiRequestConfig]);
  barricade.start(); // We can also call this like - getBarricadeInstance()?.start();
  getBarricadeInstance()?.registerRequest(SearchApiRequestConfig);
};
