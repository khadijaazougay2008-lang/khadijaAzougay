
let currentPlayer = "X";
let boardState = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;

const statusDisplay = document.getElementById('status-message');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart-btn');

const winConditions = [, [3, 4, 5], [6, 7, 8], // Rows, [1, 4, 7], [2, 5, 8], // Columns, [2, 4, 6]             // Diagonals
];

cells.forEach(cell => {
    cell.addEventListener('click', (e) => {
        const clickedCell = e.target;
        const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

        // Block clicks if slot is taken, game is over, or it's the AI's turn
        if (boardState[cellIndex] !== "" || !isGameActive || currentPlayer === "O") return;

        makeMove(cellIndex, clickedCell);
    });
});

function makeMove(index, cellElement) {
    boardState[index] = currentPlayer;
    cellElement.textContent = currentPlayer;

    if (checkResult()) return;

    // Switch turn to AI
    currentPlayer = "O";
    statusDisplay.textContent = `Computer (O) is thinking...`;

    // Make the computer move after a brief delay (half a second) to feel realistic
    setTimeout(aiTurn, 500);
}

function aiTurn() {
    if (!isGameActive) return;

    // 1. Find all available empty indexes on the board
    let emptyIndexes = [];
    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === "") {
            emptyIndexes.push(i);
        }
    }

    // 2. Pick a random index from the empty slots
    if (emptyIndexes.length > 0) {
        const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];

        // 3. Update the board state array
        boardState[randomIndex] = "O";

        // 4. Update the visual cell in the HTML grid
        const targetCell = document.querySelector(`[data-index="${randomIndex}"]`);
        targetCell.textContent = "O";

        if (checkResult()) return;

        // Switch turn back to human player
        currentPlayer = "X";
        statusDisplay.textContent = `Player X's turn`;
    }
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = currentPlayer === "X" ? "You Win! 🎉" : "Computer Wins! 🤖";
        isGameActive = false;
        return true;
    }

    if (!boardState.includes("")) {
        statusDisplay.textContent = "It's a Draw! 🤝";
        isGameActive = false;
        return true;
    }

    return false;
}

restartButton.addEventListener('click', () => {
    currentPlayer = "X";
    boardState = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    statusDisplay.textContent = "Player X's turn";
    cells.forEach(cell => cell.textContent = "");
});
