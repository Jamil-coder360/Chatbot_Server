
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { MulterError } from "multer";
import { Prisma } from "@prisma/client";

import AppError from "../error/AppError";
import handleZodError from "../error/ZodError";
import handleDuplicateError from "../error/DuplicateError";
import handlePrismaValidationError from "../error/PrismaValidationError";
import handlePrismaKnownError from "../error/PrismaKnownError";
import handleMulterError from "../error/MulterError";

import type { TErrorSource } from "../interface/error";

const globalErrorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
) => {
  let statusCode = 500;
  let message = "Something went wrong!";

  let errorSources: TErrorSource[] = [
    {
      path: "",
      message: "Something went wrong!",
    },
  ];

  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorMessages;
  }

  // 2. Prisma Known Request Error
  else if (
    err instanceof Prisma.PrismaClientKnownRequestError
  ) {
    if (err.code === "P2002") {
      // Duplicate Error
      const simplifiedError = handleDuplicateError(err);

      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorSources = simplifiedError.errorMessages;
    } else {
      // Other Prisma Known Errors
      const simplifiedError = handlePrismaKnownError(err);

      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorSources = simplifiedError.errorMessages;
    }
  }

  // 3. Prisma Validation Error
  else if (
    err instanceof Prisma.PrismaClientValidationError
  ) {
    const simplifiedError = handlePrismaValidationError(err);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorMessages;
  }

  // 4. Custom App Error
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;

    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  // 5. Multer Error
  else if (err instanceof MulterError) {
    const simplifiedError = handleMulterError(err);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorMessages;
  }

  // 6. General JavaScript Error
  else if (err instanceof Error) {
    message = err.message;

    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  // Final JSON Response
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack:
      process.env.NODE_ENV === "development"
        ? err instanceof Error
          ? err.stack
          : undefined
        : null,
  });
};

export default globalErrorHandler;
