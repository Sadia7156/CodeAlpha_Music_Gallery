// Song data for each player
const songs = [
  { name: "Jingle Bells", artist: "The Soundlings", src: "Jingle Bells - The Soundlings.mp3 " },
  { name: "Pick Up", artist: "Adam MacDougall", src: "Pick Up - Adam MacDougall.mp3" },
  { name: "Silent Night", artist: "The Soundlings", src: "Silent Night - The Soundlings.mp3" }
];

// DOM Elements
const players = document.querySelectorAll(".music_player");
let currentPlayerIndex = null; // Track the currently active player

// Function to load a song into the current player
function loadSong(player, song) {
  const audio = player.querySelector("audio");
  const songName = player.querySelector(".song-name");
  const artistName = player.querySelector(".artist-name");

  audio.src = song.src;
  songName.textContent = song.name || "Unknown Song";
  artistName.textContent = song.artist || "Unknown Artist";
  
  // Reset the slider to the start position
  const slider = player.querySelector(".slider");
  slider.value = 0;
  const currentTimeElem = player.querySelector(".current_time");
  currentTimeElem.textContent = "00:00"; // Reset current time display
}

// Toggle play/pause for the selected player
function togglePlayPause(player, index) {
  const audio = player.querySelector("audio");
  const playBtn = player.querySelector(".play_btn i");
  const isPlaying = !audio.paused;

  if (isPlaying) {
    audio.pause();
    playBtn.className = "fa-solid fa-play";
    currentPlayerIndex = null; // No player is active
    resetFocus(); // Reset all players to normal
  } else {
    audio.play();
    playBtn.className = "fa-solid fa-pause";
    currentPlayerIndex = index; // Update the active player index
    applyBlurAndZoom(index); // Blur other players and zoom in the active one
  }
}

// Reset all players to normal state
function resetFocus() {
  players.forEach((player) => {
    player.classList.remove("blur", "active");
  });
}

// Apply blur and zoom to all but the active player
function applyBlurAndZoom(activeIndex) {
  players.forEach((player, index) => {
    if (index === activeIndex) {
      player.classList.add("active"); // Zoom in the active player
      player.classList.remove("blur"); // Ensure the active player is not blurred
    } else {
      player.classList.add("blur"); // Blur the other players
      player.classList.remove("active"); // Ensure the others are not zoomed in
    }
  });
}

// Update the slider and current time display
function updateSlider(player) {
  const audio = player.querySelector("audio");
  const slider = player.querySelector(".slider");
  const currentTimeElem = player.querySelector(".current_time");
  const songDurationElem = player.querySelector(".song_duration");

  if (audio.duration) {
    const currentTime = audio.currentTime;
    const duration = audio.duration;

    // Update slider
    slider.value = (currentTime / duration) * 100;

    // Update current time and song duration display
    currentTimeElem.textContent = formatTime(currentTime);
    songDurationElem.textContent = formatTime(duration);
  }
}

// Format for time 
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

// Add event listeners to each player
players.forEach((player, index) => {
  const playBtn = player.querySelector(".play_btn");
  const nextBtn = player.querySelector(".next_btn");
  const prevBtn = player.querySelector(".prev_btn");
  const slider = player.querySelector(".slider");
  const audio = player.querySelector("audio");

  // Play/pause button
  playBtn.addEventListener("click", () => {
    togglePlayPause(player, index);
  });

  // Next button
  nextBtn.addEventListener("click", () => {
    const nextIndex = (index + 1) % songs.length;
    loadSong(players[nextIndex], songs[nextIndex]);
    togglePlayPause(players[nextIndex], nextIndex);
  });

  // Previous button
  prevBtn.addEventListener("click", () => {
    const prevIndex = (index - 1 + songs.length) % songs.length;
    loadSong(players[prevIndex], songs[prevIndex]);
    togglePlayPause(players[prevIndex], prevIndex);
  });

  // Slider input
  slider.addEventListener("input", () => {
    audio.currentTime = (slider.value / 100) * audio.duration;
  });

  // Update slider and current time
  audio.addEventListener("timeupdate", () => {
    updateSlider(player);
  });

  // Initial load of the song
  loadSong(player, songs[index]);
});

// On page load, reset focus for all players
resetFocus();
