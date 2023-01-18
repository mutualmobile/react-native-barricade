import { EventSubscription } from 'react-native';

import { Event, EventTarget } from './event';
import { HttpStatusCodeText } from './http-codes';

const BlobManager = require('react-native/Libraries/Blob/BlobManager');
const base64 = require('base64-js');
const invariant = require('invariant');

// The native blob module is optional so inject it here if available.
if (BlobManager.isAvailable) {
  BlobManager.addNetworkingHandler();
}

const UNSENT = 0;
const OPENED = 1;
const HEADERS_RECEIVED = 2;
const LOADING = 3;
const DONE = 4;

const SUPPORTED_RESPONSE_TYPES = {
  arraybuffer: typeof global.ArrayBuffer === 'function',
  blob: typeof global.Blob === 'function',
  document: false,
  json: true,
  text: true,
  '': true,
};

export class XMLHttpRequestEventTarget extends EventTarget {
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
  _cachedResponse?: Response | null;
  _hasError = false;
  _headers: Record<string, any> = {};
  _lowerCaseResponseHeaders: Record<string, any> = {};
  _method?: string;
  _response: string | Blob | ArrayBuffer | undefined = '';
  _responseType: XMLHttpRequestResponseType = '';
  _sent = false;
  _url?: string;
  _timedOut = false;

  statusText = '';
  _cachedRequestBody: any = null;
  _requestBody: any = null;

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
    this._cachedRequestBody = undefined;
    this._requestBody = undefined;

    this._clearSubscriptions();
    this._timedOut = false;
  }

  get responseType(): XMLHttpRequestResponseType {
    return this._responseType;
  }

  set responseType(responseType: XMLHttpRequestResponseType) {
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

    // redboxes early, e.g. for 'arraybuffer' on ios 7
    invariant(
      SUPPORTED_RESPONSE_TYPES[responseType] || responseType === 'document',
      `The provided value '${responseType}' is unsupported in this environment.`,
    );

    if (responseType === 'blob') {
      invariant(
        BlobManager.isAvailable,
        'Native module BlobModule is required for blob support',
      );
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
        this._cachedResponse = base64.toByteArray(this._response).buffer;
        break;

      case 'blob':
        if (typeof this._response === 'object' && this._response) {
          this._cachedResponse = BlobManager.createFromOptions(this._response);
        } else if (this._response === '') {
          this._cachedResponse = BlobManager.createFromParts([]);
        } else {
          throw new Error(`Invalid response for blob: ${this._response}`);
        }
        break;

      case 'document':
        this._cachedResponse = null;
        break;

      case 'json':
        try {
          this._cachedResponse = JSON.parse((this._response as string) ?? '');
        } catch (_) {
          this._cachedResponse = null;
        }
        break;

      default:
        this._cachedResponse = null;
    }

    return this._cachedResponse;
  }

  get requestBody() {
    if (!this._cachedRequestBody) {
      this._cachedRequestBody = this._requestBody;
      if (this._requestBody) {
        try {
          this._cachedRequestBody = JSON.parse(
            (this._requestBody as string) ?? '',
          );
        } catch (_) {}
      }
    }
    return this._cachedRequestBody;
  }

  _clearSubscriptions(): void {
    (this._subscriptions || []).forEach(sub => {
      if (sub) {
        sub.remove();
      }
    });
    this._subscriptions = [];
  }

  getAllResponseHeaders() {
    if (!this.responseHeaders) {
      // according to the spec, return null if no response has been received
      return null;
    }

    // Assign to non-nullable local variable.
    const responseHeaders = this.responseHeaders;

    const unsortedHeaders: Map<
      string,
      { lowerHeaderName: string; upperHeaderName: string; headerValue: string }
    > = new Map();
    for (const rawHeaderName of Object.keys(responseHeaders)) {
      const headerValue = responseHeaders[rawHeaderName];
      const lowerHeaderName = rawHeaderName.toLowerCase();
      const header = unsortedHeaders.get(lowerHeaderName);
      if (header) {
        header.headerValue += ', ' + headerValue;
        unsortedHeaders.set(lowerHeaderName, header);
      } else {
        unsortedHeaders.set(lowerHeaderName, {
          lowerHeaderName,
          upperHeaderName: rawHeaderName.toUpperCase(),
          headerValue,
        });
      }
    }

    // Sort in ascending order, with a being less than b if a's name is legacy-uppercased-byte less than b's name.
    const sortedHeaders = [...unsortedHeaders.values()].sort((a, b) => {
      if (a.upperHeaderName < b.upperHeaderName) {
        return -1;
      }
      if (a.upperHeaderName > b.upperHeaderName) {
        return 1;
      }
      return 0;
    });

    // Combine into single text response.
    return (
      sortedHeaders
        .map(header => {
          return header.lowerHeaderName + ': ' + header.headerValue;
        })
        .join('\r\n') + '\r\n'
    );
  }

  getResponseHeader(header: string) {
    const value = this._lowerCaseResponseHeaders[header.toLowerCase()];
    return value !== undefined ? value : null;
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
    this.setReadyState(this.OPENED);
  }

  send(data?: string) {
    if (this.readyState !== this.OPENED) {
      throw new Error('Request has not been opened');
    }
    if (this._sent) {
      throw new Error('Request has already been sent');
    }

    this._requestBody = data;
    this._sent = true;

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

  setResponseHeaders(responseHeaders: Record<string, any>) {
    this.responseHeaders = responseHeaders || {};
    const headers = responseHeaders || {};

    this._lowerCaseResponseHeaders = Object.keys(headers).reduce(
      (previousValue: Record<string, any>, currentValue: string) => {
        previousValue[currentValue.toLowerCase()] = headers[currentValue];
        return previousValue;
      },
      {},
    );
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

  setResponseData(
    status: keyof typeof HttpStatusCodeText,
    headers: Record<string, string>,
    body: string | Blob | ArrayBuffer,
    responseURL?: string,
  ) {
    this.status = typeof status === 'number' ? status : 200;
    this.statusText = HttpStatusCodeText[this.status];
    if (responseURL || responseURL === '') {
      this.responseURL = responseURL;
    } else {
      delete this.responseURL;
    }
    this.setResponseHeaders(headers || {});
    this.setReadyState(this.HEADERS_RECEIVED);
    this._setResponseBody(body || '');
  }

  _setResponseBody(body: string | Blob | ArrayBuffer) {
    if (this.readyState === this.DONE) {
      throw new Error('Request done');
    } else if (this.readyState !== this.HEADERS_RECEIVED) {
      throw new Error('No headers received');
    } else if (
      typeof body !== 'string' &&
      (this.responseType === 'json' || this.responseType === 'text')
    ) {
      const error = new Error(
        'Attempted to respond to fake XMLHttpRequest with ' +
          body +
          ', which is not a string.',
      );
      error.name = 'InvalidBodyException';
      throw error;
    }

    this._response = body;
    this._cachedResponse = undefined; // force lazy recomputation
    this.setReadyState(this.DONE);
  }
}
