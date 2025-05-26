let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
let maxAttempts = 10;
let gameStatus = "playing";
let gamesPlayed = 0;
let gamesWon = 0;
let guessHistory = [];

const difficultySettings = {
  easy: 15,
  medium: 10,
  hard: 7,
};

const feedback = document.getElementById("feedback");
const attemptsDisplay = document.getElementById("attempts");
const maxAttemptsDisplay = document.getElementById("maxAttempts");
const remainingAttemptsDisplay = document.getElementById("remainingAttempts");
const guessInput = document.getElementById("guessInput");
const submitGuess = document.getElementById("submitGuess");
const newGameBtn = document.getElementById("newGame");
const difficultySelect = document.getElementById("difficulty");

function updateStats() {
  document.getElementById("gamesPlayed").textContent = gamesPlayed;
  document.getElementById("gamesWon").textContent = gamesWon;
}

function resetGame(difficulty = "medium") {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  maxAttempts = difficultySettings[difficulty];
  gameStatus = "playing";
  guessHistory = [];
  updateDisplays();
  feedback.textContent = "New game started! Guess a number between 1 and 100!";
  feedback.className = "feedback default";
  guessInput.disabled = false;
  submitGuess.disabled = false;
  guessInput.value = "";
}

function validateInput(input) {
  const num = parseInt(input);
  if (isNaN(num))
    return { valid: false, message: "Please enter a valid number!" };
  if (num < 1 || num > 100)
    return { valid: false, message: "Number must be between 1 and 100!" };
  if (guessHistory.includes(num))
    return { valid: false, message: "You already guessed this number!" };
  return { valid: true, value: num };
}

function makeGuess() {
  if (gameStatus !== "playing") return;

  const input = guessInput.value.trim();
  const validation = validateInput(input);

  if (!validation.valid) {
    feedback.textContent = validation.message;
    feedback.className = "feedback default";
    return;
  }

  const guess = validation.value;
  guessHistory.push(guess);
  attempts++;
  updateDisplays();

  if (guess === secretNumber) {
    gameStatus = "won";
    gamesPlayed++;
    gamesWon++;
    feedback.textContent =
      "🎉 Congratulations! You guessed it in " + attempts + " attempts!";
    feedback.className = "feedback won";
    endGame();
  } else if (attempts >= maxAttempts) {
    gameStatus = "lost";
    gamesPlayed++;
    feedback.textContent = "😢 Game Over! The number was " + secretNumber;
    feedback.className = "feedback lost";
    endGame();
  } else {
    let diff = Math.abs(guess - secretNumber);
    if (diff <= 5) {
      feedback.textContent =
        guess < secretNumber
          ? "🔥 Very close! Try higher!"
          : "🔥 Very close! Try lower!";
    } else if (diff <= 15) {
      feedback.textContent =
        guess < secretNumber ? "🎯 Close! Go higher!" : "🎯 Close! Go lower!";
    } else {
      feedback.textContent =
        guess < secretNumber
          ? "⬆ Too low! Try higher!"
          : "⬇ Too high! Try lower!";
    }
    feedback.className = "feedback default";
  }

  guessInput.value = "";
}

function updateDisplays() {
  attemptsDisplay.textContent = attempts;
  maxAttemptsDisplay.textContent = maxAttempts;
  remainingAttemptsDisplay.textContent = maxAttempts - attempts;
}

function endGame() {
  guessInput.disabled = true;
  submitGuess.disabled = true;
  updateStats();
}

submitGuess.addEventListener("click", makeGuess);
newGameBtn.addEventListener("click", () => {
  const difficulty = difficultySelect.value;
  resetGame(difficulty);
});
difficultySelect.addEventListener("change", () => {
  resetGame(difficultySelect.value);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    makeGuess();
  }
});

resetGame();
updateStats();
