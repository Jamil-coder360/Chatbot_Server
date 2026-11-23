import app from "./app";
import { config } from "./app/config";
import prisma from "./app/config/prisma";
// import config from "./config";
// import prisma from "./config/prisma";

const startServer = async () => {
  try {
    // Connect MongoDB
    await prisma.$connect();

    console.log("MongoDB connected successfully!");

    // Start Express server
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();