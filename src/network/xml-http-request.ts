import { Request } from './barricade.types';
import { HttpStatusCodeText } from './http-codes';

export function createNativeXMLHttpRequest(
  request: Request,
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
      xhr.responseURL,
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

  xhr.onreadystatechange = function () {};

  xhr.open(request._method, request._url, true);

  xhr.responseType = request.responseType;
  xhr.timeout = request.timeout ?? 0;
  xhr.withCredentials = request.withCredentials;
  for (let h in request._headers) {
    xhr.setRequestHeader(h, request._headers[h]);
  }

  // Use _requestBody and not parsed requestBody
  xhr.send(request._requestBody);
}
