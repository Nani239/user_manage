const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    // Emit the message to the receiver
    io.to(receiverId).emit("receiveMessage", { senderId, message });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
