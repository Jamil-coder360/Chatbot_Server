
import { Prisma } from "@prisma/client";
import {
  TErrorSource,
  TgenaricErrorResponse,
} from "../interface/error";

const handleDuplicateError = (
  err: Prisma.PrismaClientKnownRequestError
): TgenaricErrorResponse => {
  // Prisma P2002 duplicate error
  const target = err?.meta?.target;

  let field = "Field";

  if (Array.isArray(target)) {
    field = target.join(", ");
  } else if (typeof target === "string") {
    field = target;
  }

  const errorSources: TErrorSource[] = [
    {
      path: field,
      message: `${field} already exists`,
    },
  ];

  return {
    statusCode: 400,
    message: "Duplicate value error",
    errorMessages: errorSources,
  };
};

export default handleDuplicateError;
