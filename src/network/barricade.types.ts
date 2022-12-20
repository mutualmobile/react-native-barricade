import { HttpStatusCodeText } from './http-codes';
import { MockedXMLHttpRequest } from './mocked-xml-http-request';

export enum Method {
  Delete = 'DELETE',
  Get = 'GET',
  Head = 'HEAD',
  Options = 'OPTIONS',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT',
}

export enum PathEvaluaionType {
  Closure,
  Includes,
  Suffix,
}

export interface PathEvaluationBasic {
  type: PathEvaluaionType.Includes | PathEvaluaionType.Suffix;
}

export interface PathEvaluationClosure {
  type: PathEvaluaionType.Closure;
  callback: (request: MockedRequest) => void;
}

export type RequestConfig = {
  label: string;
  method: Method;
  pathEvaluation: { path: string } & (
    | PathEvaluationBasic
    | PathEvaluationClosure
  );
  responseHandler: ResponseHandler[];
  delay?: number;
};

export type ResponseData = {
  status: keyof typeof HttpStatusCodeText;
  headers: { [k: string]: string };
  response: string;
};

interface ExtraRequestData {
  _url: string;
  _method: string;
  params?: Record<string, string>;
}

export type MockedRequest = MockedXMLHttpRequest & ExtraRequestData;

export type ResponseHandler = {
  handler: (request: MockedRequest) => ResponseData | PromiseLike<ResponseData>;
  label: string;
  isSelected?: boolean;
};

export type RequestConfigForMethod = {
  [key in Method]: RequestConfig;
};
export type RequestReferences = Record<string, RequestConfigForMethod>;
