jest.useFakeTimers();

import { HttpStatusCode } from '../../network/http-codes';
import { MockedXMLHttpRequest } from '../../network/mocked-xml-http-request';
import {
  base64Response,
  request,
  successResponse,
} from '../data/request-test-data';

let xmlHttpRequest = new MockedXMLHttpRequest();

describe('MockedXMLHttpRequest,', () => {
  beforeEach(() => {
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
      xmlHttpRequest.open(request._method, request._url, true);
    });

    test('request method is set', () => {
      expect(xmlHttpRequest._method).toBe('GET');

      expect.assertions(1);
    });

    test('request url is set', () => {
      expect(xmlHttpRequest._url).toBe(request._url);

      expect.assertions(1);
    });

    test('readyState is set to OPENED', () => {
      expect(xmlHttpRequest.readyState).toBe(xmlHttpRequest.OPENED);

      expect.assertions(1);
    });

    test('when a request is re opened, should throw error', () => {
      expect(() =>
        xmlHttpRequest.open(request._method, request._url, true),
      ).toThrow(new Error('Cannot open, already sending'));

      expect.assertions(1);
    });

    test('when a request is opened without url, should throw error', () => {
      xmlHttpRequest = new MockedXMLHttpRequest();
      expect(() => xmlHttpRequest.open(request._method, '')).toThrow(
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
  });

  describe('given that request is opened and sent,', () => {
    beforeEach(() => {
      xmlHttpRequest.open(request._method, request._url, true);
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
      xmlHttpRequest.open(request._method, request._url, true);
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
      xmlHttpRequest.open(request._method, request._url, true);
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
        request._url,
      );

      expect(xmlHttpRequest.responseURL).toBe(request._url);
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

      expect(xmlHttpRequest.getAllResponseHeaders()).toMatch(
        'content-type: application/json',
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
      xmlHttpRequest.open(request._method, request._url);
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
      xmlHttpRequest.open(request._method, request._url);
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
        xmlHttpRequest.open(request._method, request._url);
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
      ${'document'}
      ${'json'}
    `(
      'when responseType is $responseType, responseText should throw err0r',
      ({ responseType }) => {
        // TODO: blob type
        xmlHttpRequest = new MockedXMLHttpRequest();
        xmlHttpRequest.open(request._method, request._url);
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

    test('when responseType is not text, responseText should throw errpr', () => {
      xmlHttpRequest = new MockedXMLHttpRequest();
      xmlHttpRequest.open(request._method, request._url);
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
  });

  describe('given that request is sent and response is received,', () => {
    test('should not get response, when responseType is arraybuffer', () => {
      xmlHttpRequest.open(request._method, request._url);
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

    // test.skip('should get blob response, when responseType is blob', () => {
    //   xmlHttpRequest.open(request._method, request._url);
    //   xmlHttpRequest.responseType = 'blob';
    //   xmlHttpRequest.send();
    //   expect(xmlHttpRequest.response).toBe(null);

    //   xmlHttpRequest.setResponseData(
    //     successResponse.status,
    //     successResponse.headers,
    //     new Blob([successResponse.response], {
    //       type: 'application/json',
    //     }),
    //   );

    //   expect(xmlHttpRequest.response).toMatchSnapshot(successResponse.response);
    //   expect.assertions(2);
    // });

    test('should not get response, when responseType is document', () => {
      xmlHttpRequest.open(request._method, request._url);
      xmlHttpRequest.responseType = 'document';
      xmlHttpRequest.send();
      expect(xmlHttpRequest.response).toBe(null);

      xmlHttpRequest.setResponseData(
        successResponse.status,
        successResponse.headers,
        successResponse.response,
      );

      expect(xmlHttpRequest.response).toBe(undefined);
      expect.assertions(2);
    });

    test('should get json response, when responseType is json', () => {
      xmlHttpRequest.open(request._method, request._url);
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

    test('should get text response, when responseType is text', () => {
      xmlHttpRequest.open(request._method, request._url);
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

      xmlHttpRequest.open(request._method, request._url, true);
      xmlHttpRequest.responseType = request._responseType;
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
      xmlHttpRequest.open(request._method, request._url, true);
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

  describe('given that a request was sent, response was set,', () => {
    beforeEach(() => {
      xmlHttpRequest.open(request._method, request._url, true);
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
});
