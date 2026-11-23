"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./user.controller"));
const router = (0, express_1.Router)();
router.post("/", user_controller_1.default.createUser);
// router.get("/", userController.getAllUsers);
// router.get("/:id", userController.getUserById);
// router.patch("/:id", userController.updateUser);
// router.delete("/:id", userController.deleteUser);
exports.userRouter = router;
//# sourceMappingURL=user.route.js.map