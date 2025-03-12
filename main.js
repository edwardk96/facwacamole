// Select elements
const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById("high-score");
const easyBtn = document.getElementById('easyBtn');
const mediumBtn = document.getElementById('mediumBtn');
const hardBtn = document.getElementById('hardBtn');

let moleInterval = 1000; // Default to Easy

let score = 0;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
highScoreDisplay.textContent = highScore;
let gameActive = false;
let currentMoleIndex = -1;
let moleTimer = null;

// Helper to pick random hole
function getRandomHoleIndex() {
  return Math.floor(Math.random() * holes.length);
}

// Function to place the mole in a random hole
function showMole() {
  // Remove existing mole
  if (currentMoleIndex >= 0) {
    holes[currentMoleIndex].classList.remove('active');
    holes[currentMoleIndex].querySelector('.mole').style.transform = 'translate(-50%, -50%)';
  }

  // Pick a new random hole
  const randomIndex = getRandomHoleIndex();
  currentMoleIndex = randomIndex;
  holes[randomIndex].classList.add('active');

  // Generate a random angle from 0° to 359°
  const randomAngle = Math.floor(Math.random() * 8) * 45;

  // Grab the .mole within the current hole
  const moleImg = holes[currentMoleIndex].querySelector('.mole');

  // Apply the random rotation in addition to centering
  moleImg.style.transform = `translate(-50%, -50%) rotate(${randomAngle}deg)`;

}

// Start game function
function startGame(difficulty) {
  if (gameActive) return; // If already running, do nothing

  gameActive = true;
  score = 0;
  scoreDisplay.textContent = score;

  // Show a new mole every second
  if (difficulty === "easy") {
    moleInterval = 1000; // 1s
  } else if (difficulty === "medium") {
    moleInterval = 800;  // 0.8s
  } else if (difficulty === "hard") {
    moleInterval = 600;  // 0.6s
    hardModeAudio.currentTime = 0; // Restart the song if it was playing
    hardModeAudio.play(); // Start playing the song
    hardModeAudio.volume = 0.8; // Set volume (optional)
    hardModeAudio.play().catch(error => console.log("Autoplay blocked:", error));
  }
  
  clearInterval(moleTimer);
  showMole(); // show first mole immediately
  moleTimer = setInterval(showMole, moleInterval); // Set mole timing
  setTimeout(endGame, 20000); // End game after 20 seconds
}

// Event listener for clicking holes
holes.forEach((hole, index) => {
  hole.addEventListener('click', () => {
    // If the clicked hole is the current mole
    if (index === currentMoleIndex && gameActive) {
      score++;
      scoreDisplay.textContent = score;
      // Hide the mole immediately after a successful whack
      hole.classList.remove('active');
      currentMoleIndex = -1;
    }
  });
});

function updateHighScore() {
if (score > highScore) {
  highScore = score;
  localStorage.setItem("highScore", highScore); // Save new high score
  highScoreDisplay.textContent = highScore;
}
}

function endGame() {
  clearInterval(moleTimer);
  updateHighScore();
  gameActive = false;
  hardModeAudio.pause(); // Stop the song when the game ends
  alert(`Game Over! Final Score: ${score}`);
}

// Event listener for start button
easyBtn.addEventListener('click', () => startGame("easy"));
mediumBtn.addEventListener('click', () => startGame("medium"));
hardBtn.addEventListener('click', () => startGame("hard"));


// edits: 
// Change cursor to a hammer 
// Timer and countdown 
// sound effects? can't touch this
// Difficulty levels?
// mole shouldn't appear at the end
// lives if you miss?
