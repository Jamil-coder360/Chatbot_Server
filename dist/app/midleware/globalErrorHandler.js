"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const multer_1 = require("multer");
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("../error/AppError"));
const ZodError_1 = __importDefault(require("../error/ZodError"));
const DuplicateError_1 = __importDefault(require("../error/DuplicateError"));
const PrismaValidationError_1 = __importDefault(require("../error/PrismaValidationError"));
const PrismaKnownError_1 = __importDefault(require("../error/PrismaKnownError"));
const MulterError_1 = __importDefault(require("../error/MulterError"));
const globalErrorHandler = (err, _req, res, _next) => {
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorSources = [
        {
            path: "",
            message: "Something went wrong!",
        },
    ];
    // 1. Zod Validation Error
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, ZodError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorMessages;
    }
    // 2. Prisma Known Request Error
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            // Duplicate Error
            const simplifiedError = (0, DuplicateError_1.default)(err);
            statusCode = simplifiedError.statusCode;
            message = simplifiedError.message;
            errorSources = simplifiedError.errorMessages;
        }
        else {
            // Other Prisma Known Errors
            const simplifiedError = (0, PrismaKnownError_1.default)(err);
            statusCode = simplifiedError.statusCode;
            message = simplifiedError.message;
            errorSources = simplifiedError.errorMessages;
        }
    }
    // 3. Prisma Validation Error
    else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        const simplifiedError = (0, PrismaValidationError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorMessages;
    }
    // 4. Custom App Error
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        errorSources = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    // 5. Multer Error
    else if (err instanceof multer_1.MulterError) {
        const simplifiedError = (0, MulterError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorMessages;
    }
    // 6. General JavaScript Error
    else if (err instanceof Error) {
        message = err.message;
        errorSources = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    // Final JSON Response
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: process.env.NODE_ENV === "development"
            ? err instanceof Error
                ? err.stack
                : undefined
            : null,
    });
};
exports.default = globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map