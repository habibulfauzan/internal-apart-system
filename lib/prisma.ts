import { PrismaClient } from "./generated/prisma";
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export default globalForPrisma.prisma || new PrismaClient();
