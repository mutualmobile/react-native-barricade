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

export type RequestConfig = {
  path: string;
  method: Method;
  responseHandler: ResponseHandler;
  delay?: number;
};

export type ResponseData = [
  keyof typeof HttpStatusCodeText,
  Record<string, string>,
  string,
];
interface ExtraRequestData {
  _url: string;
  _method: string;
}

export type MockedRequest = MockedXMLHttpRequest & ExtraRequestData;

export type ResponseHandler = {
  (request: MockedRequest): ResponseData | PromiseLike<ResponseData>;
};

export type RequestConfigForMethod = {
  [key in Method]: RequestConfig;
};
export type RequestReferences = Record<string, RequestConfigForMethod>;
