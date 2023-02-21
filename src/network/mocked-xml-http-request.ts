/** This source code is based on React Native's XMLHttpRequest.js with typescript. */
const XMLHttpRequest = require('react-native/Libraries/Network/XMLHttpRequest');

import { HttpStatusCodeText } from './http-codes';

export class MockedXMLHttpRequest extends XMLHttpRequest {
  statusText = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _cachedRequestBody?: any;
  _requestBody?: string;

  constructor() {
    super();
    this._reset();
  }

  _reset(): void {
    super._reset();

    this._cachedRequestBody = undefined;
    this._requestBody = undefined;
  }

  get requestBody() {
    if (!this._cachedRequestBody) {
      this._cachedRequestBody = this._requestBody;
      if (this._requestBody) {
        try {
          this._cachedRequestBody = JSON.parse(this._requestBody as string);
        } catch (_) {}
      }
    }
    return this._cachedRequestBody;
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

    // this.dispatchEvent(new Event('loadstart', false, false));
    this.dispatchEvent({ type: 'loadstart' });
  }

  setResponseData(
    status: keyof typeof HttpStatusCodeText,
    headers: Record<string, string>,
    body: string | Blob | ArrayBuffer,
    responseURL?: string,
  ) {
    this.status = typeof status === 'number' ? status : 200;
    this.statusText =
      HttpStatusCodeText[this.status as keyof typeof HttpStatusCodeText];
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
