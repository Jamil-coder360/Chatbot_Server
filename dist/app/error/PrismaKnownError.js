"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlePrismaKnownError = (err) => {
    let statusCode = 500;
    let message = "Database operation failed";
    switch (err.code) {
        case "P2000":
            statusCode = 400;
            message = "The provided value is too long";
            break;
        case "P2003":
            statusCode = 409;
            message = "Foreign key constraint failed";
            break;
        case "P2005":
        case "P2006":
        case "P2011":
        case "P2012":
        case "P2013":
        case "P2019":
            statusCode = 400;
            message = "Invalid database input";
            break;
        case "P2025":
            statusCode = 404;
            message = "Requested record not found";
            break;
        default:
            statusCode = 500;
            message = "Database operation failed";
            break;
    }
    const errorSources = [
        {
            path: "",
            message,
        },
    ];
    return {
        statusCode,
        message,
        errorMessages: errorSources,
    };
};
exports.default = handlePrismaKnownError;
//# sourceMappingURL=PrismaKnownError.js.map