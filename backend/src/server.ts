import Express from "express";
import { PrismaClient } from "generated/prisma/index.js";
const app = Express();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const PORT = process.env.PORT ?? 5000;
app.listen(PORT, () => console.log("Server running on port : ", PORT));

export default app;
