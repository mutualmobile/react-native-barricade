import { createNativeXMLHttpRequest } from '../../network/xml-http-request';
import { request } from '../data/request-test-data';

const nativeXMLHttpRequest = global.XMLHttpRequest;
// var nativeXMLHttpRequest;

describe('given that createNativeXMLHttpRequest is called,', () => {
  test('should call open and send', () => {
    const open = jest.fn(
      (_method: string, _url: string, _async: boolean) => {},
    );
    const setRequestHeader = jest.fn();
    const send = jest.fn((_data?: any) => {});
    const _nativeXMLHttpRequest = jest.fn().mockImplementation(() => {
      return {
        responseType: '',
        timeout: 0,
        withCredentials: false,
        open,
        setRequestHeader,
        send,
      };
    });

    createNativeXMLHttpRequest(request, _nativeXMLHttpRequest);

    expect(open).toHaveBeenCalledWith(request._method, request._url, true);
    expect(setRequestHeader).toHaveBeenCalledWith(
      'accept',
      'application/json, text/plain, */*',
    );
    expect(setRequestHeader).toHaveBeenCalledWith('cache-control', 'no-cache');
    expect(send).toHaveBeenCalledWith(request._requestBody);
    expect.assertions(4);
  });

  test.skip('should call set error & timeout when request timeout', done => {
    const open = jest.fn(
      (_method: string, _url: string, _async: boolean) => {},
    );
    const setRequestHeader = jest.fn();
    const send = jest.fn((_data?: any) => {});
    const _nativeXMLHttpRequest = jest.fn().mockImplementation(() => {
      return {
        _hasError: false,
        _timeout: false,
        responseType: '',
        timeout: 0,
        withCredentials: false,
        ontimeout: function () {
          console.log('Test');
          this._hasError = true;
          this._timeout = true;
        },
        open,
        setRequestHeader,
        send,
      };
    });

    createNativeXMLHttpRequest(request, _nativeXMLHttpRequest);

    setTimeout(() => {
      // expect(request._hasError).toBe(true);
      expect(request._timedOut).toBe(true);

      expect.assertions(2);
      done();
    }, request.timeout);
  });

  test.skip('should set all the required callbacks', () => {
    const _nativeXMLHttpRequest = jest.fn().mockImplementation(() => {
      return {
        UNSENT: 0,
        OPENED: 1,
        HEADERS_RECEIVED: 2,
        LOADING: 3,
        DONE: 4,
        readyState: 0,
        response: '',
        responseText: '',
        responseURL: '',
        responseXML: null,
        status: 0,
        statusText: '',
        upload: new XMLHttpRequestUpload(),
        abort: jest.fn(),
        getAllResponseHeaders: jest.fn(),
        getResponseHeader: jest.fn(),
        overrideMimeType: jest.fn(),
        responseType: '',
        timeout: 0,
        withCredentials: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        onprogress: jest.fn(),
        dispatchEvent: jest.fn(),
        onloadend: jest.fn(),
        onloadstart: jest.fn(),
        onload: jest.fn(),
        onerror: jest.fn(),
        ontimeout: jest.fn(),
        onabort: jest.fn(),
        onreadystatechange: jest.fn(),
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: jest.fn(),
      } as XMLHttpRequest;
    });
    createNativeXMLHttpRequest(request, _nativeXMLHttpRequest);

    expect.assertions(1);
  });
});
