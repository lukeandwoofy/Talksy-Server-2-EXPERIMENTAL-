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

// Chat Functionality
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

// Send Message to Firebase
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

// Listen for New Messages
database.ref("messages").on("child_added", (snapshot) => {
  const data = snapshot.val();
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", "received");
  messageElement.textContent = `${new Date(data.timestamp).toLocaleTimeString()}: ${data.message}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
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

// Function to load a song
function loadSong(index) {
  const song = songs[index];
  audioSource.src = song.path;
  audioPlayer.load();
  currentSongDisplay.textContent = `Now Playing: ${song.name}`;
}

// Event Listener for Play Button
playButton.addEventListener("click", () => {
  audioPlayer.play().catch(error => {
    console.error("Error playing audio:", error);
  });
  playButton.disabled = true;
  pauseButton.disabled = false;
});

// Event Listener for Pause Button
pauseButton.addEventListener("click", () => {
  audioPlayer.pause();
  playButton.disabled = false;
  pauseButton.disabled = true;
});

// Event Listener for Next Button
nextButton.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  audioPlayer.play().catch(error => {
    console.error("Error playing next song:", error);
  });
  playButton.disabled = true;
  pauseButton.disabled = false;
});

// Load the First Song Initially
loadSong(currentSongIndex);
