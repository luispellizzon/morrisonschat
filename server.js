const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const format = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "MorrisonsChat Bot";

// Run when client connects
io.on("connection", (socket) => {
  // Catch user and room
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    // Welcome current user
    socket.emit(
      "message",
      format(botName, "Welcome to Morrisons Island Campus Chat!")
    );

    // When user connects, display on chat
    socket.broadcast
      .to(user.room)
      .emit("message", format(botName, `${username} joined the chat!`));
  });

  // Listen for message submit on chat
  socket.on("chatMessage", (message) => {
    const currentUser = getCurrentUser(socket.id);
    io.to(currentUser.room).emit(
      "message",
      format(currentUser.username, message)
    );
  });

  // When user disconnects, display on chat
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        format(botName, `${user.username} has left the chat.`)
      );
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server on: ${PORT}`));
