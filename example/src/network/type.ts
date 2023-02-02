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

export interface SuccessResponse {
  stat: HttpStatus;
  message?: string;
  code?: number;
}
