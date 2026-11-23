const httpStatus = require("http-status").default;

// import AppError from "../../middleware/apperror";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import AppError from "../../error/AppError";
import prisma from "../../config/prisma";
import { config } from "../../config";

const createUser = async (payload: Prisma.UserCreateInput) => {
  try {
    if (!payload.password) {
      throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
    }

    const hashedPassword = await bcrypt.hash(
      payload.password,
      Number(config.salt_rounds),
    );

    const user = await prisma.user.create({
      data: {
        ...payload,
        password: hashedPassword,
      },
    });

    return user;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create user",
    );
  }
};

const getUser = async () => {
  const data = null;
  //  [{
  //     id:1,
  // name:"Jon do"
  // }]

  if (!data) {
    throw new AppError(httpStatus.NOT_FOUND, "User Data Not found");
  }
  return data;
};

const getAllUsers = async () => {
  return await prisma.user.findMany();
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

const updateUser = async (
  id: string,
  payload: Partial<Prisma.UserUpdateInput>,
) => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: payload,
  });
  return updatedUser;
};

const deleteUser = async (id: string) => {
  const deletedUser = await prisma.user.delete({
    where: { id },
  });
  return deletedUser;
};

const userService = {
  getUser,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

export default userService;