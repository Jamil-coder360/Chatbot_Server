"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlePrismaValidationError = (err) => {
    const errorSources = [
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
exports.default = handlePrismaValidationError;
//# sourceMappingURL=PrismaValidationError.js.map