import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { otpRouter } from "../modules/otp/otp.route";
import { authRoutes } from "../modules/auth/auth.route";
import { notificationRoute } from "../modules/notification/notification.route";
import { contentRouter } from "../modules/content/content.route";
import { chatRouter } from "../modules/chat/chat.route";

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
  },
  {
    path:"/notification",
    route:notificationRoute
  },
  {
    path:"/content",
    route:contentRouter
  },
  {
  path: "/chats",
  route: chatRouter,
}
    
];

moduleroute.forEach((route) => router.use(route.path, route.route));

export default router;