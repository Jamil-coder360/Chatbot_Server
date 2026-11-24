const httpStatus = require("http-status").default;
import { config } from "../config";
import prisma from "../config/prisma";
import AppError from "../error/AppError";
import * as jwt from 'jsonwebtoken';

const getUserDetail = async(token:String)=>{
    if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'you are not authorized!');
  }

  const decode: any =  jwt.verify(
    token as string,
    config.jwt_secret as string,
  );
  const user = await prisma.user.findUnique({
    where: { id: decode.id },
    select: { id: true, email: true, role: true, profile: true, name: true },
  });

  return user;

}

export default getUserDetail;