"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
    // Prisma P2002 duplicate error
    const target = err?.meta?.target;
    let field = "Field";
    if (Array.isArray(target)) {
        field = target.join(", ");
    }
    else if (typeof target === "string") {
        field = target;
    }
    const errorSources = [
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
exports.default = handleDuplicateError;
//# sourceMappingURL=DuplicateError.js.map