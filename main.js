// Select defined elements
const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById("high-score");
const easyBtn = document.getElementById('easyBtn');
const mediumBtn = document.getElementById('mediumBtn');
const hardBtn = document.getElementById('hardBtn');
const buttonsContainer = document.querySelector('.difficulty-buttons');

let selectedDifficulty = "easy"; // Default difficulty mode
let gameTimer;

let score = 0;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
highScoreDisplay.textContent = highScore;

let gameActive = false;
let currentMoleIndex = -1;
let moleTimer = null;

let youtubePlayer;

function onYouTubeIframeAPIReady() {
  youtubePlayer = new YT.Player('youtubePlayer');
}

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
      holes[currentMoleIndex].classList.remove('active');
      currentMoleIndex = -1;
    }
  };

}

function selectDifficulty(difficulty, clickedButton) {
  selectedDifficulty = difficulty;

  // Set mole speed based on difficulty
  if (difficulty === "easy") {
    moleInterval = 1000;
  } else if (difficulty === "medium") {
    moleInterval = 800;
  } else if (difficulty === "hard") {
    moleInterval = 600;
    youtubePlayer.playVideo();
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

    startCountdown(countdownText);
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
  
  if (youtubePlayer) {
    youtubePlayer.pauseVideo();
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

// edits: 
// Change cursor to a hammer 
// sound effects? can't touch this
// mole shouldn't appear at the end
// clean up code and comments
