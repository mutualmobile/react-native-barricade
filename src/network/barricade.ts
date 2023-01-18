//@ts-ignore
import * as RNFetch from 'react-native/Libraries/Network/fetch';

import { ObjectUtils, UrlUtils } from '../utils';
import {
  Method,
  PathEvaluationCallback,
  PathEvaluationType,
  Request,
  RequestConfig,
  RequestConfigForLib,
  ResponseData,
  ResponseHandler,
} from './barricade.types';
import { interceptor } from './interceptor';
import { createNativeXMLHttpRequest } from './xml-http-request';

export class Barricade {
  running = false;
  private readonly _originalRequestConfig: RequestConfigForLib[] = [];
  private _requestConfig: RequestConfigForLib[] = [];
  private _nativeXMLHttpRequest: typeof XMLHttpRequest;
  private _nativeFetch: RNFetch.fetch;
  private _nativeHeaders: RNFetch.Headers;
  private _nativeRequest: RNFetch.Request;
  private _nativeResponse: RNFetch.Response;

  constructor(requestConfig: RequestConfig[]) {
    this.initRequestConfig(requestConfig);
    this._originalRequestConfig = ObjectUtils.cloneDeep(this.requestConfig);
    this._nativeXMLHttpRequest = global.XMLHttpRequest;
    this._nativeFetch = global.fetch;
    this._nativeHeaders = global.Headers;
    this._nativeRequest = global.Request;
    this._nativeResponse = global.Response;
  }

  set requestConfig(value: RequestConfigForLib[]) {
    this._requestConfig = value;
  }

  get requestConfig() {
    return this._requestConfig;
  }

  handleRequest(request: Request) {
    const method = request._method.toUpperCase() as Method;
    const requestUrl = request._url;
    const parsedRequestUrl = UrlUtils.parseURL(requestUrl);
    request.params = parsedRequestUrl.params;

    const requestConfig = this._requestConfig.find(item => {
      if (
        item.method !== method ||
        !requestUrl.includes(item.pathEvaluation.path)
      ) {
        return;
      } else if (item.pathEvaluation?.type === PathEvaluationType.Includes) {
        return true;
      } else if (item.pathEvaluation?.type === PathEvaluationType.Suffix) {
        return requestUrl.endsWith(item.pathEvaluation.path);
      } else {
        return (item.pathEvaluation as PathEvaluationCallback).callback(
          request,
        );
      }
    });

    if (requestConfig) {
      try {
        const result = (
          requestConfig.responseHandler.find(item => !!item.isSelected) ??
          requestConfig.responseHandler[0]
        ).handler(request);
        if (
          result &&
          typeof (result as PromiseLike<ResponseData>)?.then === 'function'
        ) {
          (result as PromiseLike<ResponseData>).then(resolvedResult => {
            this.resolveRequest(request, resolvedResult, requestConfig.delay);
          });
        } else {
          this.resolveRequest(
            request,
            result as ResponseData,
            requestConfig.delay,
          );
        }
      } catch (error) {
        throw `Barricade intercepted ${requestUrl}(${method}) API and threw an error - ${
          (error as Error).message
        }.`;
      }
    } else {
      createNativeXMLHttpRequest(request, this._nativeXMLHttpRequest);
    }
  }

  resetRequestConfig() {
    this._requestConfig = ObjectUtils.cloneDeep(this._originalRequestConfig);
  }

  private resolveRequest(
    request: Request,
    responseData: ResponseData,
    delay = 400,
  ) {
    let response = responseData.response;
    if (request.responseType === 'blob') {
      // @ts-ignore
      response = (responseData.response as Blob)._data;
    }
    setTimeout(() => {
      request.setResponseData(
        responseData.status,
        responseData.headers,
        response,
      );
    }, delay);
  }

  start() {
    global.XMLHttpRequest = interceptor(this) as any;
    global.fetch = RNFetch.fetch;
    global.Headers = RNFetch.Headers;
    global.Request = RNFetch.Request;
    global.Response = RNFetch.Response;
    this.running = true;
  }

  shutdown() {
    global.XMLHttpRequest = this._nativeXMLHttpRequest;
    global.fetch = this._nativeFetch;
    global.Headers = this._nativeHeaders;
    global.Request = this._nativeRequest;
    global.Response = this._nativeResponse;
    this.running = false;
  }

  initRequestConfig(requests: RequestConfig[]) {
    const updatedRequestConfig = requests.map<RequestConfig>(request => {
      let selectedItem: ResponseHandler | undefined;
      for (let i = 0; i < request.responseHandler.length; i++) {
        if (selectedItem) {
          request.responseHandler[i].isSelected = false;
        } else if (request.responseHandler[i].isSelected) {
          selectedItem = request.responseHandler[i];
        } else if (i === request.responseHandler.length - 1) {
          request.responseHandler[i].isSelected = false;
          request.responseHandler[0].isSelected = true;
          selectedItem = request.responseHandler[0];
        } else {
          request.responseHandler[i].isSelected = false;
        }
      }
      const result = request as RequestConfigForLib;
      result.selectedResponseLabel = selectedItem!.label;

      return result;
    });

    this.requestConfig = updatedRequestConfig;
  }
}
