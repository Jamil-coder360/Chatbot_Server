"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../error/AppError"));
const notFound = (req, res, next) => {
    next(new AppError_1.default(404, `API Not Found: ${req.originalUrl}`));
};
exports.default = notFound;
//# sourceMappingURL=notFound.js.map