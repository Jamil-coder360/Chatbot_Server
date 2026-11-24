import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import getUserDetail from "./app/helper/getUserDetail";
import { success } from "zod";
const httpStatus = require("http-status").default;


let connectedUser=[]
const userIdToGetSocketId = new Map<String,String>()
const socketIdToGetUserId = new Map<String,String>()

const getSocketId=(userId:string)=>{
  const socketId =userIdToGetSocketId.get(userId)

  return socketId;
}
const getUserId=(socketId:string)=>{
  const UserId =socketIdToGetUserId.get(socketId)

  return UserId;
}
const initiatSocketServer = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    
    const token = socket?.handshake?.auth?.token || socket?.handshake?.headers?.token 
    const user:any = getUserDetail(token);
    userIdToGetSocketId.set(user?.id , socket?.id)
    socketIdToGetUserId.set(socket?.id , user?.id)
    connectedUser.push(user?.id);

    socket.join(user?.id)

    socket.on("onlineUser", (data ,callback)=>{

      io.emit("onlineUser",connectedUser)

      if(callback){
        callback({
          success:true,
          message:"",
          data:connectedUser

        })
      }

    })
    
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
      userIdToGetSocketId.delete(user?.id)
      socketIdToGetUserId.delete(socket?.id)
    });
  });

  return io;
};

export default initiatSocketServer;
