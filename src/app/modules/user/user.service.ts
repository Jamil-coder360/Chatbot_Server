const httpStatus = require("http-status").default;

// import AppError from "../../middleware/apperror";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import AppError from "../../error/AppError";
import prisma from "../../config/prisma";
import { config } from "../../config";

import otpService from "../otp/otp.service.js";



const createUser = async (payload: Prisma.UserCreateInput) => {
  try {
    if (!payload.password) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Password is required"
      );
    }

    // 1. Hash password
    const hashedPassword = await bcrypt.hash(
      payload.password,
      Number(config.salt_rounds)
    );

    // 2. Create user
    const user = await prisma.user.create({
      data: {
        ...payload,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // 3. Generate OTP and send email
    const otpResult = await otpService.resendOtp({
      email: user.email,
    });

    // 4. Return verification token
    return {
      email: user.email,
      token: otpResult.token,
    };

} catch (error: unknown) {
  console.error("CREATE USER ERROR:", error);

  if (error instanceof AppError) {
    throw error;
  }

  throw new AppError(
    httpStatus.INTERNAL_SERVER_ERROR,
    error instanceof Error ? error.message : "Failed to create user"
  );
}
};


// const createUser = async (payload: Prisma.UserCreateInput) => {
//   try {
//     if (!payload.password) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
//     }

//     const hashedPassword = await bcrypt.hash(
//       payload.password,
//       Number(config.salt_rounds),
//     );

//     const user = await prisma.user.create({
//       data: {
//         ...payload,
//         password: hashedPassword,
//       },
//     });

//     return user;
//   } catch (error: unknown) {
//     if (error instanceof AppError) {
//       throw error;
//     }

//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to create user",
//     );
//   }
// };

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
  return await prisma.user.findMany({
    where: {
      isDeleted: false,
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      email: true,
      profile: true,
      location: true,
      phoneNumber: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
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