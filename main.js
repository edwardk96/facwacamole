// Select elements
const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById("high-score");
const startBtn = document.getElementById('startBtn');

let score = 0;
let highScore = localStorage.getItem("highScore") || 0; // Get saved high score or default to 0
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
function startGame() {
  if (gameActive) return; // If already running, do nothing

  gameActive = true;
  score = 0;
  scoreDisplay.textContent = score;
  highScoreDisplay.textContent = highScore;

  // Show a new mole every second
  showMole(); // show first mole immediately
  moleTimer = setInterval(showMole, 1000);
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

if (score > highScore) {
  highScore = score;
  highScoreDisplay.textContent = highScore;
  localStorage.setItem("highScore", highScore); // Save new high score
}

// Event listener for start button
startBtn.addEventListener('click', () => {
  startGame();
});

// setTimeout(() => {
//   clearInterval(moleTimer);
//   gameActive = false;
//   alert(`Game Over! Final Score: ${score}`);
// }, 10000); // 10 seconds game duration


// edits: 
// Change cursor to a hammer 
// Make it feel like a 1980s video game
// Timer and countdown 
// High score?
// sound effects?
// Difficulty levels?
// lives if you miss?
