// @ts-ignore
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
import { HttpStatusCodeText } from './http-codes';
import { interceptor } from './interceptor';

export class Barricade {
  /** Boolean that indicates whether the Barricade is enabled/disabled. */
  private _running = false;
  private _originalRequestConfig: RequestConfigForLib[] = [];
  private _requestConfig: RequestConfigForLib[] = [];
  private _nativeXMLHttpRequest: typeof XMLHttpRequest;
  private _nativeFetch: RNFetch.fetch;
  private _nativeHeaders: RNFetch.Headers;
  private _nativeRequest: RNFetch.Request;
  private _nativeResponse: RNFetch.Response;

  constructor(requestConfig?: RequestConfig[]) {
    this.initRequestConfig(requestConfig);

    this._nativeXMLHttpRequest = global.XMLHttpRequest;
    this._nativeFetch = global.fetch;
    this._nativeHeaders = global.Headers;
    this._nativeRequest = global.Request;
    this._nativeResponse = global.Response;
  }

  /** Gets the registered RequestConfig with selected response data */
  get requestConfig() {
    return this._requestConfig;
  }

  /** Boolean to identify if the Barricade is Enabled/Disabled */
  get running() {
    return this._running;
  }

  /**
   * Checks and finds if there is a RequestConfig with a mocked response for the current API call.
   * @param request Current API request made by the app.
   * @param method Current API's request Method.
   * @param url Current API's request URL.
   * @returns Returns **ReqestConfig** when the current API is registered for mocking and returns **undefined** when it is not registered for mocking.
   */
  private getCurrentRequestConfig(
    request: Request,
    method: Method,
    url: string,
  ) {
    const requestConfig = this._requestConfig.find(item => {
      if (item.method !== method || !url.includes(item.pathEvaluation.path)) {
        return;
      } else if (item.pathEvaluation?.type === PathEvaluationType.Includes) {
        return true;
      } else if (item.pathEvaluation?.type === PathEvaluationType.Suffix) {
        return url.endsWith(item.pathEvaluation.path);
      } else {
        return (item.pathEvaluation as PathEvaluationCallback).callback(
          request,
        );
      }
    });

    return requestConfig;
  }

  /**
   * Loops through the responseHandler for a RequestConfig and sets the data regrding the selected response for the request.
   * By default the first item in the list is selected.
   * @param request RequestConfig
   * @returns formatted RequestConfigForLib
   */
  private getRequestConfigForLib(request: RequestConfig) {
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
    result.selectedResponseLabel = selectedItem?.label;

    return result;
  }

  /**
   * Formats the RequestConfig[] to RequestConfigForLib[] and sets it to _requestConfig
   * @param requests Optional Array of RequestConfigs passed to be registered while creating an instance of Barricade.
   */
  private initRequestConfig(requests?: RequestConfig[]) {
    if (requests?.length) {
      const updatedRequestConfig = requests.map<RequestConfig>(
        this.getRequestConfigForLib,
      );

      this._requestConfig = updatedRequestConfig;
      this._originalRequestConfig = ObjectUtils.cloneDeep(this.requestConfig);
    }
  }

  /**
   * This method is called whenever an API request is sent and it will handle the request with mocked/actual response.
   *
   * **WARNING:** Do not use this method as its only for the barricade's internal purpose.
   * @param request Current API request made by the app.
   */
  handleRequest(request: Request) {
    const method = request._method.toUpperCase() as Method;
    const requestUrl = request._url;
    const parsedRequestUrl = UrlUtils.parseURL(requestUrl);
    request.params = parsedRequestUrl.params;

    const requestConfig = this.getCurrentRequestConfig(
      request,
      method,
      requestUrl,
    );

    if (requestConfig && !requestConfig.disabled) {
      this.handleMockedXMLHttpRequest(
        request,
        requestConfig,
        method,
        requestUrl,
      );
    } else {
      this.handleNativeXMLHttpRequest(request);
    }
  }

