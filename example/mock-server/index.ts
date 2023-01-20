import { createBarricade } from 'react-native-barricade';

import { RecentApiRequestConfig } from './api/recent.api.mock';
import { SearchApiRequestConfig } from './api/search.api.mock';

export const mockServer = () => {
  const barricade = createBarricade([
    RecentApiRequestConfig,
    SearchApiRequestConfig,
  ]);
  barricade.start();
};
