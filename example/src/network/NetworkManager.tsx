import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Alert } from 'react-native';

import { Strings } from '../assets';
import { Env } from '../config';
import { HttpStatusCodes } from '../constants';
import { store } from '../redux';
import { IError, ErrorResponse, SuccessResponse } from './type';

const DEFAULT_TIMEOUT = 10 * 1000;
const RESPONSE_FORMAT = 'json';

const appClient = axios.create({
  baseURL: Env.baseUrl,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    // 'Content-Type': 'multipart/form-data',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Authorization: `Bearer public_W142hbGGZ4LkUvwHHr6U2rqKYARw`,
  },
});

appClient.interceptors.request.use(config => {
  config.params = {
    ...config.params,
    // api_key: Env.flickrKey,
    // format: RESPONSE_FORMAT,
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

  appRequest = async <T extends SuccessResponse>(
    options: AxiosRequestConfig,
    showError = false,
  ): Promise<T> => {
    if (store.getState().globalReducer.hasNetwork) {
      return appClient(options)
        .then(response => this.onSuccess<T>(response))
        .catch(async error => {
          const result = await this.onError(error, showError);
          return Promise.reject(result);
        });
    } else {
      const title = Strings.errorMessage.no_internet,
        message = Strings.errorMessage.no_network_desc;
      if (showError) {
        Alert.alert(title ?? message, title ? message : undefined);
      }
      return Promise.reject({
        data: {
          message,
        },
        status: HttpStatusCodes.NO_NETWORK,
        errorTitle: title,
        errorMessage: message,
      });
    }
  };

  onSuccess: <T extends SuccessResponse>(response: AxiosResponse<T>) => T =
    response => {
      const result = response.data;
      return result;
    };

  onError = async (error: AxiosError<ErrorResponse>, showError: boolean) => {
    let errorResult: IError = { status: HttpStatusCodes.BAD_REQUEST };
    let title: string | undefined, message: string | undefined;
    if (error.response) {
      errorResult = error.response;
      title = Strings.errorMessage.oops;
      message =
        errorResult.data?.message ?? Strings.errorMessage.something_went_wrong;
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

    if (message && showError) {
      Alert.alert(title ?? message, title ? message : undefined);
    }

    return errorResult;
  };
}
