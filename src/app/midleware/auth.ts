
const httpStatus = require("http-status").default;

import jwt, { type JwtPayload } from "jsonwebtoken";
import type {
  NextFunction,
  Request,
  Response,
} from "express";

import catchAsync from "../utils/catchAsync.js";
import prisma from "../config/prisma.js";
import AppError from "../error/AppError.js";
import { config } from "../config/index.js";

const auth = (...userRoles: string[]) => {
  return catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // 1. Get token from Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "You are not authorized!"
        );
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Access token is missing!"
        );
      }

      // 2. Verify JWT token
      let decoded: JwtPayload;

      try {
        decoded = jwt.verify(
          token,
          config.jwt_secret as string
        ) as JwtPayload;
      } catch (error: any) {
        if (error.name === "TokenExpiredError") {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            "Access token has expired!"
          );
        }

        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Invalid access token!"
        );
      }

      // 3. Get user information from JWT
      const { id, role } = decoded;

      if (!id || !role) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Invalid token payload!"
        );
      }

      // 4. Find user from database
      const isUserExist = await prisma.user.findUnique({
        where: {
          id: id as string,
        },
        include: {
          verification: true,
        },
      });

      if (!isUserExist) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          "User not found!"
        );
      }

      // 5. Check deleted account
      if (isUserExist.isDeleted) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Your account is deleted!"
        );
      }

      // 6. Check account status
      if (isUserExist.status !== "ACTIVE") {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Your account is inactive or suspended!"
        );
      }

      // 7. Check email verification
      if (!isUserExist.verification?.status) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Your account is not verified!"
        );
      }

      // 8. Check user role
      if (
        userRoles.length > 0 &&
        !userRoles.includes(isUserExist.role)
      ) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You are not authorized!"
        );
      }

      // 9. Set authenticated user
      req.user = {
        id: isUserExist.id,
        email: isUserExist.email,
        role: isUserExist.role,
      };

      // 10. Continue to next middleware
      next();
    }
  );
};

export default auth;
