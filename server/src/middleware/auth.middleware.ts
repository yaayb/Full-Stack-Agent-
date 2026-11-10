import { Request, Response, NextFunction } from 'express';
import { JwtUserPayload, TOKEN_COOKIE_NAME, verifyAuthToken } from '../utils/token';
import { AppError } from './error.middleware';

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const cookieToken = req.cookies?.[TOKEN_COOKIE_NAME] as string | undefined;
    const authHeader = req.headers.authorization;
    const bearerToken =
      authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    const token = cookieToken || bearerToken;

    if (!token) {
      throw new AppError('Authentication required. Please sign in.', 401, 'UNAUTHORIZED');
    }

    const payload = verifyAuthToken(token);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    next(new AppError('Invalid or expired session token.', 401, 'UNAUTHORIZED'));
  }
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const cookieToken = req.cookies?.[TOKEN_COOKIE_NAME] as string | undefined;
    const authHeader = req.headers.authorization;
    const bearerToken =
      authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    const token = cookieToken || bearerToken;

    if (token) {
      req.user = verifyAuthToken(token);
    }
  } catch {
    // Ignore invalid optional token and continue as guest
  }
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  requireAuth(req, res, (err?: unknown) => {
    if (err) {
      next(err);
      return;
    }
    if (!req.user || req.user.role !== 'ADMIN') {
      next(new AppError('Forbidden: Administrator privileges required.', 403, 'FORBIDDEN'));
      return;
    }
    next();
  });
};
