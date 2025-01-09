import { Request, Response, NextFunction } from 'express';
import { UnAuthorizedError } from '../exceptions/http.exception.js'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnAuthorizedError();
  }

  const [ ,token] = authHeader.split(' ');

  if (!token || token !== (process.env.AUTH_TOKEN ?? 'onlyvim2024')) {
    throw new UnAuthorizedError();
  }

  next();
};