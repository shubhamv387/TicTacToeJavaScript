// defining constants
const cellBgColorAfterWin = 'blue';

// initiating DOM variables
const gameBoard = document.querySelector('.gameBoard');
const displayInfo = document.querySelector('.info');
const resetBtn = document.getElementById('reset-game');

// defining variables with some initial values
// taking input from user
let inputBoardSize = prompt('Size of board (minimum = 3)');
if (!Number(inputBoardSize)) inputBoardSize = 3;

let size_of_board = Number(inputBoardSize) < 3 ? 3 : Number(inputBoardSize);

let turn = 'circle';
let no_of_clicks = 0;
displayInfo.textContent = 'circle go first';

designingBoard(size_of_board); // Designing board
createCells(size_of_board); // creating the cells

gameBoard.addEventListener('click', playGame);
resetBtn.addEventListener('click', resetGame);

function designingBoard(size_of_board) {
  gameBoard.style.height = size_of_board * 100 + 'px';
  gameBoard.style.width = size_of_board * 100 + 'px';
}

function createCells(size_of_board) {
  Array(size_of_board * size_of_board)
    .fill(0)
    .forEach((_, index) => {
      const cell = document.createElement('div');
      cell.classList = 'cell curser_pointer';
      // cell.textContent = index;
      cell.id = index;
      gameBoard.append(cell);
    });
}

function playGame(e) {
  // Ensure the clicked element is a cell and not the game board itself
  // Check if the clicked cell already has a display icon
  if (!e.target.classList.contains('cell') || e.target.children.length > 0) {
    return;
  }

  // creating the circle / cross icons
  const displayIcon = document.createElement('div');
  displayIcon.classList.add(turn);

  turn = turn === 'circle' ? 'cross' : 'circle';

  e.target.append(displayIcon);
  e.target.classList.remove('curser_pointer');
  displayInfo.textContent = 'It is now ' + turn + "'s turn";

  no_of_clicks++;
  if (no_of_clicks >= size_of_board * size_of_board) {
    resetBtn.disabled = false;
    gameBoard.removeEventListener('click', playGame);

    displayInfo.textContent = 'Game Over!';
    displayInfo.style.color = '#fff';
  }
  3;
  checkWinner(turn);
}

function checkWinner(turn) {
  const allCells = document.querySelectorAll('.cell');
  const winningCondition = generateWinningConditions(size_of_board);

  let newTern = turn === 'circle' ? 'cross' : 'circle';

  winningCondition.forEach((condition) => {
    const winner = condition.every((cell) =>
      allCells[cell].firstChild?.classList.contains(newTern)
    );

    if (winner) {
      condition.forEach((cell) => {
        allCells[cell].style.background = cellBgColorAfterWin;
      });

      allCells.forEach((cell) => {
        if (cell.classList.contains('curser_pointer'))
          cell.classList.remove('curser_pointer');
      });

      displayInfo.textContent = `${newTern.toUpperCase()} "WINS!"`;
      displayInfo.style.color = newTern === 'cross' ? 'yellow' : 'aqua';
      resetBtn.disabled = false;
      gameBoard.removeEventListener('click', playGame);
    }
  });
}

function resetGame() {
  const allCells = document.querySelectorAll('.cell');

  // Removing crosses or circles from the cells
  allCells.forEach((cell) => {
    cell.classList.add('curser_pointer');
    if (cell.children.length > 0) {
      cell.removeChild(cell.lastChild);

      // resetting the background color after a winner game
      if (cell.style.background === cellBgColorAfterWin)
        cell.style.background = '#323232';
    }
  });

  displayInfo.textContent = 'circle go first';
  displayInfo.style.color = '#fff';
  turn = 'circle';
  no_of_clicks = 0;
  resetBtn.disabled = true;
  gameBoard.addEventListener('click', playGame);
}

function generateWinningConditions(size) {
  const winningConditions = [];

  // Rows
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(i * size + j);
    }
    winningConditions.push(row);
  }

  // Columns
  for (let i = 0; i < size; i++) {
    const col = [];
    for (let j = 0; j < size; j++) {
      col.push(i + j * size);
    }
    winningConditions.push(col);
  }

  // Diagonal (top-left to bottom-right)
  const diag1 = [];
  for (let i = 0; i < size; i++) {
    diag1.push(i * (size + 1));
  }
  winningConditions.push(diag1);

  // Diagonal (top-right to bottom-left)
  const diag2 = [];
  for (let i = 0; i < size; i++) {
    diag2.push((i + 1) * (size - 1));
  }
  winningConditions.push(diag2);

  return winningConditions;
}
