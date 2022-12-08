import { Barricade, HttpStatusCode, Method } from 'react-native-barricade';

import * as photosPageOne from './mocks/photos/success/photosPage1.mock.json';
import { apiConfig } from '../src/network';
import env from '../src/config';

export const mockServer = () => {
  const server = new Barricade(env.baseUrl, [
    {
      method: Method.Get,
      path: apiConfig.photos.search,
      responseHandler: () => {
        return [
          HttpStatusCode.OK,
          { 'Content-Type': 'application/json' },
          JSON.stringify(photosPageOne),
        ];
      },
    },
  ]);

  return server;
};
