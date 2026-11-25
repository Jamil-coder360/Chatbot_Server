
import { Router } from "express";
import auth from "../../midleware/auth";
import chatController from "./chat.controller";

const router: Router = Router();

router.get("/", auth(), chatController.getMyChats);

router.post(
  "/:userId",
  auth(),
  chatController.getOrCreateChat
);

router.get(
  "/:chatId/messages",
  auth(),
  chatController.getMessages
);

router.post(
  "/:chatId/messages",
  auth(),
  chatController.sendMessage
);

router.patch(
  "/:chatId/read",
  auth(),
  chatController.markMessagesAsSeen
);

export const chatRouter = router;
