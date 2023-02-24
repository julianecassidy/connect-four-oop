"use strict"
/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {

  constructor(y = 6, x = 7) {
    this.height = y;
    this.width = x;
    this.currPlayer = 1;
    this.board = [];
    this.makeBoard();
    this.makeHtmlBoard();
  }

  /** creates game board, uses object height and width to return matrix of undefined elements */
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
    console.log(this.board);
  }


  /** creates a gameboard in the UI, takes no parameters and appends table to document with event listener */
  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = "";

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `c-${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** places pieces on board and determines winner/tie; takes click event as paramenter; calls game functions */
  // function calls do not need to be bound here
  handleClick(evt) {
    console.log('handle click ', this);
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    // const boundFindSpotForCol = this.findSpotForCol.bind(this);
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    const boundPlaceInTable = this.placeInTable.bind(this);
    boundPlaceInTable(y, x);

    // check for win
    const boundCheckForWin = this.checkForWin.bind(this);
    if (boundCheckForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
    console.log(this.currPlayer);

  }

  /** determines which height is empty in column; takes width value; returns height value or null */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** handles UI placement of piece; takes height and width variables; appends playing piece */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`c-${y}-${x}`);
    spot.append(piece);
  }

  /** displays an alert with win message */
  endGame = () => alert(`${this.currPlayer} wins!!! :D`);  // make a method


  /** determines if current player has won; takes no parameters; returns boolean */
  checkForWin() {
    console.log("checkForWin is running")

    /** looks at group of 4 cells to determine legality and player; takes array of 4 cell coordinates; returns boolean */
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    };

    const boundWin = _win.bind(this);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (boundWin(horiz) || boundWin(vert) || boundWin(diagDR) || boundWin(diagDL)) {

          return true;
        }
      }
    }
  }

}

new Game(6, 7);

