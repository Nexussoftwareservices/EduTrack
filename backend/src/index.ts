import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import prisma from "./config/prisma";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    await prisma.institute.create({
      data: {
        name: "Test Institute",
        email: "test@inst.com",
        phone: "1234567890",
        status: "ACTIVE",
      },
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Starting the server
startServer();

process.on("SIGINT", async () => {
  console.log("🛑 Shutting down server...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
