
import { Request, Response, NextFunction } from "express";
import AppError from "../error/AppError";

const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(
    new AppError(
      404,
      `API Not Found: ${req.originalUrl}`
    )
  );
};

export default notFound;
