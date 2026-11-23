import { ZodError, ZodIssue } from "zod";
import { TErrorSource, TgenaricErrorResponse } from "../interface/error";

const haldleZodError = (error: ZodError): TgenaricErrorResponse => {
  const errors: TErrorSource[] = error.issues.map((issue: ZodIssue) => {
    const path = issue.path[issue.path.length - 1];

    return {
      path: typeof path === "string" || typeof path === "number" ? path : null,
      message: issue.message,
    };
  });
  return {
    statusCode: 400,
    message: "Validation Error",
    errorMessages: errors,
  };
};

export default haldleZodError;
