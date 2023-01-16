import { HttpStatus, HttpStatusCodes } from '../constants';

export interface IError {
  data?: ErrorResponse;
  status: HttpStatusCodes;
  errorTitle?: string;
  errorMessage?: string;
}

export interface ErrorResponse {
  message: string;
  path?: string;
  status: HttpStatus;
  timestamp?: string;
}

export interface ResponseData<T> {
  stat: HttpStatus;
  photos: T;
  message?: string;
  code?: number;
}
