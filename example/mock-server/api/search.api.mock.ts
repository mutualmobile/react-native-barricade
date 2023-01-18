import {
  HttpStatusCode,
  Method,
  Request,
  PathEvaluationType,
  RequestConfig,
} from 'react-native-barricade';

import * as searchPageOne from '../mocks/search/success/searchPage1.mock.json';
import * as searchPageTwo from '../mocks/search/success/searchPage2.mock.json';
import * as searchPageThree from '../mocks/search/success/searchPage3.mock.json';
import * as errorData from '../mocks/search/error/searchError.mock.json';
import * as noData from '../mocks/common/noData.mock.json';
import { apiConfig } from '../../src/network';

const successResponseHandler = (request: Request) => {
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

  if (page === '3') {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      headers: { 'Content-Type': 'application/json' },
      response: JSON.stringify(errorData),
    };
  } else {
    const response = page === '1' ? searchPageOne : searchPageTwo;
    return {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
      response: JSON.stringify(response),
    };
  }
};

const SearchApiRequestConfig: RequestConfig = {
  label: 'Search',
  method: Method.Get,
  pathEvaluation: {
    path: apiConfig.photos.search,
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
};

export { SearchApiRequestConfig };
