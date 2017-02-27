import React from 'react';
import ReactDOM from 'react-dom';

import Board from './board.jsx';

const BOARD_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
          squares: Array(9).fill(null)
      }],
      isXNext: true,
      stepNumber: 0
    };
  }

  canMove(i) {
    const {history} = this.state;
    if (this.state.stepNumber !== history.length - 1) {
      return;
    }

    const {squares} = history[history.length - 1];
    return squares[i] == null && this.calculateWinner(squares) == null;
  }

  handleSquareClick(i) {
    if (!this.canMove(i)) {
      return;

    }
    const {history} = this.state;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    squares[i] = this.state.isXNext? 'X' : 'O';

    const updatedHistory = history.concat({squares: squares});
    this.setState({history: updatedHistory, isXNext: !this.state.isXNext, stepNumber: history.length});
  }

  calculateWinner(squares) {
    for (let i = 0; i < BOARD_LINES.length; i++) {
      const [a, b, c] = BOARD_LINES[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  jumpToMove(step) {
    this.setState({
      stepNumber: step,
      isXNext: step % 2 === 0
    });
  }

  render() {
    const {history} = this.state;
    const current = history[this.state.stepNumber]
    const winner = this.calculateWinner(current.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' +  (this.state.isXNext ? 'X' : 'O');
    }

    const moves = history.map((state, index) => {
      const description = index === 0 ? 'Game Start' : 'Turn ' + (index);
      return (
        <li key={index}>
          <a href='#' onClick={() => this.jumpToMove(index)}>{description}</a>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} handleSquareClick={(i) => this.handleSquareClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Game />, document.getElementById('container'));
