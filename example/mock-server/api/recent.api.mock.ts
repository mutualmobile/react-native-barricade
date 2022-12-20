import {
  Barricade,
  HttpStatusCode,
  Method,
  MockedRequest,
  PathEvaluaionType,
  RequestConfig,
} from 'react-native-barricade';

import * as recentPageOne from '../mocks/recent/success/recentPage1.mock.json';
import * as recentPageTwo from '../mocks/recent/success/recentPage2.mock.json';
import * as errorData from '../mocks/recent/error/recentError.mock.json';
import * as noData from '../mocks/common/noData.mock.json';
import { apiConfig } from '../../src/network';

const successResponseHandler = (request: MockedRequest) => {
  const { page } = request.params ?? {};
  const response = page === '1' ? recentPageOne : recentPageTwo;

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

const RecentApiRequestConfig: RequestConfig = {
  label: 'Recent',
  method: Method.Get,
  pathEvaluation: {
    path: apiConfig.photos.recent,
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

export { RecentApiRequestConfig };
