import { Request } from '../../network/barricade.types';
import { HttpStatusCode } from '../../network/http-codes';

export const mockApiRequest = {
  _eventListeners: [],
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4,
  readyState: 1,
  status: 0,
  timeout: 60000,
  withCredentials: true,
  upload: { _eventListeners: [] },
  _subscriptions: [],
  _aborted: false,
  _hasError: false,
  _headers: {
    accept: 'application/json, text/plain, */*',
    'cache-control': 'no-cache',
  },
  _lowerCaseResponseHeaders: {},
  _response: '',
  _responseType: '',
  _sent: true,
  _timedOut: false,
  _incrementalEvents: false,
  statusText: '',
  _method: 'GET',
  _url: 'https://api.flickr.com/services/rest?method=flickr.photos.getRecent&content_type=1&page=1&per_page=20&api_key=e07a0248f525a15fe85b9c1181c45329&format=json&nojsoncallback=1',
} as unknown as Request & XMLHttpRequest;

export const mockRequestParams = {
  method: 'flickr.photos.getRecent',
  content_type: '1',
  page: '1',
  per_page: '20',
  api_key: 'e07a0248f525a15fe85b9c1181c45329',
  format: 'json',
  nojsoncallback: '1',
};

export const successResponse = {
  status: HttpStatusCode.OK,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  },
  response: '{"data":true}',
};

export const errorResponse = {
  status: HttpStatusCode.BAD_REQUEST,
  headers: { 'content-type': 'application/json' },
  response: '{"message":"Something went wrong"}',
};

export const base64Response = 'e2RhdGE6IHRydWV9';

export const getCustomMockApiRequest = (currentRequest: Partial<Request>) => {
  return {
    ...mockApiRequest,
    ...currentRequest,
  } as unknown as Request & XMLHttpRequest;
};
