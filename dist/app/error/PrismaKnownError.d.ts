import { Prisma } from "@prisma/client";
import { TgenaricErrorResponse } from "../interface/error";
declare const handlePrismaKnownError: (err: Prisma.PrismaClientKnownRequestError) => TgenaricErrorResponse;
export default handlePrismaKnownError;
//# sourceMappingURL=PrismaKnownError.d.ts.map