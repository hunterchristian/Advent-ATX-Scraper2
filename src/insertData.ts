import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

function insertData(data) {
  return prismaClient.christianEvents.createMany({})
}
export default insertData;
