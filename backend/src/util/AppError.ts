export default class AppError extends Error {
  public readonly httpCode: number;
  public readonly status: string;
  public readonly data?: any;
  public readonly isOperational: boolean;

  constructor(httpCode: number, status: string, message: string, data?: any) {
    super(message);
    this.httpCode = httpCode;
    this.status = status;
    this.isOperational = true;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}
