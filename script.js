// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8MtPcQUY4zko5RfvQGPCliTEnLrOR21w",
  authDomain: "private-chat-experimental.firebaseapp.com",
  databaseURL: "https://private-chat-experimental-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "private-chat-experimental",
  storageBucket: "private-chat-experimental.appspot.com",
  messagingSenderId: "775730349271",
  appId: "1:775730349271:web:c14e0959a1303047df5c92"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Typing Indicator
const messageInput = document.getElementById("message-input");
const typingIndicator = document.getElementById("typing-indicator");

messageInput.addEventListener("input", () => {
  typingIndicator.style.display = "block"; // Show "Typing..." indicator
  clearTimeout(typingIndicator.timeout); // Clear previous timeout

  // Hide indicator after 2 seconds of no typing
  typingIndicator.timeout = setTimeout(() => {
    typingIndicator.style.display = "none"; // Hide indicator
  }, 2000);
});

// Emoji Picker
const emojiButton = document.getElementById("emoji-button");
const picker = new EmojiButton();

picker.on("emoji", (emoji) => {
  messageInput.value += emoji; // Append emoji to the message input
});

emojiButton.addEventListener("click", () => picker.togglePicker(emojiButton));

// Existing Firebase Chat Functionality (Send and Receive Messages)
const chatBox = document.getElementById("chat-box");
const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    const timestamp = Date.now();
    database.ref("messages").push({
      message,
      timestamp,
      sender: currentUser // Include the sender's name
    });
    messageInput.value = "";
  }
});

database.ref("messages").on("child_added", (snapshot) => {
  const data = snapshot.val();
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  if (data.sender === currentUser) {
    // Message sent by the current user
    messageElement.classList.add("sent");
    messageElement.textContent = `${data.message}`;
  } else {
    // Message received from someone else
    messageElement.classList.add("received");
    messageElement.textContent = `${data.sender}: ${data.message}`;
  }

  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
});
