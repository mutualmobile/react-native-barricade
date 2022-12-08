import { EventSubscription } from 'react-native';

import { Event, EventTarget } from './event';
import { HttpStatusCodeText } from './http-codes';
import { Response, ResponseType } from './mocked-xml-http-request.types';

const CookieRegex = /^Set-Cookie2?$/i;

const SUPPORTED_RESPONSE_TYPES = {
  arraybuffer: false,
  blob: false,
  document: false,
  json: true,
  text: true,
  '': true,
};

const UNSENT = 0;
const OPENED = 1;
const HEADERS_RECEIVED = 2;
const LOADING = 3;
const DONE = 4;

class XMLHttpRequestEventTarget extends EventTarget {
  onload?: Function;
  onloadstart?: Function;
  onprogress?: Function;
  ontimeout?: Function;
  onerror?: Function;
  onabort?: Function;
  onloadend?: Function;
}

export class MockedXMLHttpRequest extends EventTarget {
  static UNSENT: number = UNSENT;
  static OPENED: number = OPENED;
  static HEADERS_RECEIVED: number = HEADERS_RECEIVED;
  static LOADING: number = LOADING;
  static DONE: number = DONE;

  UNSENT: number = UNSENT;
  OPENED: number = OPENED;
  HEADERS_RECEIVED: number = HEADERS_RECEIVED;
  LOADING: number = LOADING;
  DONE: number = DONE;

  onload?: Function;
  onloadstart?: Function;
  onprogress?: Function;
  ontimeout?: Function;
  onerror?: Function;
  onabort?: Function;
  onloadend?: Function;
  onreadystatechange?: Function;

  readyState: number = UNSENT;
  responseHeaders?: Record<string, string>;
  status: keyof typeof HttpStatusCodeText | 0 = 0;
  timeout = 0;
  responseURL?: string;
  withCredentials = true;

  upload: XMLHttpRequestEventTarget = new XMLHttpRequestEventTarget();

  _requestId?: number;
  _subscriptions: Array<EventSubscription> = [];

  _aborted = false;
  _cachedResponse?: Response;
  _hasError = false;
  _headers: Record<string, any> = {};
  _lowerCaseResponseHeaders: Record<string, any> = {};
  _method?: string;
  _perfKey?: string;
  _response: string | undefined = '';
  _responseType: ResponseType = '';
  _sent = false;
  _url?: string;
  _timedOut = false;
  _incrementalEvents = false;
  errorFlag?: boolean = false;

  requestBody: any = null;
  statusText = '';

  constructor() {
    super();
    this._reset();
  }

  _reset(): void {
    this.readyState = this.UNSENT;
    this.responseHeaders = undefined;
    this.status = 0;
    delete this.responseURL;

    this._requestId = undefined;

    this._cachedResponse = undefined;
    this._hasError = false;
    this._headers = {};
    this._response = '';
    this._responseType = '';
    this._sent = false;
    this._lowerCaseResponseHeaders = {};

    this._clearSubscriptions();
    this._timedOut = false;

    this.errorFlag = false;
  }

  _clearSubscriptions(): void {
    (this._subscriptions || []).forEach(sub => {
      if (sub) {
        sub.remove();
      }
    });
    this._subscriptions = [];
  }

  get responseType(): ResponseType {
    return this._responseType;
  }

  set responseType(responseType: ResponseType) {
    if (this._sent) {
      throw new Error(
        "Failed to set the 'responseType' property on 'XMLHttpRequest': The " +
          'response type cannot be set after the request has been sent.',
      );
    }
    if (!SUPPORTED_RESPONSE_TYPES.hasOwnProperty(responseType)) {
      console.warn(
        `The provided value '${responseType}' is not a valid 'responseType'.`,
      );
      return;
    }

    this._responseType = responseType;
  }

  get responseText() {
    if (this._responseType !== '' && this._responseType !== 'text') {
      throw new Error(
        "The 'responseText' property is only available if 'responseType' " +
          `is set to '' or 'text', but it is '${this._responseType}'.`,
      );
    }
    if (this.readyState < LOADING) {
      return '';
    }
    return this._response;
  }

  get response() {
    const { responseType } = this;
    if (responseType === '' || responseType === 'text') {
      return this.readyState < LOADING || this._hasError ? '' : this._response;
    }

    if (this.readyState !== DONE) {
      return null;
    }

    if (this._cachedResponse !== undefined) {
      return this._cachedResponse;
    }

    switch (responseType) {
      case 'arraybuffer':
      case 'blob':
      case 'document':
        this._cachedResponse = undefined;
        break;

      case 'json':
        try {
          this._cachedResponse = JSON.parse(this._response ?? '');
        } catch (_) {
          this._cachedResponse = undefined;
        }
        break;

      default:
        this._cachedResponse = undefined;
    }

    return this._cachedResponse;
  }

