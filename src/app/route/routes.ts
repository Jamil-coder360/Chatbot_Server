import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { otpRouter } from "../modules/otp/otp.route";
import { authRoutes } from "../modules/auth/auth.route";

const router:Router = Router();

const moduleroute = [
      {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/otp",
    route: otpRouter,
  },{
    path: "/auth",
    route: authRoutes,
  }
    
];

moduleroute.forEach((route) => router.use(route.path, route.route));

export default router;