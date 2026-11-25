const httpStatus = require("http-status").default;
import prisma from "../../config/prisma";
import AppError from "../../error/AppError";


const getNotification = async (userId: string) => {
  const notification = await prisma.notification.findMany({
    where: { reciverId: userId },
    include: {  
      user: {
        select: {
          id: true,
          name: true,
          profile: true,
          phoneNumber: true,
        },
      },
    },
  });

  return notification;
};
const deleteNotification = async (userId: string) => {
  const notification = await prisma.notification.deleteMany({
    where: { reciverId: userId },
  });

  if (!notification)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Notification delete successfully.',
    );

  return notification;
};
const readNotification = async (userId: string) => {
  const notification = await prisma.notification.updateMany({
    where: { reciverId: userId },
    data: { isRead: true },
  });

  if (!notification)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Notification Read successfully.',
    );

  return notification;
};

const notificationService ={
    getNotification,
    deleteNotification,
    readNotification
}

export default notificationService;