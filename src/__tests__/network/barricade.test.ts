jest.useFakeTimers();

import { HttpStatusCode } from '../../network/http-codes';
import {
  asyncResponseApiConfig,
  errorResponseApiConfig,
  firstApiConfig,
  secondApiConfig,
  thirdApiConfig,
} from '../data/barricade-test-data';
import {
  errorResponse,
  getCustomMockApiRequest,
  mockApiRequest,
  successResponse,
} from '../data/request-test-data';

test('given that an instance of Barricade is created, should format and set requestConfig', () => {
  const firstConfig = {
    ...firstApiConfig,
    responseHandler: [
      { label: 'Success', handler: jest.fn() },
      { label: 'Error', handler: jest.fn() },
    ],
  };
  const secondConfig = {
    ...secondApiConfig,
    responseHandler: [
      { label: 'Success', handler: jest.fn() },
      { label: 'Error', isSelected: true, handler: jest.fn() },
    ],
  };
  const formattedFirstConfig = {
    ...firstApiConfig,
    selectedResponseLabel: 'Success',
    responseHandler: [
      { label: 'Success', isSelected: true, handler: jest.fn() },
      { label: 'Error', isSelected: false, handler: jest.fn() },
    ],
  };
  const formattedSeconfConfig = {
    ...secondApiConfig,
    selectedResponseLabel: 'Error',
    responseHandler: [
      { label: 'Success', isSelected: false, handler: jest.fn() },
      { label: 'Error', isSelected: true, handler: jest.fn() },
    ],
  };

  const Barricade = require('../../network/barricade');
  const barricade = new Barricade.Barricade([firstConfig, secondConfig]);

  expect(JSON.stringify(barricade.requestConfig)).toEqual(
    JSON.stringify([formattedFirstConfig, formattedSeconfConfig]),
  );

  expect.assertions(1);
});

describe('given that start function is called,', () => {
  let barricade;
  afterEach(() => {
    jest.clearAllMocks();
    barricade.shutdown();
  });
  test('should set global XMLHttpRequest', () => {
    jest.resetModules();
    const mockInterceptor = jest.fn();
    jest.mock('../../network/interceptor', () => {
      return {
        interceptor: jest.fn(() => mockInterceptor),
      };
    });
    const Barricade = require('../../network/barricade');
    barricade = new Barricade.Barricade([
      firstApiConfig,
      secondApiConfig,
      thirdApiConfig,
    ]);

    barricade.start();

    expect(global.XMLHttpRequest).toBe(mockInterceptor);
    expect.assertions(1);
  });

  test('should set global fetch functions', () => {
    jest.resetModules();
    const mockFetch = jest.fn(),
      mockHeaders = jest.fn(),
      mockRequest = jest.fn(),
      mockResponse = jest.fn();
    jest.mock('react-native/Libraries/Network/fetch', () => {
      return {
        fetch: mockFetch,
        Headers: mockHeaders,
        Request: mockRequest,
        Response: mockResponse,
      };
    });

    const Barricade = require('../../network/barricade');
    barricade = new Barricade.Barricade([
      firstApiConfig,
      secondApiConfig,
      thirdApiConfig,
    ]);

    barricade.start();

    expect(global.fetch).toBe(mockFetch);
    expect(global.Headers).toBe(mockHeaders);
    expect(global.Request).toBe(mockRequest);
    expect(global.Response).toBe(mockResponse);
    expect.assertions(4);
  });

  test('should set running to true', () => {
    const Barricade = require('../../network/barricade');
    barricade = new Barricade.Barricade([
      firstApiConfig,
      secondApiConfig,
      thirdApiConfig,
    ]);

    barricade.start();

    expect(barricade.running).toBe(true);
    expect.assertions(1);
  });
});

