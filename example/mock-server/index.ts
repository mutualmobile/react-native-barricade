import { createBarricade } from '@mutualmobile/react-native-barricade';

import { RecentApiRequestConfig } from './api/recent.api.mock';
import { SearchApiRequestConfig } from './api/search.api.mock';

export const mockServer = () => {
  const barricade = createBarricade([
    RecentApiRequestConfig,
    SearchApiRequestConfig,
  ]);
  barricade.start(); // We can all call this like - getBarricadeInstance()?.start();
};
