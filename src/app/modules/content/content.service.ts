import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import AppError from "../../error/AppError";
const httpStatus = require("http-status").default;



const createContents = async (payload: Prisma.ContentsCreateInput) => {
  const isExists = await prisma.contents.findFirst();
  if (!isExists) {
    const result = await prisma.contents.create({
      data: payload,
    });
    return result;
  }
  return null;
};

const updateContents = async (
  id: string,
  payload: Prisma.ContentsUpdateInput,
) => {
  const result = await prisma.contents.update({
    where: { id },
    data: payload,
  });

  if (!result)
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update contents');
  return result;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getContents = async (query: Record<string, any>) => {
  const result = await prisma.contents.findFirst();

  if (!query?.key) {
    return result;
  }

  const key = query.key as keyof typeof result;

  return result ? { [key]: result[key] } : { [key]: null };
};

const contentService={
    createContents,
    getContents,
    updateContents
}

export default contentService;