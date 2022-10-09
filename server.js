const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const format = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "MorrisonsChat Bot";

// Run when client connects
io.on("connection", (socket) => {
  // Welcome current user
  socket.emit(
    "message",
    format(botName, "Welcome to Morrisons Island Campus Chat!")
  );

  // When user connects, display on chat
  socket.broadcast.emit("message", format(botName, "A user joined the chat!"));

  // When user disconnects, display on chat
  socket.on("disconnect", () => {
    io.emit("message", format(botName, "A user left the chat"));
  });

  // Listen for message submit on chat
  socket.on("chatMessage", (message) => {
    io.emit("message", format("USER", message));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server on: ${PORT}`));
