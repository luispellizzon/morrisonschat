const chatForm = document.getElementById("chat-form");
const chatMessagesDiv = document.querySelector(".chat-messages");

const socket = io();

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
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">Mary <span>9:15pm</span></p>
    <p class="text">
      ${message}
    </p>
    `;
  document.querySelector(".chat-messages").appendChild(div);
};
