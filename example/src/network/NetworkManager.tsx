import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Strings } from '../assets';
import env from '../config';
import { HttpStatusCodes } from '../constants/enum.constants';
import { IError, ErrorResponse, ResponseData } from './type';

const DEFAULT_TIMEOUT = 60 * 1000;
const RESPONSE_FORMAT = 'json';

const appClient = axios.create({
  baseURL: env.baseUrl,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
});

appClient.interceptors.request.use(config => {
  config.params = {
    ...config.params,
    api_key: env.flickrKey,
    format: RESPONSE_FORMAT,
    nojsoncallback: 1,
  };
  return config;
});

appClient.interceptors.response.use(
  response => response,
  error => Promise.reject(error),
);

export class NetworkManager {
  static myInstance: NetworkManager;
  isRefreshAPILoading = false;

  static getInstance(): NetworkManager {
    if (!NetworkManager.myInstance) {
      NetworkManager.myInstance = new NetworkManager();
    }

    return NetworkManager.myInstance;
  }

  appRequest = async <T,>(options: AxiosRequestConfig) => {
    return appClient(options)
      .then(response => this.onSuccess<T>(response))
      .catch(async error => {
        const result = await this.onError(error);
        return Promise.reject(result);
      });
  };

  onSuccess: <T>(response: AxiosResponse<ResponseData<T>>) => ResponseData<T> =
    response => {
      const result = response.data;
      return result;
    };

  onError = async (error: AxiosError<ErrorResponse>) => {
    let errorResult: IError = { status: HttpStatusCodes.BAD_REQUEST };
    let title: string | undefined, message: string | undefined;
    if (error.response) {
      errorResult = error.response;
      title = Strings.errorMessage.oops;
      message =
        errorResult.data?.message || Strings.errorMessage.something_went_wrong;
    } else if (error.request) {
      errorResult = error.request;
      if (error.message === 'Network Error') {
        title = Strings.errorMessage.no_internet;
        message = Strings.errorMessage.no_network_desc;
      } else {
        title = Strings.errorMessage.oops;
        message = Strings.errorMessage.something_went_wrong;
      }
    } else {
      title = Strings.errorMessage.oops;
      message = error.message;
    }

    return errorResult;
  };
}
