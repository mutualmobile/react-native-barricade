import {
  Method,
  MockedRequest,
  PathEvaluaionType,
  PathEvaluationClosure,
  RequestConfig,
  RequestConfigForMethod,
  RequestReferences,
  ResponseData,
  ResponseHandler,
} from './barricade.types';
import { interceptor } from './interceptor';
import { UrlUtils } from './url.utils';

export class Barricade {
  baseUrl: string;
  handlers: ResponseHandler[] = [];
  requestReferences: RequestReferences = {} as RequestReferences;
  running = false;
  private _nativeXMLHttpRequest: typeof XMLHttpRequest;

  constructor(baseUrl: string, requests: RequestConfig[]) {
    this._nativeXMLHttpRequest = global.XMLHttpRequest;

    global.XMLHttpRequest = interceptor(this) as any; // TODO: check type here

    this.running = true;
    this.baseUrl = baseUrl;
    this.setRequests(requests);
  }

  setRequests(requests: Array<RequestConfig>) {
    requests.forEach(request => {
      const url = UrlUtils.parseURL(this.baseUrl + request.pathEvaluation.path);
      const requestReference =
        this.requestReferences[url.fullpath] ?? ({} as RequestConfigForMethod);
      requestReference[request.method] = request;

      this.requestReferences[url.fullpath] = requestReference;
    });
  }

  handleRequest(request: MockedRequest) {
    const method = request._method.toUpperCase() as Method;
    const path = request._url;

    const url = UrlUtils.parseURL(path);
    if (!this.baseUrl.includes(url.host)) return;

    // const requestConfig = this.requestReferences[url.pathname]?.[method];
    const requestConfigKey = Object.keys(this.requestReferences).find(item => {
      const result = this.requestReferences[item][method];
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
      ? this.requestReferences[requestConfigKey][method]
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

  resolveRequest(request: MockedRequest, response: ResponseData, delay = 400) {
    setTimeout(() => {
      request.respond(response.status, response.headers, response.response);
    }, delay);
  }

  shutdown() {
    global.XMLHttpRequest = this._nativeXMLHttpRequest;
    this.running = false;
  }
}
