import {
  HttpStatusCode,
  Method,
  PathEvaluationType,
  Request,
  RequestConfig,
  ResponseData,
} from '@mutualmobile/react-native-barricade';

import * as recentPageOne from '../mocks/recent/success/recentPage1.mock.json';
import * as recentPageTwo from '../mocks/recent/success/recentPage2.mock.json';
import * as errorData from '../mocks/recent/error/recentError.mock.json';
import * as noData from '../mocks/common/noData.mock.json';
import { apiConfig } from '../../src/network';

const successResponseHandler = (request: Request): ResponseData => {
  const { page } = request.params ?? {};
  const response = page === '1' ? recentPageOne : recentPageTwo;

  return {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
    response: JSON.stringify(response),
  };
};

const noDataResponseHandler = (): ResponseData => {
  return {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
    response: JSON.stringify(noData),
  };
};

const errorResponseHandler = (): ResponseData => {
  return {
    status: HttpStatusCode.BAD_REQUEST,
    headers: { 'Content-Type': 'application/json' },
    response: JSON.stringify(errorData),
  };
};

const loadMoreResponseHandler = (request: Request): ResponseData => {
  // Here we can make use of many other properties in Request like headers/params to return mocked response.
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
    type: PathEvaluationType.Callback,
    callback: (request: Request) => {
      // Here we can make use of many other properties in Request like headers / params to identify the API call.
      return request._url.includes(apiConfig.photos.recent);
    },
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
  delay: 3000,
};

export { RecentApiRequestConfig };
