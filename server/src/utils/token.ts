import jwt, { SignOptions } from 'jsonwebtoken';
import { Response } from 'express';

export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface JwtUserPayload {
  userId: string;
  email: string;
  role: UserRole;
}

const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'super-secret-atelier-vanguard-jwt-key';
};

export const TOKEN_COOKIE_NAME = 'av_token';

export const signAuthToken = (payload: JwtUserPayload): string => {
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
};

export const verifyAuthToken = (token: string): JwtUserPayload => {
  const decoded = jwt.verify(token, getJwtSecret());
  if (
    typeof decoded === 'object' &&
    decoded !== null &&
    'userId' in decoded &&
    'email' in decoded &&
    'role' in decoded
  ) {
    return {
      userId: String(decoded.userId),
      email: String(decoded.email),
      role: decoded.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER',
    };
  }
  throw new Error('Invalid token payload structure');
};

export const setAuthCookie = (res: Response, token: string): void => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

export const clearAuthCookie = (res: Response): void => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie(TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
  });
};
