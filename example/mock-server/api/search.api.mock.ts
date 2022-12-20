import {
  Barricade,
  HttpStatusCode,
  Method,
  MockedRequest,
  PathEvaluaionType,
  RequestConfig,
} from 'react-native-barricade';

import * as searchPageOne from '../mocks/search/success/searchPage1.mock.json';
import * as searchPageTwo from '../mocks/search/success/searchPage2.mock.json';
import * as searchPageThree from '../mocks/search/success/searchPage3.mock.json';
import * as errorData from '../mocks/search/error/searchError.mock.json';
import * as noData from '../mocks/common/noData.mock.json';
import { apiConfig } from '../../src/network';

const successResponseHandler = (request: MockedRequest) => {
  const { page } = request.params ?? {};

  let response = searchPageThree;
  if (page === '1') {
    response = searchPageOne;
  } else if (page === '2') {
    response = searchPageTwo;
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
    status: HttpStatusCode.BAD_REQUEST,
    headers: { 'Content-Type': 'application/json' },
    response: JSON.stringify(errorData),
  };
};

const SearchApiRequestConfig: RequestConfig = {
  label: 'Search',
  method: Method.Get,
  pathEvaluation: {
    path: apiConfig.photos.search,
    type: PathEvaluaionType.Includes,
  },
  responseHandler: [
    {
      label: 'Success',
      handler: successResponseHandler,
    },
    {
      label: 'No data',
      handler: noDataResponseHandler,
    },
    {
      label: 'Failure',
      handler: errorResponseHandler,
    },
  ],
};

export { SearchApiRequestConfig };