describe('given that shutdown function is called,', () => {
  test('should reset global XMLHttpRequest', () => {
    jest.resetModules();
    const mockInterceptor = jest.fn();
    jest.mock('../../network/interceptor', () => {
      return {
        interceptor: jest.fn(() => mockInterceptor),
      };
    });
    const Barricade = require('../../network/barricade');
    const barricade = new Barricade.Barricade([
      firstApiConfig,
      secondApiConfig,
      thirdApiConfig,
    ]);

    barricade.start();
    barricade.shutdown();

    expect(global.XMLHttpRequest).toBe(barricade._nativeXMLHttpRequest);
    expect.assertions(1);
  });

  test('should reset global fetch functions', () => {
    jest.resetModules();
    const mockFetch = jest.fn(),
      mockHeaders = jest.fn(),
      mockRequest = jest.fn(),
      mockResponse = jest.fn();
    jest.mock('react-native/Libraries/Network/fetch', () => {
      return {
        fetch: mockFetch,
        Headers: mockHeaders,
        Request: mockRequest,
        Response: mockResponse,
      };
    });

    const Barricade = require('../../network/barricade');
    const barricade = new Barricade.Barricade([
      firstApiConfig,
      secondApiConfig,
      thirdApiConfig,
    ]);

    barricade.start();
    barricade.shutdown();

    expect(global.fetch).toBe(barricade._nativeFetch);
    expect(global.Headers).toBe(barricade._nativeHeaders);
    expect(global.Request).toBe(barricade._nativeRequest);
    expect(global.Response).toBe(barricade._nativeResponse);
    expect.assertions(4);
  });

  test('should set running to false', () => {
    const Barricade = require('../../network/barricade');
    const barricade = new Barricade.Barricade([
      firstApiConfig,
      secondApiConfig,
      thirdApiConfig,
    ]);

    barricade.start();
    barricade.shutdown();

    expect(barricade.running).toBe(false);
    expect.assertions(1);
  });
});

test('given that inital requestConfig was updated, should reset requestConfig, when resetRequestConfig is called', () => {
  const firstConfig = {
    ...firstApiConfig,
    responseHandler: [
      { label: 'Success', handler: jest.fn() },
      { label: 'Error', handler: jest.fn() },
    ],
  };
  const secondConfig = {
    ...secondApiConfig,
    responseHandler: [
      { label: 'Success', handler: jest.fn() },
      { label: 'Error', isSelected: true, handler: jest.fn() },
    ],
  };
  const formattedFirstConfig = {
    ...firstApiConfig,
    selectedResponseLabel: 'Success',
    responseHandler: [
      { label: 'Success', isSelected: true, handler: jest.fn() },
      { label: 'Error', isSelected: false, handler: jest.fn() },
    ],
  };
  const formattedSeconfConfig = {
    ...secondApiConfig,
    selectedResponseLabel: 'Error',
    responseHandler: [
      { label: 'Success', isSelected: false, handler: jest.fn() },
      { label: 'Error', isSelected: true, handler: jest.fn() },
    ],
  };

  const Barricade = require('../../network/barricade');
  const barricade = new Barricade.Barricade([firstConfig, secondConfig]);

  // Update requestConfig
  barricade.requestConfig[1].selectedResponseLabel = 'Success';
  barricade.requestConfig[1].responseHandler[0].isSelected = true;
  barricade.requestConfig[1].responseHandler[1].isSelected = false;

  barricade.resetRequestConfig();

  expect(JSON.stringify(barricade.requestConfig)).toEqual(
    JSON.stringify([formattedFirstConfig, formattedSeconfConfig]),
  );
  expect.assertions(1);
});

