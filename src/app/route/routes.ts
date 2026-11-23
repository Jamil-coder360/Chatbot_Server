import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { otpRouter } from "../modules/otp/otp.route";

const router:Router = Router();

const moduleroute = [
      {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/otp",
    route: otpRouter,
  }
    
];

moduleroute.forEach((route) => router.use(route.path, route.route));

export default router;