import {
  HttpStatusCode,
  Method,
  PathEvaluationType,
  Request,
  RequestConfig,
} from '@mutualmobile/react-native-barricade';

import * as recentPageOne from '../mocks/recent/success/recentPage1.mock.json';
import * as recentPageTwo from '../mocks/recent/success/recentPage2.mock.json';
import * as errorData from '../mocks/recent/error/recentError.mock.json';
import * as noData from '../mocks/common/noData.mock.json';
import { apiConfig } from '../../src/network';

const successResponseHandler = (request: Request) => {
  const { page } = request.params ?? {};
  const response = page === '1' ? recentPageOne : recentPageTwo;

  return {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
    response: JSON.stringify(response),
  };
};

const noDataResponseHandler = () => {
  return {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
    response: JSON.stringify(noData),
  };
};

const errorResponseHandler = () => {
  return {
    status: HttpStatusCode.BAD_REQUEST,
    headers: { 'Content-Type': 'application/json' },
    response: JSON.stringify(errorData),
  };
};

const loadMoreResponseHandler = (request: Request) => {
  const { page } = request.params ?? {};

  if (page === '1') {
    return {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
      response: JSON.stringify(recentPageOne),
    };
  } else {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      headers: { 'Content-Type': 'application/json' },
      response: JSON.stringify(errorData),
    };
  }
};

const RecentApiRequestConfig: RequestConfig = {
  label: 'Recent',
  method: Method.Get,
  pathEvaluation: {
    path: apiConfig.photos.recent,
    type: PathEvaluationType.Includes,
  },
  responseHandler: [
    {
      label: 'Success',
      handler: successResponseHandler,
    },
    {
      label: 'No data',
      handler: noDataResponseHandler,
      isSelected: true,
    },
    {
      label: 'Failure',
      handler: errorResponseHandler,
    },
    {
      label: 'Failure on load more',
      handler: loadMoreResponseHandler,
    },
  ],
  delay: 5000,
};

export { RecentApiRequestConfig };
