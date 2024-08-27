// defining constants
const cellBgColorAfterWin = 'blue'

// initiating DOM variables
const gameBoard = document.querySelector('.gameBoard'),
  displayInfo = document.querySelector('.info'),
  resetBtn = document.getElementById('reset-game')

// defining variables with some initial values
// taking input from user
let inputBoardSize = prompt('Choose board size between 3 to 5', 3)
if (!Number(inputBoardSize)) inputBoardSize = 3

let size_of_board = Number(inputBoardSize) < 3 ? 3 : Number(inputBoardSize) > 5 ? 5 : Number(inputBoardSize)

let turn = 'circle'
let no_of_clicks = 0
let undoStack = []
let redoStack = []
displayInfo.textContent = 'circle go first'

designingBoard(size_of_board) // Designing board
createCells(size_of_board) // creating the cells
const winningCondition = generateWinningConditions(size_of_board)
// console.log(winningCondition);

gameBoard.addEventListener('click', playGame)
resetBtn.addEventListener('click', resetGame)

function designingBoard(size_of_board) {
  gameBoard.style.height =
    window.innerWidth < window.innerHeight ? window.innerWidth * 0.85 + 'px' : window.innerHeight * 0.85 + 'px'
  gameBoard.style.width =
    window.innerWidth < window.innerHeight ? window.innerWidth * 0.85 + 'px' : window.innerHeight * 0.85 + 'px'
  gameBoard.style.maxHeight = '600px'
  gameBoard.style.maxWidth = '600px'
  gameBoard.style.background = '#323232'
  gameBoard.style.border = '1px solid #fff'
}

function createCells(size_of_board) {
  Array(size_of_board * size_of_board)
    .fill(0)
    .forEach((_, index) => {
      const cell = document.createElement('div')
      cell.classList = 'cell curser_pointer'
      cell.style.setProperty('height', 100 / size_of_board + '%')
      cell.style.setProperty('width', 100 / size_of_board + '%')
      // cell.textContent = index;
      cell.id = index
      gameBoard.append(cell)
    })
}

function playGame(e) {
  // Ensure the clicked element is a cell and not the game board itself
  // Check if the clicked cell already has a display icon
  if (!e.target.classList.contains('cell') || e.target.children.length > 0) {
    return
  }

  // creating the circle & cross icons
  const displayIcon = document.createElement('div')
  displayIcon.classList.add(turn)
  const winningTurn = turn // it will be used to check for the winner

  e.target.append(displayIcon)
  e.target.classList.remove('curser_pointer')
  undoStack.push({ cell: e.target, turn: winningTurn })
  if (redoStack.length) redoStack.length = 0

  turn = turn === 'circle' ? 'cross' : 'circle'

  displayInfo.textContent = 'It is now ' + turn + "'s turn"

  no_of_clicks++

  if (no_of_clicks >= size_of_board * size_of_board) {
    gameOver()
  }

  // check winner, only if there is some cross and circle on the board
  // size: 3 => 5, 4 => 7, 5 => 9, 6 => 11, 7 => 13 ...
  if (no_of_clicks >= size_of_board * 2 - 1) {
    checkWinner(winningTurn)
  }
}

function checkWinner(turn) {
  const allCells = document.querySelectorAll('.cell')

  winningCondition.forEach((condition) => {
    const winner = condition.every((cell) => allCells[cell].firstChild?.classList.contains(turn))

    if (winner) {
      condition.forEach((cell) => {
        allCells[cell].style.background = cellBgColorAfterWin
        allCells[cell].style.setProperty('--pseudo-background-color', cellBgColorAfterWin)
      })

      allCells.forEach((cell) => {
        if (cell.classList.contains('curser_pointer')) cell.classList.remove('curser_pointer')
      })

      displayInfo.textContent = `${turn.toUpperCase()} "WINS!"`
      undoStack.length = 0
      redoStack.length = 0
      displayInfo.style.color = turn === 'cross' ? 'yellow' : 'aqua'
      resetBtn.disabled = false
      gameBoard.removeEventListener('click', playGame)
    }
  })
}

function resetGame() {
  const allCells = document.querySelectorAll('.cell')

  // Removing crosses or circles from the cells
  allCells.forEach((cell) => {
    cell.classList.add('curser_pointer')
    if (cell.children.length > 0) {
      cell.removeChild(cell.lastChild)

      // removing the background color after a winner game
      if (cell.style.background === cellBgColorAfterWin) cell.style.removeProperty('background')
    }
  })

  displayInfo.textContent = 'circle go first'
  displayInfo.style.setProperty('color', '#fff')
  turn = 'circle'
  no_of_clicks = 0
  undoStack.length = 0
  redoStack.length = 0
  resetBtn.disabled = true
  gameBoard.addEventListener('click', playGame)
}

function generateWinningConditions(size) {
  const winningConditions = []

  // Rows
  for (let i = 0; i < size; i++) {
    const row = []
    for (let j = 0; j < size; j++) {
      row.push(i * size + j)
    }
    winningConditions.push(row)
  }

  // Columns
  for (let i = 0; i < size; i++) {
    const col = []
    for (let j = 0; j < size; j++) {
      col.push(i + j * size)
    }
    winningConditions.push(col)
  }

  // Diagonal (top-left to bottom-right)
  const diag1 = []
  for (let i = 0; i < size; i++) {
    diag1.push(i * (size + 1))
  }
  winningConditions.push(diag1)

  // Diagonal (top-right to bottom-left)
  const diag2 = []
  for (let i = 0; i < size; i++) {
    diag2.push((i + 1) * (size - 1))
  }
  winningConditions.push(diag2)

  return winningConditions
}

document.addEventListener('keyup', (e) => {
  if (e.key === ' ' && !resetBtn.disabled) resetGame()
  if (e.ctrlKey && e.key === 'z') undoMove()
  if (e.ctrlKey && e.key === 'y') redoMove()
})

function undoMove() {
  if (undoStack.length === 0) return

  const lastMove = undoStack.pop()
  redoStack.push(lastMove)
  lastMove.cell.removeChild(lastMove.cell.lastChild)
  lastMove.cell.classList.add('curser_pointer')

  turn = lastMove.turn
  displayInfo.textContent = 'It is now ' + turn + "'s turn"
  no_of_clicks--
  resetBtn.disabled = true
  gameBoard.addEventListener('click', playGame)
}

function redoMove() {
  if (redoStack.length === 0) return

  const lastMove = redoStack.pop()
  const displayIcon = document.createElement('div')
  displayIcon.classList.add(turn)
  lastMove.cell.append(displayIcon)
  lastMove.cell.classList.remove('curser_pointer')
  undoStack.push(lastMove)
  turn = lastMove.turn === 'circle' ? 'cross' : 'circle'
  displayInfo.textContent = 'It is now ' + turn + "'s turn"
  no_of_clicks++
  if (no_of_clicks >= size_of_board * size_of_board) gameOver()
}

function gameOver() {
  resetBtn.disabled = false
  gameBoard.removeEventListener('click', playGame)

  displayInfo.textContent = 'Game Over!'
  displayInfo.style.color = '#fff'
}
