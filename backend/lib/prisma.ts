/**
 * backend/lib/prisma.ts
 *
 * Singleton PrismaClient using the PrismaPg driver adapter (Prisma 7).
 * Import this in server-side code only — never in browser/client components.
 *
 * Usage:
 *   import { prisma } from "../lib/prisma.js";
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
