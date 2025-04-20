const firebaseConfig = {
  apiKey: "AIzaSyD8MtPcQUY4zko5RfvQGPCliTEnLrOR21w",
  authDomain: "private-chat-experimental.firebaseapp.com",
  databaseURL: "https://private-chat-experimental-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "private-chat-experimental",
  storageBucket: "private-chat-experimental.firebasestorage.app",
  messagingSenderId: "775730349271",
  appId: "1:775730349271:web:c14e0959a1303047df5c92"
};

// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push, remove, onChildAdded, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// DOM Elements
const loginButton = document.getElementById("login-button");
const accessCodeInput = document.getElementById("access-code");
const nameInput = document.getElementById("name-input");
const errorMessage = document.getElementById("error-message");
const loginScreen = document.getElementById("login-screen");
const chatScreen = document.getElementById("chat-screen");
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const typingIndicator = document.getElementById("typing-indicator");
const adminButton = document.getElementById("admin-button");
const adminPanel = document.getElementById("admin-panel");
const clearChatButton = document.getElementById("clear-chat-button");
const toggleDarkModeButton = document.getElementById("toggle-dark-mode");

let currentUserName = ""; // Store the current user's name
let currentAccessCode = "A330"; // Default access code
const adminPassword = "admin123"; // Admin password

// Login functionality
loginButton.addEventListener("click", () => {
  const enteredName = nameInput.value.trim();
  const enteredCode = accessCodeInput.value.trim();

  if (!enteredName) {
    errorMessage.textContent = "Please enter your name.";
    return;
  }

  if (enteredCode === currentAccessCode) {
    currentUserName = enteredName;

    // Sign in anonymously with Firebase Authentication
    signInAnonymously(auth).then(() => {
      loginScreen.style.display = "none";
      chatScreen.style.display = "block";

      // Listen for new messages
      const messagesRef = ref(database, 'messages');
      onChildAdded(messagesRef, (snapshot) => {
        const message = snapshot.val();
        const formattedTime = new Date(message.timestamp).toLocaleTimeString();
        addMessage(message.user, message.text, formattedTime, message.user === currentUserName ? "sent" : "received");
      });
    }).catch((error) => {
      errorMessage.textContent = `Login failed: ${error.message}`;
    });
  } else {
    errorMessage.textContent = "Incorrect code. Please try again.";
  }
});

// Admin panel access functionality
adminButton.addEventListener("click", () => {
  const enteredPassword = prompt("Enter admin password:");
  if (enteredPassword === adminPassword) {
    adminPanel.style.display = "block";
    alert("Welcome to the admin panel!");
  } else {
    alert("Incorrect password. Access denied.");
  }
});

// Clear chat functionality (admin only)
clearChatButton.addEventListener("click", () => {
  const messagesRef = ref(database, 'messages');
  remove(messagesRef).then(() => {
    chatBox.innerHTML = ""; // Clear the chat box UI
    alert("All messages have been cleared.");
  });
});

// Toggle dark mode functionality
toggleDarkModeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Send message functionality
sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    const messagesRef = ref(database, 'messages');
    push(messagesRef, {
      user: currentUserName,
      text: message,
      timestamp: serverTimestamp()
    });
    messageInput.value = "";
  }
});

// Function to display messages
function addMessage(name, message, timestamp, type) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", type);
  messageElement.innerHTML = `<strong>${name}:</strong> ${message} <span class="timestamp">${timestamp}</span>`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}
