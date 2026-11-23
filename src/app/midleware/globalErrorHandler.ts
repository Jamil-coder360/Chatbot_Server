
import { Request, Response, NextFunction } from "express";
import AppError from "../error/AppError";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  let errorSources = err?.message
    ? [
        {
          path: "",
          message: err.message,
        },
      ]
    : [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;

    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;

    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack:
      process.env.NODE_ENV !== "production"
        ? err.stack
        : undefined,
  });
};

export default globalErrorHandler;
