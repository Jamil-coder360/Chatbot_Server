"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const haldleZodError = (error) => {
    const errors = error.issues.map((issue) => {
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
exports.default = haldleZodError;
//# sourceMappingURL=ZodError.js.map