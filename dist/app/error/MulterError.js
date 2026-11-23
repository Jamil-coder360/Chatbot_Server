"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleMulterError = (err) => {
    let statusCode = 400;
    let message = "File upload failed";
    switch (err.code) {
        case "LIMIT_FILE_SIZE":
            statusCode = 413;
            message = "File size limit exceeded";
            break;
        case "LIMIT_FILE_COUNT":
            statusCode = 400;
            message = "Too many files uploaded";
            break;
        case "LIMIT_UNEXPECTED_FILE":
            statusCode = 400;
            message = "Unexpected file field";
            break;
        case "LIMIT_FIELD_COUNT":
            message = "Too many fields";
            break;
        case "LIMIT_FIELD_KEY":
            message = "Field name is too long";
            break;
        case "LIMIT_FIELD_VALUE":
            message = "Field value is too long";
            break;
        case "LIMIT_PART_COUNT":
            message = "Too many multipart parts";
            break;
        default:
            message = "File upload failed";
            break;
    }
    const errorSources = [
        {
            path: err.field || "",
            message,
        },
    ];
    return {
        statusCode,
        message,
        errorMessages: errorSources,
    };
};
exports.default = handleMulterError;
//# sourceMappingURL=MulterError.js.map