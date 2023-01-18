import {
  Method,
  PathEvaluationType,
  Request,
  RequestConfig,
  RequestConfigForLib,
} from '../../network/barricade.types';
import { HttpStatusCode } from '../../network/http-codes';

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
        return {
          status: HttpStatusCode.OK,
          headers: { 'content-type': 'application/json' },
          response: '{"data":true}',
        };
      },
    },
    {
      label: 'Error',
      handler: () => {
        return {
          status: HttpStatusCode.BAD_REQUEST,
          headers: { 'content-type': 'application/json' },
          response: '{"message":"Something went wrong"}',
        };
      },
    },
  ],
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
        return {
          status: HttpStatusCode.OK,
          headers: { 'content-type': 'application/json' },
          response: '{"data":true}',
        };
      },
    },
    {
      label: 'Error',
      isSelected: false,
      handler: () => {
        return {
          status: HttpStatusCode.BAD_REQUEST,
          headers: { 'content-type': 'application/json' },
          response: '{"message":"Something went wrong"}',
        };
      },
    },
  ],
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
        return {
          status: HttpStatusCode.OK,
          headers: { 'content-type': 'application/json' },
          response: '{"data":true}',
        };
      },
    },
    {
      label: 'Error',
      isSelected: true,
      handler: () => {
        return {
          status: HttpStatusCode.BAD_REQUEST,
          headers: { 'content-type': 'application/json' },
          response: '{"message":"Something went wrong"}',
        };
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
        return {
          status: HttpStatusCode.OK,
          headers: { 'content-type': 'application/json' },
          response: '{"data":true}',
        };
      },
    },
    {
      label: 'Error',
      isSelected: true,
      handler: () => {
        return {
          status: HttpStatusCode.BAD_REQUEST,
          headers: { 'content-type': 'application/json' },
          response: '{"message":"Something went wrong"}',
        };
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
      return request.requestBody?.name;
    },
  },
  responseHandler: [
    {
      label: 'Success',
      handler: () => {
        return {
          status: HttpStatusCode.OK,
          headers: { 'content-type': 'application/json' },
          response: '{"data":true}',
        };
      },
    },
    {
      label: 'Error',
      handler: () => {
        return {
          status: HttpStatusCode.BAD_REQUEST,
          headers: { 'content-type': 'application/json' },
          response: '{"message":"Something went wrong"}',
        };
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
        return {
          status: HttpStatusCode.OK,
          headers: { 'content-type': 'application/json' },
          response: '{"data":true}',
        };
      },
    },
    {
      label: 'Error',
      isSelected: false,
      handler: () => {
        return {
          status: HttpStatusCode.BAD_REQUEST,
          headers: { 'content-type': 'application/json' },
          response: '{"message":"Something went wrong"}',
        };
      },
    },
  ],
};
