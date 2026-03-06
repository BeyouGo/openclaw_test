import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../config";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg(env.DATABASE_URL);

export const prisma = new PrismaClient({ adapter });
