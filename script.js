const board = document.getElementById("gameBoard");
const timerEl = document.getElementById("timer");
const movesEl = document.getElementById("moves");
const scoreEl = document.getElementById("score");
const resetBtn = document.getElementById("resetBtn");

const icons = ["🍎","🍌","🍇","🍓","🍉","🍒","🍑","🍍"];
let cards = [];
let firstCard = null;
let secondCard = null;
let lock = false;

let moves = 0;
let score = 0;
let time = 0;
let timer;

/* ===== INICIAR JUEGO ===== */
function startGame() {
  moves = 0;
  score = 0;
  time = 0;
  firstCard = null;
  secondCard = null;
  lock = false;

  movesEl.textContent = moves;
  scoreEl.textContent = score;
  timerEl.textContent = "00:00";

  clearInterval(timer);
  startTimer();

  cards = [...icons, ...icons];
  shuffle(cards);

  board.innerHTML = "";
  cards.forEach(icon => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.icon = icon;
    board.appendChild(card);
  });
}

/* ===== MEZCLAR ===== */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/* ===== TIMER ===== */
function startTimer() {
  timer = setInterval(() => {
    time++;
    const m = String(Math.floor(time / 60)).padStart(2,"0");
    const s = String(time % 60).padStart(2,"0");
    timerEl.textContent = `${m}:${s}`;
  }, 1000);
}

/* ===== CLICK ===== */
board.addEventListener("click", e => {
  const card = e.target;
  if (!card.classList.contains("card")) return;
  if (lock || card.classList.contains("revealed")) return;

  reveal(card);

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    checkMatch();
  }
});

/* ===== FUNCIONES ===== */
function reveal(card) {
  card.classList.add("revealed");
  card.textContent = card.dataset.icon;
}

function hide(card) {
  card.classList.remove("revealed");
  card.textContent = "";
}

function checkMatch() {
  lock = true;
  moves++;
  movesEl.textContent = moves;

  if (firstCard.dataset.icon === secondCard.dataset.icon) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    score += 10;
    scoreEl.textContent = score;
    resetSelection();
    checkWin();
  } else {
    setTimeout(() => {
      hide(firstCard);
      hide(secondCard);
      resetSelection();
    }, 900);
  }
}

function resetSelection() {
  firstCard = null;
  secondCard = null;
  lock = false;
}

function checkWin() {
  if (document.querySelectorAll(".matched").length === cards.length) {
    clearInterval(timer);
    setTimeout(() => {
      alert(`🎉 LIMBER  
Movimientos: ${moves}  
Tiempo: ${timerEl.textContent}  
Puntuación: ${score}`);
    }, 300);
  }
}

/* ===== RESET ===== */
resetBtn.addEventListener("click", startGame);

startGame();
