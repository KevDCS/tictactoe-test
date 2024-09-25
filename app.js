// Selectors

const gameboard = document.querySelector('#board');
const info = document.querySelector('#info');
let turn;
const winningCombos = [
  [0, 1, 2], // Top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal l-2-r
  [2, 4, 6] // Diagonal r-2-l

]

// Create the gameboard

function createGameboard() {
  const emptyTiles = " ".repeat(9).split("");
  const tileGrid = emptyTiles
  .map((t) => `<button class="tile"></button>`)
  .join("");
  gameboard.innerHTML = tileGrid;
  turn = "X";
  document.documentElement.style.setProperty("--hue", 10);
  info.textContent = `It's ${turn}'s turn`;
  gameboard.addEventListener("click", handleGameboardClick);
  const allTiles = gameboard.querySelectorAll(".tile");
  allTiles.forEach(t => t.addEventListener("mouseenter", handleMouseEnter));
  allTiles.forEach(t => t.addEventListener("mouseleave", handleMouseLeave));
  gameboard.removeAttribute("inert");
}

createGameboard();

function updateTurn() {
  turn = turn === "X" ? "O" : "X";
  info.textContent = `It's ${turn}'s turn`;
  document.documentElement.style.setProperty("--hue", turn === "X" ? 10 : 200);
}

function restartGame() {
  let seconds = 3;
  const timer = setInterval(() => {
    info.textContent = `Restarting in ${seconds}...`;
    seconds--;
    if (seconds < 0) {
      // clear the interval
      clearInterval(timer);
      // restart game
      createGameboard();
    }
  }, 1000)
}

function showCongrats() {
  info.textContent = `${turn} wins!`;
  gameboard.removeEventListener("click", handleGameboardClick);
  gameboard.setAttribute("inert", true);
  const jsConfetti = new JSConfetti()
  jsConfetti.addConfetti({
    emojis: ["👾", "💩", "💸", "🥳", "🎉", "🪅"]
  })
  setTimeout(restartGame, 1000);
}

function checkScore() {
  const allTiles = [...gameboard.querySelectorAll(".tile")];
  const tileValues = allTiles.map((t) => t.dataset.value);
  const isWinner = winningCombos.some((combo) => {
    const [a,b,c] = combo;
    return (
      tileValues[a] &&
      tileValues[a] === tileValues[b] &&
      tileValues[a] === tileValues[c]
    )
  });
  if (isWinner) {
    return showCongrats();
  }
  updateTurn();
}

function handleGameboardClick(event) {
  const valueExists = event.target.dataset.value;
  if(!valueExists) {
    event.target.dataset.value = turn;
    event.target.style.setProperty("--hue", turn === "X" ? 10 : 200);
    checkScore()
  }
}

function handleMouseEnter(e) {
  const valueExists = e.target.dataset.value;
  if (!valueExists) {
    e.target.dataset.hover = turn;
    e.target.style.setProperty("--hue", turn === "X" ? 10 : 200);
}
}

function handleMouseLeave(e) {
  e.target.dataset.hover = "";
}