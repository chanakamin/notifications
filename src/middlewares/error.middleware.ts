import { Request, Response, NextFunction } from "express";
import { HttpException } from '../exceptions/http.exception.js';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err)
    }
    asyncErrorCatcher(err, res);
}

export const asyncErrorCatcher = (err: Error, res: Response) => {
    let statusCode = 500;
    const response = {
        success: false,
        error: 'an error occurred',
    }
    if (err instanceof HttpException) {
        response.error = err.message;
        statusCode = err.errorCode;
    }
    console.error(`[${new Date().toISOString()}] statusCode: ${statusCode} Error:`, err);
    res.status(statusCode).json(response);
}