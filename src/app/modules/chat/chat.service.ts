
import prisma from "../../config/prisma";
import AppError from "../../error/AppError";

const isValidObjectId = (id: string) =>
  /^[0-9a-fA-F]{24}$/.test(id);

// Create or find a one-to-one conversation
const getOrCreateChat = async (
  currentUserId: string,
  otherUserId: string
) => {
  if (!isValidObjectId(otherUserId)) {
    throw new AppError(400, "Invalid user ID");
  }

  if (currentUserId === otherUserId) {
    throw new AppError(400, "You cannot chat with yourself");
  }

  const otherUser = await prisma.user.findFirst({
    where: {
      id: otherUserId,
      isDeleted: false,
      status: "ACTIVE",
    },
    select: { id: true },
  });

  if (!otherUser) {
    throw new AppError(404, "User not found");
  }

  const existingChat = await prisma.chat.findFirst({
    where: {
      AND: [
        {
          participant: {
            some: { userId: currentUserId },
          },
        },
        {
          participant: {
            some: { userId: otherUserId },
          },
        },
      ],
    },
    include: {
      participant: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profile: true,
            },
          },
        },
      },
    },
  });

  if (existingChat) {
    if (existingChat.status === "Block") {
      throw new AppError(403, "This chat is blocked");
    }

    return existingChat;
  }

  const chat = await prisma.chat.create({
    data: {
      userId: currentUserId,
      status: "Active",
      participant: {
        create: [
          { userId: currentUserId },
          { userId: otherUserId },
        ],
      },
    },
    include: {
      participant: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profile: true,
            },
          },
        },
      },
    },
  });

  return chat;
};

// Get logged-in user's conversations
const getMyChats = async (userId: string) => {
  return prisma.chat.findMany({
    where: {
      participant: {
        some: { userId },
      },
    },
    include: {
      participant: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profile: true,
            },
          },
        },
      },
      messages: {
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

// Get messages of a conversation
const getMessages = async (
  chatId: string,
  userId: string
) => {
  if (!isValidObjectId(chatId)) {
    throw new AppError(400, "Invalid chat ID");
  }

  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      participant: {
        some: { userId },
      },
    },
  });

  if (!chat) {
    throw new AppError(404, "Chat not found");
  }

  return prisma.message.findMany({
    where: { chatId },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          profile: true,
        },
      },
      reciver: {
        select: {
          id: true,
          name: true,
          profile: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

// Send a message
const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string,
  imgUrl?: string
) => {
  if (!isValidObjectId(chatId)) {
    throw new AppError(400, "Invalid chat ID");
  }

  if (!text?.trim() && !imgUrl) {
    throw new AppError(400, "Message text or image is required");
  }

  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      participant: {
        some: { userId: senderId },
      },
    },
    include: {
      participant: true,
    },
  });

  if (!chat) {
    throw new AppError(404, "Chat not found");
  }

  if (chat.status === "Block") {
    throw new AppError(403, "This chat is blocked");
  }

  const receiver = chat.participant.find(
    (participant) => participant.userId !== senderId
  );

  if (!receiver) {
    throw new AppError(400, "Chat receiver not found");
  }

  const message = await prisma.message.create({
    data: {
      chatId,
      senderId,
      reciverId: receiver.userId,
      text: text?.trim() || null,
      imgUrl: imgUrl || null,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          profile: true,
        },
      },
      reciver: {
        select: {
          id: true,
          name: true,
          profile: true,
        },
      },
    },
  });

  await prisma.chat.update({
    where: { id: chatId },
    data: { status: "Active" },
  });

  return message;
};

// Mark received messages as seen
const markMessagesAsSeen = async (
  chatId: string,
  userId: string
) => {
  if (!isValidObjectId(chatId)) {
    throw new AppError(400, "Invalid chat ID");
  }

  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      participant: {
        some: { userId },
      },
    },
  });

  if (!chat) {
    throw new AppError(404, "Chat not found");
  }

  return prisma.message.updateMany({
    where: {
      chatId,
      reciverId: userId,
      isSeen: false,
    },
    data: {
      isSeen: true,
    },
  });
};

const chatService = {
  getOrCreateChat,
  getMyChats,
  getMessages,
  sendMessage,
  markMessagesAsSeen,
};

export default chatService;
