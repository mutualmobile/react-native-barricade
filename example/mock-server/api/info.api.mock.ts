import {
  HttpStatusCode,
  Method,
  PathEvaluationType,
  Request,
  RequestConfig,
  ResponseData,
} from '@mutualmobile/react-native-barricade';

import * as successData from '../mocks/info/success.mock.json';
import * as errorData from '../mocks/info/error.mock.json';
import { apiConfig } from '../../src/network';

const successResponseHandler = (request: Request): ResponseData => {
  return {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
    response: new Blob([JSON.stringify(successData)], {
      // fetch has responseType as Blob and hence we need to set response as a Blob
      type: 'application/json',
    }),
  };
};

const errorResponseHandler = (): ResponseData => {
  return {
    status: HttpStatusCode.BAD_REQUEST,
    headers: { 'Content-Type': 'application/json' },
    response: new Blob([JSON.stringify(errorData)], {
      type: 'application/json',
    }),
  };
};

const InfoApiRequestConfig: RequestConfig = {
  label: 'Info',
  method: Method.Get,
  pathEvaluation: {
    path: apiConfig.photos.info,
    type: PathEvaluationType.Includes,
  },
  responseHandler: [
    {
      label: 'Success',
      handler: successResponseHandler,
    },
    {
      label: 'Failure',
      handler: errorResponseHandler,
    },
  ],
};

export { InfoApiRequestConfig };
