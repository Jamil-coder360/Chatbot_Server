import { Server } from "socket.io";
import { Server as HttpServer } from "http";

const initiatSocketServer = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("join", async (data) => {
      io.emit("getData", {
        data: `My Name is : ${data?.name}`,
        email: "example@gail.com",
      });
      console.log(data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return io;
};

export default initiatSocketServer;
