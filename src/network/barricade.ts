import {
  Method,
  MockedRequest,
  RequestConfig,
  RequestConfigForMethod,
  RequestReferences,
  ResponseData,
  ResponseHandler,
} from './barricade.types';
import { interceptor } from './interceptor';
import { UrlUtils } from './url.utils';

export class Barricade {
  handlers: ResponseHandler[] = [];
  requestReferences: RequestReferences = {} as RequestReferences;
  running = false;
  private _nativeXMLHttpRequest: typeof XMLHttpRequest;

  constructor(baseUrl: string, requests: RequestConfig[]) {
    this._nativeXMLHttpRequest = global.XMLHttpRequest;

    global.XMLHttpRequest = interceptor(this) as any; // TODO: check type here

    this.running = true;
    this.setRequests(baseUrl, requests);
  }

  setRequests(baseUrl: string, requests: Array<RequestConfig>) {
    requests.forEach(request => {
      const url = UrlUtils.parseURL(baseUrl + request.path);
      const requestReference =
        this.requestReferences[url.pathname] ?? ({} as RequestConfigForMethod);
      requestReference[request.method] = request;

      this.requestReferences[url.pathname] = requestReference;
    });
  }

  handleRequest(request: MockedRequest) {
    const method = request._method.toUpperCase() as Method;
    const path = request._url;

    const url = UrlUtils.parseURL(path);
    const requestConfig = this.requestReferences[url.pathname]?.[method];

    if (requestConfig) {
      try {
        const result = requestConfig.responseHandler(request);
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
      request.respond(...response);
    }, delay);
  }

  shutdown() {
    global.XMLHttpRequest = this._nativeXMLHttpRequest;
    this.running = false;
  }
}
