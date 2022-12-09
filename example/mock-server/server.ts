import {
  Barricade,
  HttpStatusCode,
  Method,
  MockedRequest,
} from 'react-native-barricade';

import * as photosPageOne from './mocks/photos/success/photosPage1.mock.json';
import * as photosPageTwo from './mocks/photos/success/photosPage2.mock.json';
import * as photosPageThree from './mocks/photos/success/photosPage3.mock.json';
import * as noData from './mocks/photos/success/photosNoData.mock.json';
import * as errorData from './mocks/photos/error/photosError.mock.json';
import { apiConfig } from '../src/network';
import env from '../src/config';

export const mockServer = () => {
  const successResponseHandler = (request: MockedRequest) => {
    const { page } = request.params ?? {};

    let response = photosPageThree;
    if (page === '1') {
      response = photosPageOne;
    } else if (page === '2') {
      response = photosPageTwo;
    }

    return {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
      response: JSON.stringify(response),
    };
  };

  const noDataResponseHandler = (request: MockedRequest) => {
    return {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
      response: JSON.stringify(noData),
    };
  };

  const errorResponseHandler = (request: MockedRequest) => {
    return {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
      response: JSON.stringify(errorData),
    };
  };

  const server = new Barricade(env.baseUrl, [
    {
      method: Method.Get,
      path: apiConfig.photos.search, // TODO: Currently "?method=flickr.photos.search" needs to be replaced with "search" as we are comapring path and not queryParams
      responseHandler: successResponseHandler,
    },
  ]);

  return server;
};
