// Select elements
const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const startBtn = document.getElementById('startBtn');

let score = 0;
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
  }

  // Pick a new random hole
  const randomIndex = getRandomHoleIndex();
  currentMoleIndex = randomIndex;
  holes[randomIndex].classList.add('active');
}

// Start game function
function startGame() {
  if (gameActive) return; // If already running, do nothing

  gameActive = true;
  score = 0;
  scoreDisplay.textContent = score;

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

// Event listener for start button
startBtn.addEventListener('click', () => {
  startGame();
});

// OPTIONAL: You might want to add a stop or “end game” feature after a certain time
// setTimeout(() => {
//   clearInterval(moleTimer);
//   gameActive = false;
//   alert(`Game Over! Final Score: ${score}`);
// }, 10000); // 10 seconds game duration


// edits: 
// Change cursor to a hammer 
// Make it feel like a 1980s video game
// Add pictures of a mole 
// Timer and countdown 
// High score?
// sound effects?
// Difficulty levels?
