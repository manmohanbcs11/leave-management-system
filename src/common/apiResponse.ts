export class ApiResponse {
  statusCode: number;
  message: string;
  data?: any;

  constructor(statusCode: number, message: string, data?: any) {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
  }
}

export class ApiError extends Error {
  statusCode: number;
  message: string;
  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}