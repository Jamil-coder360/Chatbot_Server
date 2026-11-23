
import { createServer, type Server } from "http";
import colors from "colors";
import app from "./app";
import { config } from "./app/config";
import prisma from "./app/config/prisma";
import initiateSocketServer from "./socket.app";

let server: Server;
let socketHttpServer: Server;

async function main() {
  try {
    // Database connection
    await prisma.$connect();
    console.log("Connected to MongoDB successfully!");

    // Express API server
    server = createServer(app);

    server.listen(Number(config.port), config.ip, () => {
      console.log(
        colors.italic.green.bold(
          `API Server running on http://${config.ip}:${config.port}`,
        ),
      );
    });

    // Separate Socket.IO HTTP server
    socketHttpServer = createServer();

    initiateSocketServer(socketHttpServer);

    socketHttpServer.listen(
      Number(config.socket_port),
      config.ip,
      () => {
        console.log(
          colors.italic.green.bold(
            `Socket Server running on http://${config.ip}:${config.socket_port}`,
          ),
        );
      },
    );
  } catch (err) {
    console.error("Error starting server:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unexpected server error:", err);
  process.exit(1);
});

// Error handling
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);

  server?.close();
  socketHttpServer?.close();

  prisma.$disconnect().finally(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);

  server?.close();
  socketHttpServer?.close();

  prisma.$disconnect().finally(() => process.exit(1));
});
