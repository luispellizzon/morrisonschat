const chatForm = document.getElementById("chat-form");
const chatMessagesDiv = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");

// Get username and room from URL query
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chat room
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputRoomUsers(users);
});

// Message from server
socket.on("message", (message) => {
  outputMessage(message);
  console.log(message);

  // Scroll to message
  chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = e.target.elements.msg.value;

  // Emit message to the server
  socket.emit("chatMessage", message);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message function to DOM
const outputMessage = ({ text, username, time }) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">${username} <span>${time}</span></p>
    <p class="text">
      ${text}
    </p>
    `;
  document.querySelector(".chat-messages").appendChild(div);
};

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to list
function outputRoomUsers(users) {
  usersList.innerHTML = `
    ${users
      .map((user) => {
        return `<li>${user.username}</li>`;
      })
      .join("")}
    `;
}
