// Defined DOM elements
const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById("high-score");
const buttonsContainer = document.querySelector('.difficulty-buttons');
const hardModeAudio = document.getElementById('hardModeAudio');
const warningBanner = document.getElementById('audio-warning');

// Declare global variables and set default values 
let selectedDifficulty = "easy";

let score = 0;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
highScoreDisplay.textContent = highScore;

let gameActive = false;
let currentMoleIndex = -1;
let moleTimer = null;

// function used to play music in hard mode 
function tryToPlay() {
  
  if (hardModeAudio) {
    hardModeAudio.volume = 0.4;
    hardModeAudio.currentTime = 19;
    hardModeAudio.play()
  }  
}

// Show audio warning when hovering over the hard mode button 
hardBtn.addEventListener('mouseenter', () => {
  warningBanner.classList.add('show');
});

hardBtn.addEventListener('mouseleave', () => {
  warningBanner.classList.remove('show');
});

// Core game mechanics 
// Helper to pick random hole
function getRandomHoleIndex() {
  return Math.floor(Math.random() * holes.length);
}

// Function to place the mole in a random hole
function showMole() {
  // Remove existing mole
  if (currentMoleIndex >= 0) {
    holes[currentMoleIndex].classList.remove('active', 'disco');
    holes[currentMoleIndex].querySelector('.mole').style.transform = 'translate(-50%, -50%)';
  }

  // Pick a new random hole
  const randomIndex = getRandomHoleIndex();
  currentMoleIndex = randomIndex;
  holes[randomIndex].classList.add('active');

  if (selectedDifficulty === "hard") {
    holes[randomIndex].classList.add('disco');
  }

  // Generate a random angle in 45 degree increments
  const randomAngle = Math.floor(Math.random() * 8) * 45;

  // Grab the mole image within the current hole
  const moleImg = holes[currentMoleIndex].querySelector('.mole');

  // Apply the random rotation in addition to centering
  moleImg.style.transform = `translate(-50%, -50%) rotate(${randomAngle}deg)`;

  // Increment the player's score for each successful click 
  moleImg.onclick = () => {
    if (gameActive) {
      score++;
      scoreDisplay.textContent = score;

      // Hide the mole immediately after a successful whack
      holes[currentMoleIndex].classList.remove('active', 'disco');
      currentMoleIndex = -1;
    }
  };

}

// Start game workflow 
function selectDifficulty(difficulty, clickedButton) {
  selectedDifficulty = difficulty;

  // Set mole speed based on difficulty
  if (difficulty === "easy") {
    moleInterval = 1000;
  } else if (difficulty === "medium") {
    moleInterval = 800;
  } else if (difficulty === "hard") {
    moleInterval = 600;
  }

  // Blink the clicked button
  clickedButton.classList.add('blinking');

  // After blinking, hide buttons and start countdown
  setTimeout(() => {
    clickedButton.classList.remove('blinking');

    buttonsContainer.style.display = 'none';

    // Create countdown text
    const countdownText = document.createElement('p');
    countdownText.id = 'countdown-text';
    buttonsContainer.parentNode.appendChild(countdownText);

    startCountdown(countdownText);  // Fine to call function defined below as JS will hoist functions to the top of their scope 
  }, 600);
}

function startCountdown(countdownText) {
  let countdownSequence = ["READY", "SET", "GO!"];
  let index = 0;

  countdownText.textContent = countdownSequence[index];

  let countdownInterval = setInterval(() => {
    index++;
    if (index < countdownSequence.length) {
      countdownText.textContent = countdownSequence[index];
    } else {
      clearInterval(countdownInterval);
      startGame(countdownText, selectedDifficulty); // Start game after "GO!"
    }
  }, 800);
}

// Function to start game & timer after "Go"
function startGame(countdownText, difficulty) {
  if (difficulty === "hard") tryToPlay();
  gameActive = true;
  score = 0;
  scoreDisplay.textContent = score;

  let timeLeft = 20; // Game duration
  countdownText.textContent = `Time Left: ${timeLeft}`;

  let gameTimer = setInterval(() => {
    timeLeft--;
    countdownText.textContent = `Time Left: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(gameTimer);
      endGame();
    }
  }, 1000);

  clearInterval(moleTimer);
  showMole();
  moleTimer = setInterval(showMole, moleInterval);
}

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
  
  if (currentMoleIndex >= 0) {
    const currentHole = holes[currentMoleIndex];
    currentHole.classList.remove('active', 'disco');
    currentMoleIndex = -1;
  }

  if (hardModeAudio) {
    hardModeAudio.pause();
    hardModeAudio.currentTime = 0;
  }
  
  // Show difficulty buttons again
  buttonsContainer.style.display = 'block'; // Show buttons again
  document.getElementById('countdown-text')?.remove(); // Remove countdown text

  alert(`Game Over! Final Score: ${score}`);
}

// Event listener for start button
easyBtn.addEventListener('click', (e) => selectDifficulty("easy", e.target));
mediumBtn.addEventListener('click', (e) => selectDifficulty("medium", e.target));
hardBtn.addEventListener('click', (e) => selectDifficulty("hard", e.target));
