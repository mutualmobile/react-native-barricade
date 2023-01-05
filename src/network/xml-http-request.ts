import { MockedRequest } from './barricade.types';
import { HttpStatusCodeText } from './http-codes';

export function createNativeXMLHttpRequest(
  data: string,
  request: MockedRequest,
  nativeXMLHttpRequest: typeof XMLHttpRequest,
) {
  const xhr = new nativeXMLHttpRequest();

  xhr.onload = function () {
    const response =
      'response' in xhr && xhr.response ? xhr.response : xhr.responseText;
    setTimeout(function () {
      request.respond(
        xhr.status as keyof typeof HttpStatusCodeText,
        //@ts-ignore
        xhr._headers ?? {},
        response,
      );
    }, 0);
  };

  xhr.onerror = function () {
    setTimeout(function () {
      xhr.dispatchEvent(new Event('error'));
    }, 0);
  };

  xhr.ontimeout = function () {
    setTimeout(function () {
      xhr.dispatchEvent(new Event('timeout'));
    }, 0);
  };

  xhr.onabort = function () {
    setTimeout(function () {
      xhr.dispatchEvent(new Event('abort'));
    }, 0);
  };

  xhr.onreadystatechange = function () {
    // DONE (success or failure)
  };

  xhr.open(request._method, request._url, true);

  xhr.responseType = request.responseType;
  xhr.timeout = request.timeout ?? 0;
  xhr.withCredentials = request.withCredentials;
  for (let h in request._headers) {
    xhr.setRequestHeader(h, request._headers[h]);
  }

  xhr.send(data);
}
