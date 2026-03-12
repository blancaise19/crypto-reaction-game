const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const bestEl = document.getElementById("best");
const streakEl = document.getElementById("streak");
const difficultyEl = document.getElementById("difficulty");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const messageEl = document.getElementById("message");
const arena = document.getElementById("arena");
const coin = document.getElementById("coin");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");

const GAME_DURATION = 30000;
const STORAGE_KEY = "crypto-reaction-rush-best";

let gameActive = false;
let score = 0;
let streak = 0;
let maxStreak = 0;
let bestScore = Number(localStorage.getItem(STORAGE_KEY) || 0);
let startTime = 0;
let endTime = 0;
let coinTimeout = 0;
let frameHandle = 0;
let spawnToken = 0;
let audioContext;

bestEl.textContent = bestScore;
restartButton.disabled = true;

function setMessage(text) {
  messageEl.textContent = text;
}

function setOverlay(title, text, hidden) {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  overlay.classList.toggle("hidden", hidden);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getProgress(now) {
  return clamp((now - startTime) / GAME_DURATION, 0, 1);
}

function getDifficulty(now) {
  return 1 + Math.floor(getProgress(now) * 6);
}

function getCoinLifetime(now) {
  const progress = getProgress(now);
  return 1050 - progress * 520;
}

function getCoinSize(now) {
  const progress = getProgress(now);
  return 92 - progress * 22;
}

function playTone(type) {
  if (!audioContext) {
    return;
  }

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type === "hit" ? "triangle" : "sawtooth";
  oscillator.frequency.setValueAtTime(type === "hit" ? 640 : 180, now);
  oscillator.frequency.exponentialRampToValueAtTime(type === "hit" ? 880 : 120, now + 0.08);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(type === "hit" ? 0.07 : 0.04, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (type === "hit" ? 0.11 : 0.18));

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + (type === "hit" ? 0.12 : 0.2));
}

function ensureAudio() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioContext = new AudioContextClass();
    }
  }

  if (audioContext?.state === "suspended") {
    audioContext.resume();
  }
}

function updateHud(now = performance.now()) {
  const timeLeft = Math.max(0, (endTime - now) / 1000);
  timeEl.textContent = timeLeft.toFixed(1);
  streakEl.textContent = streak;
  difficultyEl.textContent = getDifficulty(now);
  scoreEl.textContent = score;
  bestEl.textContent = bestScore;
}

function positionCoin(now) {
  const arenaRect = arena.getBoundingClientRect();
  const padding = 18;
  const size = getCoinSize(now);
  const maxX = arenaRect.width - padding * 2 - size;
  const maxY = arenaRect.height - padding * 2 - size;
  const x = padding + Math.random() * Math.max(maxX, 0) + size / 2;
  const y = padding + Math.random() * Math.max(maxY, 0) + size / 2;

  coin.style.width = `${size}px`;
  coin.style.height = `${size}px`;
  coin.style.left = `${x}px`;
  coin.style.top = `${y}px`;
}

function hideCoin() {
  coin.classList.add("hidden");
  coin.classList.remove("hit", "miss");
  coin.style.pointerEvents = "none";
}

function spawnCoin() {
  if (!gameActive) {
    return;
  }

  const now = performance.now();
  spawnToken += 1;
  const token = spawnToken;
  const lifetime = getCoinLifetime(now);

  positionCoin(now);
  coin.classList.remove("hidden", "hit", "miss");
  coin.style.pointerEvents = "auto";

  clearTimeout(coinTimeout);
  coinTimeout = window.setTimeout(() => {
    if (!gameActive || token !== spawnToken) {
      return;
    }

    streak = 0;
    coin.classList.add("miss");
    playTone("miss");
    setMessage("Missed. The chain gets hotter, stay focused.");
    updateHud();

    window.setTimeout(() => {
      if (token === spawnToken) {
        hideCoin();
      }
    }, 120);

    window.setTimeout(() => {
      if (gameActive && token === spawnToken) {
        spawnCoin();
      }
    }, 140);
  }, lifetime);
}

function endGame() {
  gameActive = false;
  clearTimeout(coinTimeout);
  cancelAnimationFrame(frameHandle);
  hideCoin();
  restartButton.disabled = false;
  startButton.disabled = false;

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem(STORAGE_KEY, String(bestScore));
  }

  updateHud(endTime);
  setMessage(`Run complete. Final score: ${score}. Best streak: ${maxStreak}.`);
  setOverlay("Time up", `You banked ${score} taps with a top streak of ${maxStreak}. Hit restart and push higher.`, false);
}

function tick(now) {
  if (!gameActive) {
    return;
  }

  updateHud(now);

  if (now >= endTime) {
    endGame();
    return;
  }

  frameHandle = requestAnimationFrame(tick);
}

function startGame() {
  ensureAudio();
  clearTimeout(coinTimeout);
  cancelAnimationFrame(frameHandle);

  score = 0;
  streak = 0;
  maxStreak = 0;
  gameActive = true;
  startTime = performance.now();
  endTime = startTime + GAME_DURATION;
  spawnToken += 1;

  startButton.disabled = true;
  restartButton.disabled = false;
  setOverlay("Go", "Tap every coin before it disappears. Each wave gets faster.", true);
  setMessage("Run live. Stay sharp and keep the streak alive.");
  updateHud(startTime);
  spawnCoin();
  frameHandle = requestAnimationFrame(tick);
}

coin.addEventListener("click", () => {
  if (!gameActive) {
    return;
  }

  ensureAudio();
  clearTimeout(coinTimeout);
  spawnToken += 1;
  streak += 1;
  maxStreak = Math.max(maxStreak, streak);

  const bonus = 1 + Math.floor(streak / 8);
  score += bonus;
  coin.classList.add("hit");
  coin.style.pointerEvents = "none";
  playTone("hit");

  const difficulty = getDifficulty(performance.now());
  setMessage(bonus > 1 ? `Combo bonus +${bonus}. Difficulty ${difficulty}.` : `Clean hit. Difficulty ${difficulty}.`);
  updateHud();

  window.setTimeout(() => {
    if (gameActive) {
      spawnCoin();
    }
  }, 80);
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

window.addEventListener("resize", () => {
  if (gameActive && !coin.classList.contains("hidden")) {
    positionCoin(performance.now());
  }
});

setOverlay("Warm up your reflexes", "Tap glowing coins before they vanish. Every few seconds the game speeds up.", false);
updateHud();
