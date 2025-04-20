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
const errorMessage = document.getElementById("error-message");
const loginScreen = document.getElementById("login-screen");
const chatScreen = document.getElementById("chat-screen");

loginButton.addEventListener("click", () => {
  const username = nameInput.value.trim();
  const accessCode = accessCodeInput.value.trim();

  if (!username || !accessCode) {
    errorMessage.textContent = "Please enter both your name and the access code.";
    return;
  }

  const validAccessCode = "your-access-code"; // Replace with the actual access code
  if (accessCode !== validAccessCode) {
    errorMessage.textContent = "Invalid access code. Please try again.";
    return;
  }

  loginScreen.style.display = "none";
  chatScreen.style.display = "block";

  database.ref("users").push({ username }).then(() => {
    console.log(`${username} joined the chat.`);
  }).catch((error) => {
    console.error("Error storing user in Firebase:", error);
    errorMessage.textContent = "An error occurred while joining the chat.";
  });
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
    messageInput.value = "";
  }
});

database.ref("messages").on("child_added", (snapshot) => {
  const data = snapshot.val();
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", "received");
  messageElement.textContent = `${new Date(data.timestamp).toLocaleTimeString()}: ${data.message}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Music Player Feature
const songs = [
  { name: "Candyland", path: "assets/music/Tobu - Candyland.mp3" },
  { name: "Cloud 9", path: "assets/music/Itro & Tobu - Cloud 9.mp3" }
];
let currentSongIndex = 0;

const audioPlayer = document.getElementById("audio-player");
const audioSource = document.getElementById("audio-source");
const playButton = document.getElementById("play-song");
const pauseButton = document.getElementById("pause-song");
const nextButton = document.getElementById("next-song");
const currentSongDisplay = document.getElementById("current-song");

function loadSong(index) {
  const song = songs[index];
  audioSource.src = song.path;
  audioPlayer.load();
  currentSongDisplay.textContent = `Now Playing: ${song.name}`;
}

playButton.addEventListener("click", () => {
  audioPlayer.play().catch(error => {
    console.error("Error playing audio:", error);
  });
  playButton.disabled = true;
  pauseButton.disabled = false;
});

pauseButton.addEventListener("click", () => {
  audioPlayer.pause();
  playButton.disabled = false;
  pauseButton.disabled = true;
});

nextButton.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  audioPlayer.play().catch(error => {
    console.error("Error playing next song:", error);
  });
  playButton.disabled = true;
  pauseButton.disabled = false;
});

loadSong(currentSongIndex);
