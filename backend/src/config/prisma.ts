import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);

declare global {
  var prisma: PrismaClient | undefined;
}
console.log("SMTP HOST:", process.env.SMTP_HOST);
const prisma =
  global.prisma ||
  new PrismaClient({
    adapter, // This fulfills the "adapter" requirement in Prisma 7
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
