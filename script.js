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

// Join Chat Functionality
const loginButton = document.getElementById("login-button");
const nameInput = document.getElementById("name-input");
const accessCodeInput = document.getElementById("access-code");

loginButton.addEventListener("click", () => {
  const username = nameInput.value.trim();
  const accessCode = accessCodeInput.value.trim();

  if (!username || !accessCode) {
    document.getElementById("error-message").textContent = "Please enter both your name and the access code.";
    return;
  }

  // Optional: Validate access code
  if (accessCode !== "your-access-code") { // Replace with the actual access code or logic
    document.getElementById("error-message").textContent = "Invalid access code.";
    return;
  }

  // Switch to chat screen
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("chat-screen").style.display = "block";

  // Optional: Store user data in Firebase
  database.ref("users").push({ username });

  console.log(`${username} joined the chat.`);
});

// Chat Functionality
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    const timestamp = Date.now();
    database.ref("messages").push({
      message,
      timestamp
    });
    messageInput.value = ""; // Clear input
  }
});

database.ref("messages").on("child_added", (snapshot) => {
  const data = snapshot.val();
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", "received");
  messageElement.textContent = `${new Date(data.timestamp).toLocaleTimeString()}: ${data.message}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
});
