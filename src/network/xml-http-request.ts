import { MockedRequest } from './barricade.types';
import { HttpStatusCodeText } from './http-codes';

export function createNativeXMLHttpRequest(
  data: string,
  request: MockedRequest,
  nativeXMLHttpRequest: typeof XMLHttpRequest,
) {
  const xhr = new nativeXMLHttpRequest();

  const setResponseData = () => {
    request.setResponseData(
      xhr.status as keyof typeof HttpStatusCodeText,
      //@ts-ignore
      xhr._headers ?? {},
      //@ts-ignore
      xhr._response,
    );
  };

  xhr.onload = function () {
    setResponseData();
  };

  xhr.onerror = function () {
    //@ts-ignore
    request._hasError = xhr._hasError;
    setResponseData();
  };

  xhr.ontimeout = function () {
    //@ts-ignore
    request._hasError = xhr._hasError;
    //@ts-ignore
    request._timedOut = xhr._timedOut;
    setResponseData();
  };

  xhr.onabort = function () {
    request.abort();
  };

  xhr.onreadystatechange = function () {};

  xhr.open(request._method, request._url, true);

  xhr.responseType = request.responseType;
  xhr.timeout = request.timeout ?? 0;
  xhr.withCredentials = request.withCredentials;
  for (let h in request._headers) {
    xhr.setRequestHeader(h, request._headers[h]);
  }

  xhr.send(data);
}
