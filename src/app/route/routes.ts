import { Router } from "express";
import { userRouter } from "../modules/user/user.route";

const router:Router = Router();

const moduleroute = [
      {
    path: "/user",
    route: userRouter,
  }
    
];

moduleroute.forEach((route) => router.use(route.path, route.route));

export default router;