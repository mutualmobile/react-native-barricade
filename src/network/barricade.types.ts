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
  Callback,
  Includes,
  Suffix,
}

export interface PathEvaluationBasic {
  type: PathEvaluaionType.Includes | PathEvaluaionType.Suffix;
}

export interface PathEvaluationCallback {
  type: PathEvaluaionType.Callback;
  callback: (request: MockedRequest) => boolean;
}

export interface RequestConfig {
  label: string;
  method: Method;
  pathEvaluation: { path: string } & (
    | PathEvaluationBasic
    | PathEvaluationCallback
  );
  responseHandler: ResponseHandler[];
  delay?: number;
}

export interface RequestConfigForLib
  extends Omit<RequestConfig, 'responseHandler'> {
  responseHandler: ResponseHandlerForLib[];
  selectedResponseLabel?: string;
}

export type ResponseData = {
  status: keyof typeof HttpStatusCodeText;
  headers: { [k: string]: string };
  response: string | ArrayBuffer | Blob;
};

interface ExtraRequestData {
  _url: string;
  _method: string;
  params?: Record<string, string>;
}

export type MockedRequest = MockedXMLHttpRequest & ExtraRequestData;

export interface ResponseHandler {
  handler: (request: MockedRequest) => ResponseData | PromiseLike<ResponseData>;
  label: string;
}

export interface ResponseHandlerForLib extends ResponseHandler {
  isSelected?: boolean;
}
