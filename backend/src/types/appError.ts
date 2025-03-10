import { responseStatus } from "../constants/statusEnum";

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: any;

  constructor(statusCode: responseStatus, code: string, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}