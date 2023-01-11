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
  callback: (request: Request) => boolean;
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

export interface RequestConfigForLib extends RequestConfig {
  selectedResponseLabel?: string;
}

export type ResponseData = {
  status: keyof typeof HttpStatusCodeText;
  headers: { [k: string]: string };
  response: string | ArrayBuffer | Blob;
};

export interface Request extends MockedXMLHttpRequest {
  _url: string;
  _method: string;
  params?: Record<string, string>;
}

export interface ResponseHandler {
  handler: (request: Request) => ResponseData | PromiseLike<ResponseData>;
  label: string;
  isSelected?: boolean;
}
