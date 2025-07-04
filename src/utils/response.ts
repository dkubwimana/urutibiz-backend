import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export class ResponseHelper {
  static success<T>(
    res: Response,
    message: string = 'Success',
    data?: T,
    statusCode: number = 200,
    meta?: any
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      meta,
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string = 'Internal Server Error',
    error?: any,
    statusCode: number = 500
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    };
    return res.status(statusCode).json(response);
  }

  static badRequest(
    res: Response,
    message: string = 'Bad Request',
    error?: any
  ): Response {
    return this.error(res, message, error, 400);
  }

  static unauthorized(
    res: Response,
    message: string = 'Unauthorized'
  ): Response {
    return this.error(res, message, null, 401);
  }

  static forbidden(
    res: Response,
    message: string = 'Forbidden'
  ): Response {
    return this.error(res, message, null, 403);
  }

  static notFound(
    res: Response,
    message: string = 'Not Found'
  ): Response {
    return this.error(res, message, null, 404);
  }

  static conflict(
    res: Response,
    message: string = 'Conflict',
    error?: any
  ): Response {
    return this.error(res, message, error, 409);
  }

  static validationError(
    res: Response,
    message: string = 'Validation Error',
    errors?: any
  ): Response {
    return this.error(res, message, errors, 422);
  }

  static created<T>(
    res: Response,
    message: string = 'Created',
    data?: T
  ): Response {
    return this.success(res, message, data, 201);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  static paginated<T>(
    res: Response,
    message: string = 'Success',
    data: T[],
    page: number,
    limit: number,
    total: number
  ): Response {
    const totalPages = Math.ceil(total / limit);
    
    return this.success(res, message, data, 200, {
      page,
      limit,
      total,
      totalPages,
    });
  }
}

export default ResponseHelper;
