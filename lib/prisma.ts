
import postgres from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";
import contractJson from "./generated/prisma/contract.json" with { type: "json" };
import type { Contract } from "./generated/prisma/contract";

export const contract = contractFromJson<Contract>(contractJson);
const createDb = () =>
  postgres({
    contract,
    url: process.env.DATABASE_URL,
  });

type PrismaDb = ReturnType<typeof createDb>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaDb | undefined;
};

export const db = globalForPrisma.prisma ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}