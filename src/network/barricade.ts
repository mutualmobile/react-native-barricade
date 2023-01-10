//@ts-ignore
import * as RNFetch from 'react-native/Libraries/Network/fetch';

import {
  Method,
  MockedRequest,
  PathEvaluaionType,
  PathEvaluationCallback,
  RequestConfig,
  RequestConfigForLib,
  ResponseData,
} from './barricade.types';
import { interceptor } from './interceptor';
import { UrlUtils } from './url.utils';
import { createNativeXMLHttpRequest } from './xml-http-request';

export class Barricade {
  running = false;
  private _requestConfig: RequestConfigForLib[] = [];
  private _nativeXMLHttpRequest: typeof XMLHttpRequest;
  private _nativeFetch: RNFetch.fetch;
  private _nativeHeaders: RNFetch.Headers;
  private _nativeRequest: RNFetch.Request;
  private _nativeResponse: RNFetch.Response;

  constructor(requestConfig: RequestConfig[]) {
    this.updateRequestConfig(requestConfig);
    this._nativeXMLHttpRequest = global.XMLHttpRequest;
    this._nativeFetch = global.fetch;
    this._nativeHeaders = global.Headers;
    this._nativeRequest = global.Request;
    this._nativeResponse = global.Response;
  }

  get requestConfig() {
    return this._requestConfig;
  }

  handleRequest(request: MockedRequest) {
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
      } else if (item.pathEvaluation?.type === PathEvaluaionType.Includes) {
        return true;
      } else if (item.pathEvaluation?.type === PathEvaluaionType.Suffix) {
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
    const requests = this._requestConfig.map<RequestConfigForLib>(request => {
      if (!request.responseHandler[0].isSelected) {
        request.responseHandler[0].isSelected = true;
        for (let i = 1; i < request.responseHandler?.length; i++) {
          request.responseHandler[i].isSelected = false;
        }
      }

      const result = request as RequestConfigForLib;
      result.selectedResponseLabel = request.responseHandler[0].label;

      return result;
    });
    this._requestConfig = requests;
  }

  private resolveRequest(
    request: MockedRequest,
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
    if (__DEV__) {
      global.XMLHttpRequest = interceptor(this) as any;
      global.fetch = RNFetch.fetch;
      global.Headers = RNFetch.Headers;
      global.Request = RNFetch.Request;
      global.Response = RNFetch.Response;
      this.running = true;
    }
  }

  shutdown() {
    global.XMLHttpRequest = this._nativeXMLHttpRequest;
    global.fetch = this._nativeFetch;
    global.Headers = this._nativeHeaders;
    global.Request = this._nativeRequest;
    global.Response = this._nativeResponse;
    this.running = false;
  }

  updateRequestConfig(requests: RequestConfigForLib[]) {
    const updatedRequestConfig = requests.map<RequestConfigForLib>(request => {
      let selectedItem = request.responseHandler.find(
        item => !!item.isSelected,
      );
      if (!selectedItem) {
        request.responseHandler[0].isSelected = true;
        selectedItem = request.responseHandler[0];
      }

      const result = request as RequestConfigForLib;
      result.selectedResponseLabel = selectedItem.label;

      return result;
    });
    this._requestConfig = updatedRequestConfig;
  }
}
