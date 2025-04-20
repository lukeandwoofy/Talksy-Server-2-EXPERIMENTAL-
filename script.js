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

/* Firebase and Chat functionality remain unchanged */
