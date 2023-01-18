import {
  Method,
  PathEvaluationType,
  Request,
  RequestConfig,
  RequestConfigForLib,
} from '../../network/barricade.types';
import { errorResponse, successResponse } from './request-test-data';

const wait = <T>(data: T, ms = 1000) =>
  new Promise<T>(resolve => setTimeout(() => resolve(data), ms));

export const firstApiConfig: RequestConfig = {
  label: 'First API',
  method: Method.Get,
  pathEvaluation: {
    path: '/first/api',
    type: PathEvaluationType.Suffix,
  },
  responseHandler: [
    {
      label: 'Success',
      handler: () => {
        return successResponse;
      },
    },
    {
      label: 'Error',
      handler: () => {
        return errorResponse;
      },
    },
  ],
  delay: 2000,
};

export const formattedFirstApiConfig: RequestConfigForLib = {
  label: 'First API',
  method: Method.Get,
  pathEvaluation: {
    path: '/first/api',
    type: PathEvaluationType.Suffix,
  },
  selectedResponseLabel: 'Success',
  responseHandler: [
    {
      label: 'Success',
      isSelected: true,
      handler: () => {
        return successResponse;
      },
    },
    {
      label: 'Error',
      isSelected: false,
      handler: () => {
        return errorResponse;
      },
    },
  ],
  delay: 2000,
};

export const secondApiConfig: RequestConfig = {
  label: 'Second API',
  method: Method.Post,
  pathEvaluation: {
    path: '/second/api',
    type: PathEvaluationType.Includes,
  },
  responseHandler: [
    {
      label: 'Success',
      handler: () => {
        return successResponse;
      },
    },
    {
      label: 'Error',
      isSelected: true,
      handler: () => {
        return errorResponse;
      },
    },
  ],
};

export const formattedSecondApiConfig: RequestConfigForLib = {
  label: 'Second API',
  method: Method.Post,
  pathEvaluation: {
    path: '/second/api',
    type: PathEvaluationType.Includes,
  },
  selectedResponseLabel: 'Error',
  responseHandler: [
    {
      label: 'Success',
      isSelected: false,
      handler: () => {
        return successResponse;
      },
    },
    {
      label: 'Error',
      isSelected: true,
      handler: () => {
        return errorResponse;
      },
    },
  ],
};

export const thirdApiConfig: RequestConfig = {
  label: 'Third API',
  method: Method.Post,
  pathEvaluation: {
    path: '/third/api',
    type: PathEvaluationType.Callback,
    callback: (request: Request) => {
      return request._headers?.['custom-header'] === 'true';
    },
  },
  responseHandler: [
    {
      label: 'Success',
      handler: () => {
        return successResponse;
      },
    },
    {
      label: 'Error',
      handler: () => {
        return errorResponse;
      },
    },
  ],
};

export const formattedThirdApiConfig: RequestConfigForLib = {
  label: 'Third API',
  method: Method.Post,
  pathEvaluation: {
    path: '/third/api',
    type: PathEvaluationType.Callback,
    callback: (request: Request) => {
      return request.requestBody?.name;
    },
  },
  selectedResponseLabel: 'Success',
  responseHandler: [
    {
      label: 'Success',
      isSelected: true,
      handler: () => {
        return successResponse;
      },
    },
    {
      label: 'Error',
      isSelected: false,
      handler: () => {
        return errorResponse;
      },
    },
  ],
};

export const asyncResponseApiConfig: RequestConfig = {
  label: 'Async API',
  method: Method.Get,
  pathEvaluation: {
    path: '/async/api',
    type: PathEvaluationType.Suffix,
  },
  responseHandler: [
    {
      label: 'Success',
      handler: () => {
        return wait(successResponse);
      },
    },
    {
      label: 'Error',
      handler: () => {
        return errorResponse;
      },
    },
  ],
};

export const formattedAsyncResponseApiConfig: RequestConfigForLib = {
  label: 'Async API',
  method: Method.Get,
  pathEvaluation: {
    path: '/async/api',
    type: PathEvaluationType.Suffix,
  },
  selectedResponseLabel: 'Success',
  responseHandler: [
    {
      label: 'Success',
      isSelected: true,
      handler: () => {
        return wait(successResponse, 3000);
      },
    },
    {
      label: 'Error',
      isSelected: false,
      handler: () => {
        return errorResponse;
      },
    },
  ],
};

export const errorResponseApiConfig: RequestConfig = {
  label: 'Error Response API',
  method: Method.Get,
  pathEvaluation: {
    path: '/error/api',
    type: PathEvaluationType.Suffix,
  },
  responseHandler: [
    {
      label: 'Success',
      handler: () => {
        return new Promise((resolve, reject) =>
          setTimeout(() => reject(successResponse), 1000),
        );
      },
    },
    {
      label: 'Error',
      handler: () => {
        return errorResponse;
      },
    },
  ],
};
