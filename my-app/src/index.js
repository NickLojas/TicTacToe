import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button 
      className={(props.winningLine) ? 'winningSquare' : 'square'} 
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, win) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
        winningLine={win}
      />
    );
  }

  render() {
    let squares=[];
    let rows=[];

    for (let x=0; x<3; x++) {
      for (let index=x*3; index<x*3+3 ; index++) {
        let win;
        const winningLine = this.props.winningLine;
        if (winningLine) {
          for (let i=0; i<3; i++){
            if (winningLine[i]===index) {
              win = true;
            }
          }
        }
        squares.push(this.renderSquare(index, win));
      }
      rows.push(<div className='board-row'>{squares}</div>);
      squares = [];
    }
    
    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        col: (i % 3) + 1,
        row: Math.floor(i / 3) + 1,
        player: this.state.xIsNext ? 'X' : 'O',
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' with player ' + step.player + ' at location (row, col): (' + step.row + ', ' + step.col + ')':
        'Go to game start';

      const bold = (this.state.stepNumber === move);

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={bold ? 'curMove' : ''}>{desc}</button> 
        </li>
      );
    });

    let status;
    let winningLine;
    if (winner){
      if (winner === 'Draw')
        status = 'Draw';
      else{
        status = 'Winner: ' + winner.player;
        winningLine = winner.line;
      }
    }
    else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningLine={winningLine}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        player: squares[a],
        line: lines[i]
      }
    }
  } if (squares.every(square => square != null))
      return 'Draw';
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
