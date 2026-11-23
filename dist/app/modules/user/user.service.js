"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../config/prisma"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const createUser = async (payload) => {
    const { status: httpStatus } = await import("http-status");
    if (!payload.password) {
        throw new AppError_1.default(httpStatus.BAD_REQUEST, "Password is required");
    }
    return prisma_1.default.user.create({
        data: { ...payload, password: payload.password }
    });
};
const userService = { createUser };
exports.default = userService;
//# sourceMappingURL=user.service.js.map