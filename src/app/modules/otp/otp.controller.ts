import type { Request, Response } from "express";
const httpStatus = require("http-status").default;
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import otpService from "./otp.service.js";

const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await otpService.resendOtp({
    email: req.body.email,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP sent successfully",
    data: result,
  });
});

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.token || req.headers.authorization?.split(" ")[1];

  const result = await otpService.verifyOtp(token as string, req.body.otp);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP verified successfully",
    data: result,
  });
});

export const otpControllers = {
  resendOtp,
  verifyOtp,
};