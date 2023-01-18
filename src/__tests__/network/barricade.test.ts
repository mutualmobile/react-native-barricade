jest.useFakeTimers();

import {
  firstApiConfig,
  formattedFirstApiConfig,
  formattedSecondApiConfig,
  formattedThirdApiConfig,
  secondApiConfig,
  thirdApiConfig,
} from '../data/barricade-test-data';
import { request } from '../data/request-test-data';

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

  test(' should set global fetch functions', () => {
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
    jest.mock('../../network/xml-http-request', () => {
      return {
        createNativeXMLHttpRequest: mockCreateNativeXMLHttpRequest,
      };
    });
    const Barricade = require('../../network/barricade');
    barricade = new Barricade.Barricade([
      firstApiConfig,
      secondApiConfig,
      thirdApiConfig,
    ]);

    barricade.start();
  });

  afterEach(() => {
    barricade.shutdown();
  });

  test('when an API which is not in requestConfig is triggered, should trigger API with nativeXMLHttpRequest', () => {
    barricade.handleRequest(request);

    expect(mockCreateNativeXMLHttpRequest).toHaveBeenCalledWith(
      request,
      barricade._nativeXMLHttpRequest,
    );
    expect.assertions(1);
  });
});