describe('given that barricade was started and handleRequest is called,', () => {
  let barricade;
  const mockCreateNativeXMLHttpRequest = jest.fn();
  beforeEach(() => {
    jest.resetModules();
    const Barricade = require('../../network/barricade');
    barricade = new Barricade.Barricade([
      firstApiConfig,
      secondApiConfig,
      thirdApiConfig,
    ]);
    barricade.handleNativeXMLHttpRequest = mockCreateNativeXMLHttpRequest;

    barricade.start();
  });

  afterEach(() => {
    jest.clearAllMocks();
    barricade.shutdown();
  });

  test('when an API which is not in requestConfig is triggered, should trigger API with nativeXMLHttpRequest', () => {
    barricade.handleRequest(mockApiRequest);

    expect(mockCreateNativeXMLHttpRequest).toHaveBeenCalledWith(mockApiRequest);
    expect.assertions(1);
  });

  describe('when a mocked API with PathEvaluationType=Suffix', () => {
    test('and triggered API matches the evaluation, should return mocked API response', () => {
      const request = getCustomMockApiRequest({
        _method: firstApiConfig.method,
        _url: firstApiConfig.pathEvaluation.path,
      });
      barricade.resolveRequest = jest.fn();
      barricade.handleRequest(request);

      expect(mockCreateNativeXMLHttpRequest).not.toHaveBeenCalled();
      expect(barricade.resolveRequest).toHaveBeenCalledWith(
        request,
        successResponse,
        2000,
      );
      expect.assertions(2);
    });

    test('and triggered API does not match the evaluation, should trigger actual API call', () => {
      const request = getCustomMockApiRequest({
        _method: firstApiConfig.method,
        _url: firstApiConfig.pathEvaluation.path + '?limit=10',
      });
      barricade.resolveRequest = jest.fn();
      barricade.handleRequest(request);

      expect(mockCreateNativeXMLHttpRequest).toHaveBeenCalledWith(request);
      expect(barricade.resolveRequest).not.toHaveBeenCalled();
      expect.assertions(2);
    });
  });

  describe('when a mocked API with PathEvaluationType=Includes', () => {
    test('and triggered API matches the evaluation, should return mocked API response', () => {
      const request = getCustomMockApiRequest({
        _method: secondApiConfig.method,
        _url: secondApiConfig.pathEvaluation.path,
      });
      barricade.resolveRequest = jest.fn();
      barricade.handleRequest(request);

      expect(mockCreateNativeXMLHttpRequest).not.toHaveBeenCalled();
      expect(barricade.resolveRequest).toHaveBeenCalledWith(
        request,
        errorResponse,
        undefined,
      );
      expect.assertions(2);
    });

    test('and triggered API does not match the evaluation, should trigger actual API call', () => {
      const request = getCustomMockApiRequest({
        _method: secondApiConfig.method,
        _url: 'some/other/api',
      });
      barricade.resolveRequest = jest.fn();
      barricade.handleRequest(request);

      expect(mockCreateNativeXMLHttpRequest).toHaveBeenCalledWith(request);
      expect(barricade.resolveRequest).not.toHaveBeenCalled();
      expect.assertions(2);
    });
  });

  describe('when a mocked API with PathEvaluationType=Callback', () => {
    test('and triggered API matches the evaluation, should return mocked API response', () => {
      const request = getCustomMockApiRequest({
        _method: thirdApiConfig.method,
        _url: thirdApiConfig.pathEvaluation.path,
        _headers: {
          ...mockApiRequest._headers,
          'custom-header': 'true',
        },
      });
      barricade.resolveRequest = jest.fn();
      barricade.handleRequest(request);

      expect(mockCreateNativeXMLHttpRequest).not.toHaveBeenCalled();
      expect(barricade.resolveRequest).toHaveBeenCalledWith(
        request,
        successResponse,
        undefined,
      );
      expect.assertions(2);
    });

    test('and triggered API does not match the evaluation, should trigger actual API call', () => {
      const request = getCustomMockApiRequest({
        _method: thirdApiConfig.method,
        _url: thirdApiConfig.pathEvaluation.path,
        _headers: {
          ...mockApiRequest._headers,
          'custom-header': 'false',
        },
      });
      barricade.resolveRequest = jest.fn();
      barricade.handleRequest(request);

      expect(mockCreateNativeXMLHttpRequest).toHaveBeenCalledWith(request);
      expect(barricade.resolveRequest).not.toHaveBeenCalled();
      expect.assertions(2);
    });
  });

  test('when a mocked API with no selected response handler is called, should return first response', async () => {
    const request = getCustomMockApiRequest({
      _method: firstApiConfig.method,
      _url: firstApiConfig.pathEvaluation.path,
    });

    // delete all the isSelected keys
    delete barricade.requestConfig[0].responseHandler[0].isSelected;
    delete barricade.requestConfig[0].responseHandler[1].isSelected;

    barricade.resolveRequest = jest.fn();
    barricade.handleRequest(request);

    expect(mockCreateNativeXMLHttpRequest).not.toHaveBeenCalled();
    expect(barricade.resolveRequest).toHaveBeenCalledWith(
      request,
      successResponse,
      2000,
    );
    expect.assertions(2);
  });

  test('when a mocked API with async response handler is called, should return mocked response after completing the async call', async () => {
    const Barricade = require('../../network/barricade');
    barricade = new Barricade.Barricade([asyncResponseApiConfig]);

    barricade.start();

    const request = getCustomMockApiRequest({
      _method: asyncResponseApiConfig.method,
      _url: asyncResponseApiConfig.pathEvaluation.path,
    });
    barricade.resolveRequest = jest.fn();
    barricade.handleRequest(request);

    await jest.advanceTimersByTime(3000);

    expect(mockCreateNativeXMLHttpRequest).not.toHaveBeenCalled();
    expect(barricade.resolveRequest).toHaveBeenCalledWith(
      request,
      successResponse,
      undefined,
    );
    expect.assertions(2);
  });

  test('when a mocked API with error in response handler is called, should throw error', async () => {
    const Barricade = require('../../network/barricade');
    barricade = new Barricade.Barricade([errorResponseApiConfig]);

    barricade.start();

    const request = getCustomMockApiRequest({
      _method: errorResponseApiConfig.method,
      _url: errorResponseApiConfig.pathEvaluation.path,
    });
    barricade.handleRequest(request);

    await jest.advanceTimersByTime(3000);

    expect(mockCreateNativeXMLHttpRequest).not.toHaveBeenCalled();
    expect(barricade.handleMockedXMLHttpRequest).toThrow(
      new Error(
        `Barricade intercepted undefined(undefined) API and threw an error - Cannot read properties of undefined (reading 'responseHandler').`,
      ),
    );
    expect.assertions(2);
  });
});