  getAllResponseHeaders() {
    if (this.readyState < this.HEADERS_RECEIVED) {
      return '';
    }

    let headers = '';
    for (const header in this.responseHeaders) {
      if (
        this.responseHeaders.hasOwnProperty(header) &&
        !CookieRegex.test(header)
      ) {
        headers += header + ': ' + this.responseHeaders[header] + '\r\n';
      }
    }

    return headers;
  }

  getResponseHeader(header: string) {
    if (this.readyState < this.HEADERS_RECEIVED || CookieRegex.test(header)) {
      return null;
    }

    header = header?.toLowerCase();
    for (const h in this.responseHeaders) {
      if (h.toLowerCase() === header) {
        return this.responseHeaders[h];
      }
    }

    return null;
  }

  setRequestHeader(header: string, value: any): void {
    if (this.readyState !== this.OPENED) {
      throw new Error('Request has not been opened');
    }

    this._headers[header.toLowerCase()] = String(value);
  }

  open(method: string, url: string, async = true): void {
    /* Other optional arguments are not supported yet */
    if (this.readyState !== this.UNSENT) {
      throw new Error('Cannot open, already sending');
    }
    if (async !== undefined && !async) {
      // async is default
      throw new Error('Synchronous http requests are not supported');
    }
    if (!url) {
      throw new Error('Cannot load an empty url');
    }
    this._method = method.toUpperCase();
    this._url = url;
    this._aborted = false;
    this._response = undefined;
    this.responseURL = url;
    this._headers = {};
    this._sent = false;
    this.setReadyState(this.OPENED);
  }

  setReadyState(newState: number): void {
    this.readyState = newState;
    this.dispatchEvent(new Event('readystatechange'));
    if (newState === this.DONE) {
      if (this._aborted) {
        this.dispatchEvent(new Event('abort'));
      } else if (this._hasError) {
        if (this._timedOut) {
          this.dispatchEvent(new Event('timeout'));
        } else {
          this.dispatchEvent(new Event('error'));
        }
      } else {
        this.dispatchEvent(new Event('load', false, false, this));
      }
      this.dispatchEvent(new Event('loadend', false, false, this));
    }
  }

  send(data: string) {
    if (this.readyState !== this.OPENED) {
      throw new Error('Request has not been opened');
    }
    if (this._sent) {
      throw new Error('Request has already been sent');
    }

    if (!/^(get|head)$/i.test(this._method ?? '')) {
      let hasContentTypeHeader = false;

      Object.keys(this._headers).forEach(function (key) {
        if (key.toLowerCase() === 'content-type') {
          hasContentTypeHeader = true;
        }
      });

      if (!hasContentTypeHeader && !(data || '').toString().match('FormData')) {
        this._headers['Content-Type'] = 'text/plain;charset=UTF-8';
      }

      this.requestBody = data;
    }

    this.errorFlag = false;
    this._sent = true;
    this.setReadyState(this.OPENED);

    this.dispatchEvent(new Event('loadstart', false, false, this));
  }

  abort(): void {
    this._aborted = true;
    if (
      !(
        this.readyState === this.UNSENT ||
        (this.readyState === this.OPENED && !this._sent) ||
        this.readyState === this.DONE
      )
    ) {
      this._reset();
      this.setReadyState(this.DONE);
    }
    this._reset();
  }

  respond(
    status: keyof typeof HttpStatusCodeText,
    headers: Record<string, string>,
    body: string,
  ) {
    this._setResponseHeaders(headers || {});
    this.status = typeof status === 'number' ? status : 200;
    this.statusText = HttpStatusCodeText[this.status];
    this._setResponseBody(body || '');
  }

  _setResponseBody(body: string) {
    if (this.readyState === this.DONE) {
      throw new Error('Request done');
    } else if (this.readyState !== this.HEADERS_RECEIVED) {
      throw new Error('No headers received');
    } else if (typeof body !== 'string') {
      const error = new Error(
        'Attempted to respond to fake XMLHttpRequest with ' +
          body +
          ', which is not a string.',
      );
      error.name = 'InvalidBodyException';
      throw error;
    }

    const chunkSize = 10;
    let index = 0;
    this._response = '';

    do {
      this.setReadyState(this.LOADING);

      this._response += body.substring(index, index + chunkSize);
      index += chunkSize;
    } while (index < body.length);

    this.setReadyState(this.DONE);
  }

  _setResponseHeaders(headers: Record<string, any>) {
    this.responseHeaders = {};

    for (const header in headers) {
      if (headers.hasOwnProperty(header)) {
        this.responseHeaders[header] = headers[header];
      }
    }

    this.setReadyState(this.HEADERS_RECEIVED);
  }
}
