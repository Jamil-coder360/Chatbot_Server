import { Prisma } from "@prisma/client";
import { TgenaricErrorResponse } from "../interface/error";
declare const handleDuplicateError: (err: Prisma.PrismaClientKnownRequestError) => TgenaricErrorResponse;
export default handleDuplicateError;
//# sourceMappingURL=DuplicateError.d.ts.map