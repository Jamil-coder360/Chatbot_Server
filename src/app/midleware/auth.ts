const httpStatus = require("http-status").default;
import jwt from 'jsonwebtoken';
import { type JwtPayload } from 'jsonwebtoken'; 
import type {  NextFunction, Request, Response } from 'express'; 
import catchAsync from '../utils/catchAsync.js';
import prisma from '../config/prisma.js';
import AppError from '../error/AppError.js';
import { config } from '../config/index.js';


const auth = (...userRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'you are not authorized!');
    }

    let decode;
    try {
      decode = jwt.verify(
        token,
        config.jwt_secret as string,
      ) as JwtPayload;
    } catch {
      throw new AppError(httpStatus.UNAUTHORIZED, 'unauthorized');
    }

    const { role, userId } = decode;
    const isUserExist = await prisma.user.findFirst({
      where: {
        id: userId,
        isDeleted: false,
      },
      include: {
         verification: true,
      },
    });
    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'user not found');
    }
    if (userRoles && !userRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    if (isUserExist.status === 'INACTIVE') {
      throw new AppError(httpStatus.UNAUTHORIZED, 'your account is inactive');
    }

    if (isUserExist.isDeleted) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'your account is deleted');
    }

    if (!isUserExist.verification?.status) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'your account is not verified',
      );
    }
    req.user = decode;
    next();
  });
};
export default auth;