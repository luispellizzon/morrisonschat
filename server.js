const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", (socket) => {
  // Welcome current user
  socket.emit("message", "Welcome to MorrisonsChat!");

  // When user connects, display on chat
  socket.broadcast.emit("message", "A user joined the chat!");

  // When user disconnects, display on chat
  socket.on("disconnect", () => {
    io.emit("message", "User left the chat");
  });

  // Listen for message submit on chat
  socket.on("chatMessage", (message) => {
    io.emit("message", message);
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server on: ${PORT}`));
