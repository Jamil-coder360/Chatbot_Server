const httpStatus = require("http-status").default;
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config";
import AppError from "../../error/AppError";
import prisma from "../../config/prisma";
import moment from "moment/moment";
import { generateOTP } from "../../utils/otpGenatator";
import { sendMail } from "../../utils/mailsender";
import  path from "path";
import  fs from "fs";

const resendOtp = async (payload: { email: string }) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: payload?.email,
      },
    });

    if (!user)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "you are not registered with this mail",
      );

    const otp = generateOTP();
    const expiresAt = moment().utc().add(3, "minute");

    const updateOtp = await prisma.verification.upsert({
      where: {
        userId: user.id,
      },
      update: {
        otp: Number(otp),
        expiredAt: expiresAt.toDate(),
        status: false,
      },

      create: {
        userId: user.id,
        otp: Number(otp),
        expiredAt: expiresAt.toDate(),
        status: false,
      },
    });

    if (!updateOtp)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed to resend OTP. Please try again later",
      );

    const otpPayload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(otpPayload, config.jwt_secret as string, {
      expiresIn: "3m",
    });

    const otpEmailPath = path.join(
      __dirname,
      "../../../public/view/verification.html",
    );

    await sendMail(
      user?.email,
      "Your One Time OTP",
      fs
        .readFileSync(otpEmailPath, "utf8")
        .replace("{{email}}", user?.email)
        .replace("{{otp}}", otp)
        .replace("{{name}}", user?.name),
    );
    return {
      token: token,
    };
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error?.message);
  }
};

const verifyOtp = async (token: string, otp: number) => {
  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, "Token is required");
  }
  let decodedData: JwtPayload;
  try {
    decodedData = jwt.verify(token, config.jwt_secret as string) as JwtPayload;
  } catch (error: any) {
    throw new AppError(
      httpStatus?.INTERNAL_SERVER_ERROR,
      error?.message || "server internal error",
    );
  }

    const user = await prisma.user.findUnique({
    where: {
      id: decodedData?.id as string,
    },
    include: {
      verification: true,
    },
  });

   if (!user)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "you are not registered with this mail",
    );

  if (
    user?.verification?.expiredAt &&
    moment().utc().isAfter(moment(user?.verification?.expiredAt))
  )
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "OTP has expired. Please request a new OTP.",
    );

  if (user?.verification?.otp !== otp)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid OTP. Please try again.",
    );
     const result = await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      verification: {
        update: {
          data: {
            status: true,
          },
        },
      },
    },
    include: {
      verification: true,
    },
  });

  const jwtPayload = {
    id: result?.id,
    email: result?.email,
    role: result?.role,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: "1h",
  });

  return {
    id: result?.id,
    email: result?.email,
    accessToken,
  };

};

const otpService = {
  resendOtp,
  verifyOtp,
};

export default otpService;
