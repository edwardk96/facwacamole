// Select elements
const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById("high-score");
const easyBtn = document.getElementById('easyBtn');
const mediumBtn = document.getElementById('mediumBtn');
const hardBtn = document.getElementById('hardBtn');
const buttonsContainer = document.querySelector('.difficulty-buttons');
const hardModeAudio = document.getElementById('hardModeAudio');

let selectedDifficulty = "easy"; // Default
let gameTimer;

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

  moleImg.onclick = () => {
    if (gameActive) {
      score++;
      scoreDisplay.textContent = score;

      // Hide the mole immediately after a successful whack
      holes[currentMoleIndex].classList.remove('active');
      currentMoleIndex = -1;
    }
  };

}

function selectDifficulty(difficulty) {
  selectedDifficulty = difficulty;
  
  let selectedButton;
  if (difficulty === "easy") {
    moleInterval = 1000;
    selectedButton = easyBtn;
  } else if (difficulty === "medium") {
    moleInterval = 800;
    selectedButton = mediumBtn;
  } else if (difficulty === "hard") {
    moleInterval = 600;
    selectedButton = hardBtn;
  
    hardModeAudio.currentTime = 0; // Restart the song if it was playing
    hardModeAudio.play(); // Start playing the song
  }

  // Blink the selected button 3 times
  selectedButton.classList.add('blinking');

  // After the blinking ends, hide buttons and start countdown
  setTimeout(() => {
    buttonsContainer.innerHTML = '<p id="countdown-text">READY</p>'; // Ensure this replaces buttons properly
    startCountdown(); // Begin "Ready, Set, Go" sequence
  }, 600); // 3 blinks (0.2s each)
}

function startCountdown() {
  let countdownSequence = ["READY", "SET", "GO!"];
  let index = 0;

  buttonsContainer.innerHTML = '<p id="countdown-text">READY</p>';
  const countdownText = document.getElementById('countdown-text'); // Select after inserting

  let countdownInterval = setInterval(() => {
    index++;
    if (index < countdownSequence.length) {
      countdownText.textContent = countdownSequence[index];
    } else {
      clearInterval(countdownInterval);
      startGame(countdownText, selectedDifficulty); // Start game after "GO"
    }
  }, 1000);
}

// Function to start game & timer after "Go"
function startGame(countdownText, difficulty) {
  gameActive = true;
  score = 0;
  scoreDisplay.textContent = score;

  let timeLeft = 20; // Game duration
  countdownText.textContent = `Time Left: ${timeLeft}`;

  gameTimer = setInterval(() => {
    timeLeft--;
    countdownText.textContent = `Time Left: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(gameTimer);
      endGame();
    }
  }, 1000);

  // Set mole interval based on difficulty
  if (difficulty === "easy") {
    moleInterval = 1000;
  } else if (difficulty === "medium") {
    moleInterval = 800;
  } else if (difficulty === "hard") {
    moleInterval = 600;
  }

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
  
  if (hardModeAudio) {
    hardModeAudio.pause();
  }
  
  alert(`Game Over! Final Score: ${score}`);
}

// Event listener for start button
easyBtn.addEventListener('click', () => selectDifficulty("easy"));
mediumBtn.addEventListener('click', () => selectDifficulty("medium"));
hardBtn.addEventListener('click', () => selectDifficulty("hard"));

// edits: 
// Change cursor to a hammer 
// Difficuty buttons reappear after game finished  
// sound effects? can't touch this
// mole shouldn't appear at the end
// clean up code and comments 
// lives if you miss?
