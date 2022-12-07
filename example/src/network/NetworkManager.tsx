import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Alert } from 'react-native';
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
    console.log('request -> ', options);
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
      console.log('response.data-> ', result);

      return result;
    };

  onError = async (error: AxiosError<ErrorResponse>) => {
    let errorResult: IError = { status: HttpStatusCodes.BAD_REQUEST };
    let title: string | undefined, message: string | undefined;
    if (error.response) {
      errorResult = error.response;
      console.log('Error Result:', errorResult);

      title = Strings.errorMessage.oops;
      message =
        errorResult.data?.message || Strings.errorMessage.something_went_wrong;
    } else if (error.request) {
      errorResult = error.request;
      console.log('Error Result:', errorResult);
      if (error.message === 'Network Error') {
        // Issue with accessing internet even thought phone is connected to network (Eg. Firewall)
        title = Strings.errorMessage.no_internet;
        message = Strings.errorMessage.no_network_desc;
      } else {
        // The request was made but no response was received
        title = Strings.errorMessage.oops;
        message = Strings.errorMessage.something_went_wrong;
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      title = Strings.errorMessage.oops;
      message = error.message;
    }
    if (message) {
      Alert.alert(title ?? message, title ? message : undefined);
    }

    return errorResult;
  };
}