  /**
   * Handles the current API request with the selected mocked response.
   * @param request Current API request made by the app.
   * @param requestConfig RequestConfig containing the mocked response.
   * @param method Current API's request Method.
   * @param url Current API's request URL.
   */
  private handleMockedXMLHttpRequest(
    request: Request,
    requestConfig: RequestConfigForLib,
    method: Method,
    url: string,
  ) {
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
      throw `Barricade intercepted ${url}(${method}) API and threw an error - ${
        (error as Error).message
      }.`;
    }
  }

  /**
   * Handles the current API request with an actual API call by making use of _nativeXMLHttpRequest
   * @param request Current API request made by the app.
   */
  private handleNativeXMLHttpRequest(request: Request) {
    const xhr = new this._nativeXMLHttpRequest();

    const setResponseData = () => {
      request.setResponseData(
        xhr.status as keyof typeof HttpStatusCodeText,
        // @ts-ignore
        xhr._headers ?? {},
        // @ts-ignore
        xhr._response,
        xhr.responseURL,
      );
    };

    xhr.onload = function () {
      setResponseData();
    };

    xhr.onerror = function () {
      // @ts-ignore
      request._hasError = xhr._hasError;
      setResponseData();
    };

    xhr.ontimeout = function () {
      // @ts-ignore
      request._hasError = xhr._hasError;
      // @ts-ignore
      request._timedOut = xhr._timedOut;
      setResponseData();
    };

    xhr.onabort = function () {
      request.abort();
    };

    if (xhr.upload) {
      xhr.upload.onprogress = function ({
        loaded,
        total,
      }: {
        loaded: number;
        total: number;
      }) {
        request._progress(total >= 0, loaded, total);
      };
    }

    xhr.open(request._method, request._url, true);

    xhr.responseType = request.responseType;
    xhr.timeout = request.timeout ?? 0;
    xhr.withCredentials = request.withCredentials;
    for (const h in request._headers) {
      xhr.setRequestHeader(h, request._headers[h]);
    }

    // Use _requestBody and not parsed requestBody
    xhr.send(request._requestBody);
  }

  /**
   * Registers an API to be mocked by Barricade.
   * @param request RequestConfig data of an API call that needs to be registered for mocking.
   */
  registerRequest(request: RequestConfig) {
    const updatedRequestConfig = this.getRequestConfigForLib(request);

    this.requestConfig.push(updatedRequestConfig);
    this._originalRequestConfig.push(
      ObjectUtils.cloneDeep(updatedRequestConfig),
    );
  }

  /**
   * Resets selected responses for all the registered request config to its default value.
   */
  resetRequestConfig() {
    this._requestConfig = ObjectUtils.cloneDeep(this._originalRequestConfig);
  }

  /**
   *
   * @param request Current API request made by the app
   * @param responseData Mocked response that was selected for this API
   * @param delay Time(in milliseconds) barricade needs to wait before responding with the mocked response
   */
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

  /**
   * Barricade starts intercepting all the API calls and mocking the registered requests in __DEV__ mode.
   */
  start() {
    if (__DEV__) {
      global.XMLHttpRequest = interceptor(this) as any;
      global.fetch = RNFetch.fetch;
      global.Headers = RNFetch.Headers;
      global.Request = RNFetch.Request;
      global.Response = RNFetch.Response;
      this._running = true;
    }
  }

  /**
   * Barricade stops intercepting all the API calls and mocking the registered requests in __DEV__ mode.
   */
  shutdown() {
    if (this._running) {
      global.XMLHttpRequest = this._nativeXMLHttpRequest;
      global.fetch = this._nativeFetch;
      global.Headers = this._nativeHeaders;
      global.Request = this._nativeRequest;
      global.Response = this._nativeResponse;
      this._running = false;
    }
  }

  /**
   * Unregisters an API from being mocked by Barricade.
   * @param request RequestConfig data of an API call that needs to be registered for mocking.
   */
  unregisterRequest(request: RequestConfig) {
    const index = this.requestConfig.findIndex(
      item => item.label === request.label && item.method === request.method,
    );

    if (index > -1) {
      this.requestConfig.splice(index, 1);
      this._originalRequestConfig.splice(index, 1);
    }
  }
}
