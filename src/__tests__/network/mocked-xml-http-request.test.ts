/**
 * @jest-environment jsdom
 */
jest.useFakeTimers();

import { EventSubscription } from 'react-native';

import { HttpStatusCode } from '../../network/http-codes';
import { MockedXMLHttpRequest } from '../../network/mocked-xml-http-request';
import {
  base64Response,
  mockApiRequest,
  successResponse,
} from '../data/request-test-data';

const BlobManager = require('react-native/Libraries/Blob/BlobManager');
const base64 = require('base64-js');
let xmlHttpRequest = new MockedXMLHttpRequest();

describe('MockedXMLHttpRequest,', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    xmlHttpRequest = new MockedXMLHttpRequest();
  });

  describe('given that an instance of MockedXMLHttpRequest was created,', () => {
    test('readyState is set to UNSENT', () => {
      expect(xmlHttpRequest.readyState).toBe(xmlHttpRequest.UNSENT);
      expect.assertions(1);
    });

    test('response is set to empty string', () => {
      expect(xmlHttpRequest.response).toBe('');
      expect.assertions(1);
    });

    test('responseHeaders is set to undefined', () => {
      expect(xmlHttpRequest.responseHeaders).toBe(undefined);
      expect.assertions(1);
    });

    test('responseType is set to empty string', () => {
      expect(xmlHttpRequest.responseType).toBe('');
      expect.assertions(1);
    });

    test('status is set to 0', () => {
      expect(xmlHttpRequest.status).toBe(0);
      expect.assertions(1);
    });

    test('_aborted is set to false', () => {
      expect(xmlHttpRequest._aborted).toBe(false);
      expect.assertions(1);
    });

    test('when setRequestHeader is called with key & value, should throw error', () => {
      expect(() =>
        xmlHttpRequest.setRequestHeader('Content-Type', 'application/json'),
      ).toThrow(new Error('Request has not been opened'));

      expect.assertions(1);
    });
  });

  describe('given that request is opened,', () => {
    beforeEach(() => {
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url, true);
    });

    test('request method is set', () => {
      expect(xmlHttpRequest._method).toBe('GET');

      expect.assertions(1);
    });

    test('request url is set', () => {
      expect(xmlHttpRequest._url).toBe(mockApiRequest._url);

      expect.assertions(1);
    });

    test('readyState is set to OPENED', () => {
      expect(xmlHttpRequest.readyState).toBe(xmlHttpRequest.OPENED);

      expect.assertions(1);
    });

    test('when a request is re opened, should throw error', () => {
      expect(() =>
        xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url, true),
      ).toThrow(new Error('Cannot open, already sending'));

      expect.assertions(1);
    });

    test('when a request is opened without url, should throw error', () => {
      xmlHttpRequest = new MockedXMLHttpRequest();
      expect(() => xmlHttpRequest.open(mockApiRequest._method, '')).toThrow(
        new Error('Cannot load an empty url'),
      );

      expect.assertions(1);
    });

    test('when setRequestHeader is called with key & value, then request header is set', () => {
      xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');

      expect(xmlHttpRequest._headers).toMatchObject({
        'content-type': 'application/json',
      });
      expect.assertions(1);
    });

    test('when request is opened with async as false, should throw error', () => {
      xmlHttpRequest = new MockedXMLHttpRequest();

      expect(() =>
        xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url, false),
      ).toThrow(new Error('Synchronous http requests are not supported'));
      expect.assertions(1);
    });

    test('when request is opened with async as undefined, should not throw error', () => {
      xmlHttpRequest = new MockedXMLHttpRequest();

      expect(() =>
        xmlHttpRequest.open(
          mockApiRequest._method,
          mockApiRequest._url,
          undefined,
        ),
      ).not.toThrow();
      expect.assertions(1);
    });
  });

  describe('given that request is opened and sent,', () => {
    beforeEach(() => {
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url, true);
    });

    test('when send is called without data, requestBody should be undefined', () => {
      xmlHttpRequest.send();

      expect(xmlHttpRequest.requestBody).toBe(undefined);
      expect.assertions(1);
    });

    test('when send is called with data, should set requestBody', () => {
      const requestBody = 'some data';

      xmlHttpRequest.send(requestBody);

      expect(xmlHttpRequest.requestBody).toBe(requestBody);
      expect.assertions(1);
    });

    test('should trigger loadstart event', () => {
      xmlHttpRequest.onloadstart = jest.fn();

      xmlHttpRequest.send();

      expect(xmlHttpRequest.onloadstart).toHaveBeenCalled();
      expect.assertions(1);
    });

    test('when a request is sent before opening, should throw error', () => {
      xmlHttpRequest = new MockedXMLHttpRequest();

      expect(() => xmlHttpRequest.send()).toThrow(
        new Error('Request has not been opened'),
      );
      expect.assertions(1);
    });

    test('when a request is re sent, should throw error', () => {
      xmlHttpRequest.send();

      expect(() => xmlHttpRequest.send()).toThrow(
        new Error('Request has already been sent'),
      );
      expect.assertions(1);
    });
  });

  describe('given that request was sent, when the request is aborted,', () => {
    beforeEach(() => {
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url, true);
      xmlHttpRequest.send();

      xmlHttpRequest.onabort = jest.fn();
      xmlHttpRequest.onloadend = jest.fn();
    });

    test('_aborted will be true', () => {
      xmlHttpRequest.abort();

      expect(xmlHttpRequest._aborted).toBe(true);
      expect.assertions(1);
    });

    test('readyState will be set to DONE', () => {
      const setReadyStateSpy = jest.spyOn(xmlHttpRequest, 'setReadyState');

      xmlHttpRequest.abort();

      expect(setReadyStateSpy).toHaveBeenCalledWith(xmlHttpRequest.DONE);
      expect.assertions(1);
    });

    test('will trigger onabort and onloadend callback', () => {
      xmlHttpRequest.abort();

      expect(xmlHttpRequest.onabort).toHaveBeenCalled();
      expect(xmlHttpRequest.onloadend).toHaveBeenCalled();
      expect.assertions(2);
    });
  });

  describe('given that request was opened, sent and then setResponseData is called,', () => {
    beforeEach(() => {
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url, true);
      xmlHttpRequest.send();
    });

    test('should set status', () => {
      expect(xmlHttpRequest.status).toBe(0);

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        successResponse.response,
      );

      expect(xmlHttpRequest.status).toBe(successResponse.status);
      expect.assertions(2);
    });

    test('should set statusText', () => {
      expect(xmlHttpRequest.statusText).toBe('');

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        successResponse.response,
      );

      expect(xmlHttpRequest.statusText).toBe('OK');
      expect.assertions(2);
    });

    test('when responseURL is passed in setResponseData, should set responseURL', () => {
      expect(xmlHttpRequest.responseURL).toBe(undefined);

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        successResponse.response,
        mockApiRequest._url,
      );

      expect(xmlHttpRequest.responseURL).toBe(mockApiRequest._url);
      expect.assertions(2);
    });

    test('when responseURL is not passed in setResponseData, should not set responseURL', () => {
      expect(xmlHttpRequest.responseURL).toBe(undefined);

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        successResponse.response,
      );

      expect(xmlHttpRequest.responseURL).toBe(undefined);
      expect.assertions(2);
    });

    test('should set response headers', () => {
      expect(xmlHttpRequest.getAllResponseHeaders()).toBe(null);

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        successResponse.response,
      );

      expect(xmlHttpRequest.getAllResponseHeaders()).toBe(
        `accept: application/json, text/plain, */*\r\ncontent-type: application/json\r\n`,
      );
      expect.assertions(2);
    });

    test('should set response', () => {
      expect(xmlHttpRequest.response).toBe('');

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        successResponse.response,
      );

      expect(xmlHttpRequest.response).toMatch(successResponse.response);
      expect.assertions(2);
    });

    test('should set readyState to DONE', () => {
      expect(xmlHttpRequest.readyState).toBe(xmlHttpRequest.OPENED);

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        successResponse.response,
      );

      expect(xmlHttpRequest.readyState).toBe(xmlHttpRequest.DONE);
      expect.assertions(2);
    });

    test('should trigger load and loadend', () => {
      xmlHttpRequest.onload = jest.fn();
      xmlHttpRequest.onloadend = jest.fn();

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        successResponse.response,
      );

      expect(xmlHttpRequest.onload).toHaveBeenCalled();
      expect(xmlHttpRequest.onloadend).toHaveBeenCalled();
      expect.assertions(2);
    });

    test('when response is set after readyState is Done, then should throw error', () => {
      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        successResponse.response,
      );

      expect(() =>
        xmlHttpRequest._setResponseBody(successResponse.response),
      ).toThrow(new Error('Request done'));

      expect.assertions(1);
    });

    test('when response is set before response headers are set, then should throw error', () => {
      expect(() =>
        xmlHttpRequest._setResponseBody(successResponse.response),
      ).toThrow(new Error('No headers received'));

      expect.assertions(1);
    });

    test('when responseType is text and response datatype is not string, then should throw error', done => {
      xmlHttpRequest = new MockedXMLHttpRequest();
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url);
      xmlHttpRequest.responseType = 'text';
      xmlHttpRequest.send();

      try {
        xmlHttpRequest.setResponseData(
          successResponse.status,
          successResponse.headers,
          { data: true } as any,
        );
      } catch (e) {
        expect(e.message).toBe(
          'Attempted to respond to fake XMLHttpRequest with [object Object], which is not a string.',
        );
        done();

        expect.assertions(1);
      }
    });

    test('when responseType is json and response datatype is not string, then should throw error', done => {
      xmlHttpRequest = new MockedXMLHttpRequest();
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url);
      xmlHttpRequest.responseType = 'json';
      xmlHttpRequest.send();

      try {
        xmlHttpRequest.setResponseData(
          successResponse.status,
          successResponse.headers,
          { data: true } as any,
        );
      } catch (e) {
        expect(e.message).toBe(
          'Attempted to respond to fake XMLHttpRequest with [object Object], which is not a string.',
        );
        done();

        expect.assertions(1);
      }
    });

    test.each`
      responseType
      ${''}
      ${'text'}
    `(
      'when responseType is $responseType, responseText should return value',
      ({ responseType }) => {
        xmlHttpRequest = new MockedXMLHttpRequest();
        xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url);
        xmlHttpRequest.responseType = responseType;
        xmlHttpRequest.send();

        xmlHttpRequest.setResponseData(
          successResponse.status,
          successResponse.headers,
          successResponse.response,
        );

        expect(xmlHttpRequest.responseText).toBe(successResponse.response);
        expect.assertions(1);
      },
    );

    test.each`
      responseType
      ${'arraybuffer'}
      ${'blob'}
      ${'document'}
      ${'json'}
    `(
      'when responseType is $responseType, responseText should throw error',
      ({ responseType }) => {
        xmlHttpRequest = new MockedXMLHttpRequest();
        xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url);
        xmlHttpRequest.responseType = responseType;
        xmlHttpRequest.send();

        xmlHttpRequest.setResponseData(
          successResponse.status,
          successResponse.headers,
          successResponse.response,
        );

        expect(() => xmlHttpRequest.responseText).toThrow(
          new Error(
            `The 'responseText' property is only available if 'responseType' is set to '' or 'text', but it is '${responseType}'.`,
          ),
        );
        expect.assertions(1);
      },
    );

    test('when responseType is not text, responseText should throw error', () => {
      xmlHttpRequest = new MockedXMLHttpRequest();
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url);
      xmlHttpRequest.responseType = 'json';
      xmlHttpRequest.send();

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        successResponse.response,
      );

      expect(() => xmlHttpRequest.responseText).toThrow(
        new Error(
          "The 'responseText' property is only available if 'responseType' is set to '' or 'text', but it is 'json'.",
        ),
      );
      expect.assertions(1);
    });

    test.each`
      readyStateName        | readyStateValue
      ${'UNSENT'}           | ${0}
      ${'OPENED'}           | ${1}
      ${'HEADERS_RECEIVED'} | ${2}
    `(
      'when responseType is text and readystate is $readyStateName, responseText should return empty string',
      ({ readyStateValue }) => {
        xmlHttpRequest = new MockedXMLHttpRequest();
        xmlHttpRequest.readyState = readyStateValue;
        xmlHttpRequest._response = 'data';

        expect(xmlHttpRequest.responseText).toBe('');
        expect.assertions(1);
      },
    );

    test.each`
      readyStateName | readyStateValue
      ${'LOADING'}   | ${3}
      ${'DONE'}      | ${4}
    `(
      'when responseType is text and readystate is $readyStateName, responseText should return response text',
      ({ readyStateValue }) => {
        xmlHttpRequest = new MockedXMLHttpRequest();
        xmlHttpRequest.readyState = readyStateValue;
        xmlHttpRequest._response = 'data';

        expect(xmlHttpRequest.responseText).toBe('data');
        expect.assertions(1);
      },
    );
  });

  describe('given that request is sent and response is received,', () => {
    test('when responseType is arraybuffer, should not get response', () => {
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url);
      xmlHttpRequest.responseType = 'arraybuffer';
      xmlHttpRequest.send();
      expect(xmlHttpRequest.response).toBe(null);

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        base64Response,
      );

      expect(xmlHttpRequest.response).toMatchObject(new ArrayBuffer(12));
      expect.assertions(2);
    });

    test('when responseType is arraybuffer and response is cached, should return cached response', () => {
      const spy = jest.spyOn(base64, 'toByteArray');
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url);
      xmlHttpRequest.responseType = 'arraybuffer';
      xmlHttpRequest.send();
      expect(xmlHttpRequest.response).toBe(null);

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        base64Response,
      );

      expect(xmlHttpRequest.response).toMatchObject(new ArrayBuffer(12));
      expect(xmlHttpRequest.response).toMatchObject(new ArrayBuffer(12));
      expect(spy).toHaveBeenCalledTimes(1);
      expect.assertions(4);
    });

    test('when responseType is blob and response is object, should get blob response', () => {
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url);
      xmlHttpRequest.responseType = 'blob';
      xmlHttpRequest.send();
      expect(xmlHttpRequest.response).toBe(null);

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        // eslint-disable-next-line no-undef
        new Blob([successResponse.response], {
          type: 'application/json',
        }),
      );

      expect(xmlHttpRequest.response).toMatchObject({
        _data: { __collector: null },
      });
      expect.assertions(2);
    });

    test('when responseType is blob and response is cached, should return cached response', () => {
      const spy = jest.spyOn(BlobManager, 'createFromOptions');
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url);
      xmlHttpRequest.responseType = 'blob';
      xmlHttpRequest.send();
      expect(xmlHttpRequest.response).toBe(null);

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        // eslint-disable-next-line no-undef
        new Blob([successResponse.response], {
          type: 'application/json',
        }),
      );

      expect(xmlHttpRequest.response).toMatchObject({
        _data: { __collector: null },
      });
      expect(xmlHttpRequest.response).toMatchObject({
        _data: { __collector: null },
      });
      expect(spy).toHaveBeenCalledTimes(1);
      expect.assertions(4);
    });

    test('when responseType is blob and response is empty string, should get empty blob response', () => {
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url);
      xmlHttpRequest.responseType = 'blob';
      xmlHttpRequest.send();
      expect(xmlHttpRequest.response).toBe(null);

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        '',
      );

      expect(xmlHttpRequest.response).toEqual(
        expect.objectContaining({
          _data: {
            __collector: null,
            blobId: expect.any(String),
            lastModified: expect.any(Number),
            offset: 0,
            size: 0,
            type: '',
          },
        }),
      );
      expect.assertions(2);
    });

    test('when responseType is blob and response is string, should throw error', () => {
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url);
      xmlHttpRequest.responseType = 'blob';
      xmlHttpRequest.send();
      expect(xmlHttpRequest.response).toBe(null);

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        successResponse.response,
      );

      expect(() => xmlHttpRequest.response).toThrow(
        new Error('Invalid response for blob: {"data":true}'),
      );
      expect.assertions(2);
    });

    test('when responseType is document, should not get response', () => {
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url);
      xmlHttpRequest.responseType = 'document';
      xmlHttpRequest.send();
      expect(xmlHttpRequest.response).toBe(null);

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        successResponse.response,
      );

      expect(xmlHttpRequest.response).toBe(null);
      expect.assertions(2);
    });

    test('when responseType is json, should get json response', () => {
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url);
      xmlHttpRequest.responseType = 'json';
      xmlHttpRequest.send();
      expect(xmlHttpRequest.response).toBe(null);

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        successResponse.response,
      );

      expect(xmlHttpRequest.response).toMatchObject({ data: true });
      expect.assertions(2);
    });

    test('when responseType is json and response is cached, should return cached response', () => {
      const spy = jest.spyOn(JSON, 'parse');
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url);
      xmlHttpRequest.responseType = 'json';
      xmlHttpRequest.send();
      expect(xmlHttpRequest.response).toBe(null);

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        successResponse.response,
      );

      expect(xmlHttpRequest.response).toMatchObject({ data: true });
      expect(xmlHttpRequest.response).toMatchObject({ data: true });
      expect(spy).toHaveBeenCalledTimes(1);
      expect.assertions(4);
    });

    test('when responseType is json and response is invalid, should return null', () => {
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url);
      xmlHttpRequest.responseType = 'json';
      xmlHttpRequest.send();
      expect(xmlHttpRequest.response).toBe(null);

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        'data',
      );

      expect(xmlHttpRequest.response).toBe(null);
      expect.assertions(2);
    });

    test('when responseType is text, should get text response', () => {
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url);
      xmlHttpRequest.responseType = 'text';
      xmlHttpRequest.send();
      expect(xmlHttpRequest.response).toBe('');

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        successResponse.response,
      );

      expect(xmlHttpRequest.response).toBe('{"data":true}');
      expect.assertions(2);
    });
  });

  describe('given that request was opened, sent and then request timedout,', () => {
    const headers = {
      'content-type': 'application/json',
    };
    const response = JSON.stringify({ message: 'Request timedout' });
    beforeEach(() => {
      xmlHttpRequest.ontimeout = jest.fn();
      xmlHttpRequest.onload = jest.fn();
      xmlHttpRequest.onloadend = jest.fn();

      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url, true);
      xmlHttpRequest.responseType = mockApiRequest._responseType;
      xmlHttpRequest.send();

      xmlHttpRequest._hasError = true;
      xmlHttpRequest._timedOut = true;

      xmlHttpRequest.setResponseData(
        HttpStatusCode.REQUEST_TIMEOUT,
        headers,
        response,
      );
    });

    test('should set status', () => {
      expect(xmlHttpRequest.status).toBe(HttpStatusCode.REQUEST_TIMEOUT);
      expect.assertions(1);
    });

    test('should set statusText', () => {
      expect(xmlHttpRequest.statusText).toBe('Request Timeout');
      expect.assertions(1);
    });

    test('should set responseURL, when responseURL is passed to setResponseData', () => {
      xmlHttpRequest.setResponseData(
        HttpStatusCode.REQUEST_TIMEOUT,
        headers,
        response,
        'responseUrl',
      );
      expect(xmlHttpRequest.responseURL).toBe('responseUrl');
      expect.assertions(1);
    });

    test('should not set responseURL, when responseURL is not passed to setResponseData', () => {
      expect(xmlHttpRequest.responseURL).toBe(undefined);
      expect.assertions(1);
    });

    test('should set response headers', () => {
      expect(xmlHttpRequest.getAllResponseHeaders()).toMatch(
        'content-type: application/json',
      );
      expect.assertions(1);
    });

    test('should not return response when responseType is text', () => {
      expect(xmlHttpRequest.response).toMatch('');
      expect.assertions(1);
    });

    test('should return response when responseType is json', () => {
      xmlHttpRequest = new MockedXMLHttpRequest();
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url, true);
      xmlHttpRequest.responseType = 'json';
      xmlHttpRequest.send();
      xmlHttpRequest.setResponseData(
        HttpStatusCode.REQUEST_TIMEOUT,
        headers,
        response,
      );

      expect(xmlHttpRequest.response).toMatchObject({
        message: 'Request timedout',
      });
      expect.assertions(1);
    });

    test('should set readyState to DONE', () => {
      expect(xmlHttpRequest.readyState).toBe(xmlHttpRequest.DONE);
      expect.assertions(1);
    });

    test('should trigger ontimeout and onloadend callbacks', () => {
      expect(xmlHttpRequest.ontimeout).toHaveBeenCalled();
      expect(xmlHttpRequest.onloadend).toHaveBeenCalled();
      expect.assertions(2);
    });
  });

  describe('given that request was opened, sent and then request threw error,', () => {
    const headers = {
      'content-type': 'application/json',
    };
    const response = JSON.stringify({ message: 'Request error' });
    beforeEach(() => {
      xmlHttpRequest.onerror = jest.fn();
      xmlHttpRequest.onload = jest.fn();
      xmlHttpRequest.onloadend = jest.fn();

      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url, true);
      xmlHttpRequest.responseType = mockApiRequest._responseType;
      xmlHttpRequest.send();

      xmlHttpRequest._hasError = true;
      xmlHttpRequest._timedOut = false;

      xmlHttpRequest.setResponseData(
        HttpStatusCode.REQUEST_TIMEOUT,
        headers,
        response,
      );
    });

    test('should set status', () => {
      expect(xmlHttpRequest.status).toBe(HttpStatusCode.REQUEST_TIMEOUT);
      expect.assertions(1);
    });

    test('should set statusText', () => {
      expect(xmlHttpRequest.statusText).toBe('Request Timeout');
      expect.assertions(1);
    });

    test('should set responseURL, when responseURL is passed to setResponseData', () => {
      xmlHttpRequest.setResponseData(
        HttpStatusCode.REQUEST_TIMEOUT,
        headers,
        response,
        'responseUrl',
      );
      expect(xmlHttpRequest.responseURL).toBe('responseUrl');
      expect.assertions(1);
    });

    test('should not set responseURL, when responseURL is not passed to setResponseData', () => {
      expect(xmlHttpRequest.responseURL).toBe(undefined);
      expect.assertions(1);
    });

    test('should set response headers', () => {
      expect(xmlHttpRequest.getAllResponseHeaders()).toBe(
        'content-type: application/json\r\n',
      );
      expect.assertions(1);
    });

    test('should not return response when responseType is text', () => {
      expect(xmlHttpRequest.response).toMatch('');
      expect.assertions(1);
    });

    test('should return response when responseType is json', () => {
      xmlHttpRequest = new MockedXMLHttpRequest();
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url, true);
      xmlHttpRequest.responseType = 'json';
      xmlHttpRequest.send();
      xmlHttpRequest.setResponseData(
        HttpStatusCode.REQUEST_TIMEOUT,
        headers,
        response,
      );

      expect(xmlHttpRequest.response).toMatchObject({
        message: 'Request error',
      });
      expect.assertions(1);
    });

    test('should set readyState to DONE', () => {
      expect(xmlHttpRequest.readyState).toBe(xmlHttpRequest.DONE);
      expect.assertions(1);
    });

    test('should trigger onerror and onloadend callbacks', () => {
      expect(xmlHttpRequest.onerror).toHaveBeenCalled();
      expect(xmlHttpRequest.onloadend).toHaveBeenCalled();
      expect.assertions(2);
    });
  });

  describe('given that request was opened, sent and then aborted,', () => {
    beforeEach(() => {
      xmlHttpRequest._reset = jest.fn();
      xmlHttpRequest.onabort = jest.fn();
      xmlHttpRequest.onloadend = jest.fn();

      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url, true);
      xmlHttpRequest.responseType = mockApiRequest._responseType;
      xmlHttpRequest.send();

      xmlHttpRequest._aborted = false;

      xmlHttpRequest.abort();
    });

    test('should set _aborted to true', () => {
      expect(xmlHttpRequest._aborted).toBe(true);
      expect.assertions(1);
    });

    test('should reset everything', () => {
      expect(xmlHttpRequest._reset).toHaveBeenCalled();
      expect.assertions(1);
    });

    test('should trigger onabort and onloadend callbacks', () => {
      expect(xmlHttpRequest.onabort).toHaveBeenCalled();
      expect(xmlHttpRequest.onloadend).toHaveBeenCalled();
      expect.assertions(2);
    });
  });

  describe('given that a request was sent, response was set,', () => {
    beforeEach(() => {
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url, true);
      xmlHttpRequest.send();
    });

    test('when there is no response header & getResponseHeader was called, should return null', () => {
      xmlHttpRequest.setResponseData(
        successResponse.status,
        {},
        successResponse.response,
      );

      expect(xmlHttpRequest.getResponseHeader('Accept')).toBe(null);
      expect.assertions(1);
    });

    test('when getResponseHeader is called with a header not in response headers, should return null', () => {
      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        successResponse.response,
      );

      expect(xmlHttpRequest.getResponseHeader('Authorization')).toBe(null);
      expect.assertions(1);
    });

    test('when getResponseHeader is called with a header in response headers, should return value', () => {
      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        successResponse.response,
      );

      expect(xmlHttpRequest.getResponseHeader('Accept')).toBe(
        'application/json, text/plain, */*',
      );
      expect.assertions(1);
    });
  });

  describe('given that getAllResponseHeaders was called,', () => {
    test('when there is no response headers, should return null', () => {
      expect(xmlHttpRequest.getAllResponseHeaders()).toBe(null);
      expect.assertions(1);
    });

    test('should return sorted headers', () => {
      xmlHttpRequest.setResponseData(
        successResponse.status,
        {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Caching: 'no-cache',
        },
        successResponse.response,
      );

      expect(xmlHttpRequest.getAllResponseHeaders()).toBe(
        `accept: application/json, text/plain, */*\r\ncaching: no-cache\r\ncontent-type: application/json\r\n`,
      );
      expect.assertions(1);
    });
  });

  describe('given that responseType is set,', () => {
    beforeEach(() => {
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url, true);
    });

    test('when a request is already sent, should throw error', () => {
      xmlHttpRequest.send();

      expect(() => (xmlHttpRequest.responseType = 'text')).toThrow(
        new Error(
          `Failed to set the 'responseType' property on 'XMLHttpRequest': The response type cannot be set after the request has been sent.`,
        ),
      );
      expect.assertions(1);
    });

    test('when responseType is invalid, should not set responseType', () => {
      // @ts-ignore
      xmlHttpRequest.responseType = 'ms-stream';

      expect(xmlHttpRequest.responseType).toBe('');
      expect.assertions(1);
    });

    test('when responseType is blob and BlobManager is unavailable, should throw error', () => {
      BlobManager.isAvailable = false;

      expect(() => (xmlHttpRequest.responseType = 'blob')).toThrow(
        new Error('Native module BlobModule is required for blob support'),
      );
      expect.assertions(1);

      jest.clearAllMocks();
    });
  });

  describe('given that _clearSubscriptions is called,', () => {
    beforeEach(() => {
      xmlHttpRequest.open(mockApiRequest._method, mockApiRequest._url, true);
    });

    test('when there are no subscriptions, should not throw error', () => {
      xmlHttpRequest._clearSubscriptions();

      expect(xmlHttpRequest._clearSubscriptions).not.toThrow();
      expect(xmlHttpRequest._subscriptions).toMatchObject([]);
      expect.assertions(2);
    });

    test('should remove all subscriptions and set subscriptions to empty', () => {
      const remove = jest.fn();
      const subscriptions = [{ remove }] as unknown as Array<EventSubscription>;
      xmlHttpRequest._subscriptions.push(subscriptions[0]);

      xmlHttpRequest._clearSubscriptions();

      expect(remove).toHaveBeenCalled();
      expect(xmlHttpRequest._subscriptions).toMatchObject([]);
      expect.assertions(2);
    });
  });
});
