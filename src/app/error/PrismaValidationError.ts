
import { Prisma } from "@prisma/client";
import {
  TErrorSource,
  TgenaricErrorResponse,

} from "../interface/error";

const handlePrismaValidationError = (
  err: Prisma.PrismaClientValidationError
): TgenaricErrorResponse => {
  const errorSources: TErrorSource[] = [
    {
      path: "",
      message: "Invalid data provided to Prisma",
    },
  ];

  return {
    statusCode: 400,
    message: "Prisma Validation Error",
    errorMessages: errorSources,
  };
};

export default handlePrismaValidationError;
