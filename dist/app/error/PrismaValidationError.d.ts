import { Prisma } from "@prisma/client";
import { TgenaricErrorResponse } from "../interface/error";
declare const handlePrismaValidationError: (err: Prisma.PrismaClientValidationError) => TgenaricErrorResponse;
export default handlePrismaValidationError;
//# sourceMappingURL=PrismaValidationError.d.ts.map