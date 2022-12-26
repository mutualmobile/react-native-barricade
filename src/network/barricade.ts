import {
  Method,
  MockedRequest,
  PathEvaluaionType,
  PathEvaluationClosure,
  RequestConfig,
  RequestConfigForLib,
  RequestConfigForMethod,
  RequestReferences,
  ResponseData,
} from './barricade.types';
import { interceptor } from './interceptor';
import { UrlUtils } from './url.utils';

export class Barricade {
  baseUrl: string;
  running = false;
  private _requestConfig: RequestConfigForLib[] = [];
  private _requestReferences: RequestReferences = {} as RequestReferences;
  private _nativeXMLHttpRequest: typeof XMLHttpRequest;

  constructor(baseUrl: string, requestConfig: RequestConfig[]) {
    this.baseUrl = baseUrl;
    this.updateRequestConfig(requestConfig);
    this._nativeXMLHttpRequest = global.XMLHttpRequest;
  }

  get requestConfig() {
    return this._requestConfig;
  }

  private setRequestReferences(requests: Array<RequestConfigForLib>) {
    requests.forEach(request => {
      const url = UrlUtils.parseURL(this.baseUrl + request.pathEvaluation.path);
      const requestReference =
        this._requestReferences[url.fullpath] ?? ({} as RequestConfigForMethod);
      requestReference[request.method] = request;

      this._requestReferences[url.fullpath] = requestReference;
    });
  }

  handleRequest(request: MockedRequest) {
    const method = request._method.toUpperCase() as Method;
    const path = request._url;

    const url = UrlUtils.parseURL(path);
    if (!this.baseUrl.includes(url.host)) return;

    const requestConfigKey = Object.keys(this._requestReferences).find(item => {
      const result = this._requestReferences[item][method];
      if (result?.pathEvaluation?.type === PathEvaluaionType.Includes) {
        return url.fullpath.includes(result.pathEvaluation.path);
      } else if (result?.pathEvaluation?.type === PathEvaluaionType.Suffix) {
        return url.pathname === result.pathEvaluation.path;
      } else {
        return (result.pathEvaluation as PathEvaluationClosure).callback(
          request,
        );
      }
    });

    const requestConfig = requestConfigKey
      ? this._requestReferences[requestConfigKey][method]
      : null;

    if (requestConfig) {
      try {
        request.params = url.params;
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
        throw `Barricade intercepted ${path}(${method}) API and threw an error - ${
          (error as Error).message
        }.`;
      }
    } else {
      throw `Barricade intercepted ${path}(${method}) API but no handler was defined for this.`;
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
    this.setRequestReferences(requests);
  }

  private resolveRequest(
    request: MockedRequest,
    response: ResponseData,
    delay = 400,
  ) {
    setTimeout(() => {
      request.respond(response.status, response.headers, response.response);
    }, delay);
  }

  start() {
    if (__DEV__) {
      global.XMLHttpRequest = interceptor(this) as any;
      this.running = true;
    }
  }

  shutdown() {
    global.XMLHttpRequest = this._nativeXMLHttpRequest;
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
    this.setRequestReferences(requests);
  }
}