describe('when resolveRequest is called', () => {
  let barricade;
  beforeEach(() => {
    jest.resetModules();
    const Barricade = require('../../network/barricade');
    barricade = new Barricade.Barricade([
      firstApiConfig,
      secondApiConfig,
      thirdApiConfig,
    ]);

    barricade.start();
  });

  afterEach(() => {
    jest.clearAllMocks();
    barricade.shutdown();
  });

  test.each`
    responseType
    ${''}
    ${'arraybuffer'}
    ${'blob'}
    ${'document'}
    ${'json'}
    ${'text'}
  `(
    'with request, responseData with $responseType, should set response data',
    ({ responseType }: { responseType: XMLHttpRequestResponseType }) => {
      const setResponseData = jest.fn();
      const request = getCustomMockApiRequest({
        responseType,
        setResponseData,
      });

      const response =
        responseType === 'blob'
          ? { ...successResponse, response: { _data: 'data' } }
          : successResponse;
      barricade.resolveRequest(request, response, undefined);

      jest.runAllTimers();

      expect(setResponseData).toHaveBeenCalledWith(
        response.status,
        response.headers,
        responseType === 'blob'
          ? (response.response as any)._data
          : response.response,
      );
      expect.assertions(1);
    },
  );
});

describe('given that handleNativeXMLHttpRequest is called,', () => {
  let barricade;
  beforeEach(() => {
    jest.resetModules();
    const Barricade = require('../../network/barricade');
    barricade = new Barricade.Barricade([
      firstApiConfig,
      secondApiConfig,
      thirdApiConfig,
    ]);

    barricade.start();
  });

  afterEach(() => {
    jest.clearAllMocks();
    barricade.shutdown();
  });

  test('should call open and send', () => {
    const open = jest.fn(
      (_method: string, _url: string, _async: boolean) => {},
    );
    const setRequestHeader = jest.fn();
    const send = jest.fn((_data?: any) => {});
    barricade._nativeXMLHttpRequest = jest.fn().mockImplementation(() => {
      return {
        responseType: '',
        timeout: 0,
        withCredentials: false,
        open,
        setRequestHeader,
        send,
      };
    });

    barricade.handleNativeXMLHttpRequest(mockApiRequest);

    expect(open).toHaveBeenCalledWith(
      mockApiRequest._method,
      mockApiRequest._url,
      true,
    );
    expect(setRequestHeader).toHaveBeenCalledWith(
      'accept',
      'application/json, text/plain, */*',
    );
    expect(setRequestHeader).toHaveBeenCalledWith('cache-control', 'no-cache');
    expect(send).toHaveBeenCalledWith(mockApiRequest._requestBody);
    expect.assertions(4);
  });

  test('should call setResponseData, when request returns data', () => {
    const _nativeXMLHttpRequest = jest.fn().mockImplementation(() => {
      return {
        status: 0,
        _headers: { 'content-type': 'application/json' },
        _response: '',
        onload: () => {},
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: function () {
          this.status = HttpStatusCode.OK;
          this._response = 'Data';
          this.responseURL = '/response/url';
          this.onload();
        },
      };
    });
    const setResponseData = jest.fn();
    const request = { ...mockApiRequest, timeout: undefined, setResponseData };
    barricade._nativeXMLHttpRequest = _nativeXMLHttpRequest;

    barricade.handleNativeXMLHttpRequest(request);

    expect(request.setResponseData).toHaveBeenCalledWith(
      HttpStatusCode.OK,
      { 'content-type': 'application/json' },
      'Data',
      '/response/url',
    );
    expect.assertions(1);
  });

  test('should call abort, when request has been aborted', () => {
    const _nativeXMLHttpRequest = jest.fn().mockImplementation(() => {
      return {
        onabort: () => {},
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: function () {
          this.onabort();
        },
      };
    });
    const abort = jest.fn();
    const request = { ...mockApiRequest, abort };
    barricade._nativeXMLHttpRequest = _nativeXMLHttpRequest;

    barricade.handleNativeXMLHttpRequest(request);

    expect(request.abort).toHaveBeenCalled();
    expect.assertions(1);
  });

  test('should set _hasError and call setResponseData, when request throws error', () => {
    const _nativeXMLHttpRequest = jest.fn().mockImplementation(() => {
      return {
        status: 0,
        _headers: { 'content-type': 'application/json' },
        _response: '',
        _hasError: false,
        onerror: () => {},
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: function () {
          this.status = HttpStatusCode.BAD_REQUEST;
          this._response = 'Bad Request';
          this._hasError = true;
          this.onerror();
        },
      };
    });
    const setResponseData = jest.fn();
    const request = { ...mockApiRequest, setResponseData };
    barricade._nativeXMLHttpRequest = _nativeXMLHttpRequest;

    barricade.handleNativeXMLHttpRequest(request);

    expect(request.setResponseData).toHaveBeenCalledWith(
      HttpStatusCode.BAD_REQUEST,
      { 'content-type': 'application/json' },
      'Bad Request',
      undefined,
    );
    expect(request._hasError).toBe(true);
    expect.assertions(2);
  });

  test('should set _hasError, _timeout and call setResponseData, when request timed out', () => {
    const _nativeXMLHttpRequest = jest.fn().mockImplementation(() => {
      return {
        status: 0,
        _response: '',
        _hasError: false,
        _timeout: false,
        ontimeout: () => {},
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: function () {
          this.status = HttpStatusCode.REQUEST_TIMEOUT;
          this._response = 'Request timedout';
          this._hasError = true;
          this._timedOut = true;
          this.ontimeout();
        },
      };
    });
    const setResponseData = jest.fn();
    const request = { ...mockApiRequest, setResponseData };
    barricade._nativeXMLHttpRequest = _nativeXMLHttpRequest;

    barricade.handleNativeXMLHttpRequest(request);

    expect(request.setResponseData).toHaveBeenCalledWith(
      HttpStatusCode.REQUEST_TIMEOUT,
      {},
      'Request timedout',
      undefined,
    );
    expect(request._hasError).toBe(true);
    expect(request._timedOut).toBe(true);
    expect.assertions(3);
  });

  test('should call onprogress, when request triggers incremental data', () => {
    const _nativeXMLHttpRequest = jest.fn().mockImplementation(() => {
      return {
        status: 0,
        _headers: { 'content-type': 'application/json' },
        _response: '',
        responseType: 'text',
        timeout: 60000,
        withCredentials: true,
        upload: {
          onprogress: () => {},
        },
        onload: () => {},
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: function () {
          this.upload.onprogress({ loaded: 50, total: 100 });
        },
      };
    });
    const _progress = jest.fn();
    const setResponseData = jest.fn();
    const request = { ...mockApiRequest, _progress, setResponseData };
    barricade._nativeXMLHttpRequest = _nativeXMLHttpRequest;

    barricade.handleNativeXMLHttpRequest(request);

    expect(request._progress).toHaveBeenCalledWith(true, 50, 100);
    expect.assertions(1);
  });
});
