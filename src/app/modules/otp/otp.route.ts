import { Router } from "express";
import { otpControllers } from "./otp.controller";


const router: Router = Router();

router.post(
  '/resend-otp', 
  otpControllers.resendOtp,
);
router.post(
  '/verify-otp',
  otpControllers.verifyOtp
);
export const otpRouter = router;