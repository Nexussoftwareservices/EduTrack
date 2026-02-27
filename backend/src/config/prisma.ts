import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Initialize the Adapter
const adapter = new PrismaPg(pool);

declare global {
  var prisma: PrismaClient | undefined;
}

// 3. Pass the adapter to the constructor
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
