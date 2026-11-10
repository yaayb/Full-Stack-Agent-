import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db';
import { AppError } from '../middleware/error.middleware';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import {
  clearAuthCookie,
  setAuthCookie,
  signAuthToken,
  UserRole,
} from '../utils/token';

export const register = async (
  req: Request<Record<string, string>, unknown, RegisterInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('An account with this email already exists.', 409, 'EMAIL_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'CUSTOMER',
      },
    });

    const role: UserRole = user.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';
    const token = signAuthToken({
      userId: user.id,
      email: user.email,
      role,
    });

    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<Record<string, string>, unknown, LoginInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const role: UserRole = user.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';
    const token = signAuthToken({
      userId: user.id,
      email: user.email,
      role,
    });

    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (_req: Request, res: Response): void => {
  clearAuthCookie(res);
  res.status(200).json({
    success: true,
    message: 'Signed out successfully.',
  });
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(200).json({
        success: true,
        user: null,
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      clearAuthCookie(res);
      res.status(200).json({
        success: true,
        user: null,
      });
      return;
    }

    const role: UserRole = user.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
