
import type { Request, Response } from "express";
import chatService from "./chat.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const httpStatus = require("http-status").default;

const getOrCreateChat = catchAsync(
  async (req: Request, res: Response) => {
    const result = await chatService.getOrCreateChat(
      req.user!.id as string,
      req.params.userId as string
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Chat fetched successfully",
      data: result,
    });
  }
);

const getMyChats = catchAsync(
  async (req: Request, res: Response) => {
    const result = await chatService.getMyChats(
      req.user!.id as string
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Chats fetched successfully",
      data: result,
    });
  }
);

const getMessages = catchAsync(
  async (req: Request, res: Response) => {
    const result = await chatService.getMessages(
      req.params.chatId as string,
      req.user!.id as string
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Messages fetched successfully",
      data: result,
    });
  }
);

const sendMessage = catchAsync(
  async (req: Request, res: Response) => {
    const { text, imgUrl } = req.body;

    const result = await chatService.sendMessage(
      req.params.chatId as string,
      req.user!.id as string,
      text,
      imgUrl
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Message sent successfully",
      data: result,
    });
  }
);

const markMessagesAsSeen = catchAsync(
  async (req: Request, res: Response) => {
    const result = await chatService.markMessagesAsSeen(
      req.params.chatId as string,
      req.user!.id as string
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Messages marked as seen",
      data: result,
    });
  }
);

const chatController = {
  getOrCreateChat,
  getMyChats,
  getMessages,
  sendMessage,
  markMessagesAsSeen,
};

export default chatController;
