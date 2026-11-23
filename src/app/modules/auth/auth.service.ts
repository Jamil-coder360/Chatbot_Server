const httpStatus = require("http-status").default;
import { email } from "zod";
import jwt, { SignOptions } from "jsonwebtoken";
import { isPasswordValid } from "./auth.utils";
import bcrypt from "bcrypt";
import moment from "moment";
import path from "path";
import { sendMail } from "../../utils/mailsender";
import fs from "fs";
import prisma from "../../config/prisma";
import { generateOTP } from "../../utils/otpGenatator";
import { config } from "../../config";
import AppError from "../../error/AppError";


const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
    include: {
      verification: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User not found with this email"
    );
  }

  // if (!user.verification?.status) {
  //   throw new AppError(
  //     httpStatus.UNAUTHORIZED,
  //     "Your account is not verified"
  //   );
  // }

  if (user.isDeleted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your account is deleted or blocked"
    );
  }

  if (user.status === "INACTIVE") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your account is inactive"
    );
  }

  if (!user.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password is not set for this account"
    );
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid email or password"
    );
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    password: user.password,
    role: user.role,
  };

  const options: any = {
    expiresIn: (config.jwt_access_expires_in || "3d") as SignOptions["expiresIn"],
  };

  const refreshTokenOptions: any = {
    expiresIn: (config.jwt_refresh_expires_in || "7d") as SignOptions["expiresIn"],
  };

  const accessToken = jwt.sign(
    jwtPayload,
    config.jwt_secret as string,
    options
  );

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_secret as string,
    refreshTokenOptions
  );

  return {
    accessToken,
    refreshToken,
  };
};


const changePassword = async (
  id: string,
  payload: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  },
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) throw new AppError(httpStatus.BAD_REQUEST, "user not found");
  if (user.isDeleted)
    throw new AppError(httpStatus.BAD_REQUEST, "this user account is delated ");
  if (user.status === "INACTIVE")
    throw new AppError(httpStatus.BAD_REQUEST, "this user account is inactive");
  if (isPasswordValid(payload.oldPassword, user.password as string) === false)
    throw new AppError(httpStatus.BAD_REQUEST, "old password is incorrect");
  if (payload.newPassword !== payload.confirmPassword)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "new and confirm password is not match ",
    );
  if (payload.oldPassword === payload.newPassword)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "old and new password can't be same ",
    );

  const passwordHashed = await bcrypt.hash(
    payload.newPassword,
    config.salt_rounds as number,
  );
  const updateUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      password: passwordHashed,
    },
  });
  return {
    user: updateUser?.name,
    email: updateUser?.email,
    id: updateUser?.id,
  };
};

const forgatePassword = async (payload: { email: string }) => {
  const user = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });
  if (!user) throw new AppError(httpStatus.BAD_REQUEST, "user not found");
  if (user.isDeleted)
    throw new AppError(httpStatus.BAD_REQUEST, "user is deleted or block  ");
  if (user.status === "INACTIVE")
    throw new AppError(httpStatus.BAD_REQUEST, "this user is inactive");

  const jwtPayload = {
    id: user?.id,
    email: user?.email,
    role: user?.role,
  };
  const otpToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: "3m",
  });
  const otp = generateOTP();
  const expirationTime = moment().utc().add(3, "m");
  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      needToPasswordChange: true,
      verification: {
        update: {
          data: {
            otp: Number(otp),
            expiredAt: expirationTime.toDate(),
          },
        },
      },
    },
    include: {
      verification: true,
    },
  });

  const otpEmailPath = path.join(
    __dirname,
    "../../../../public/view/forgetPass.html",
  );

  await sendMail(
    user?.email,
    "Reset Your Password",
    fs
      .readFileSync(otpEmailPath, "utf8")
      .replace("{{user_name}}", user.name)
      .replace("{{otp_code}}", otp),
  );

  return {
    otpToken,
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      id: updatedUser.id,
    },
  };
};

const authService = {
  login,
  changePassword,
  forgatePassword
};

export default authService;