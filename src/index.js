import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



function Square(props) {
    return (
        <button className="square" onClick={props.onClick} style={{backgroundColor: props.bgColor}}>
            {props.value}
        </button>
    )
}
  
class Board extends React.Component {
    renderSquare(i, bgcolor) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                bgColor={bgcolor}
            />
        );
    }
  
    render() {
      const rowArr = [];
      let diagCounter = 0;

      for (var i = 0; i<this.props.boardSize; i++) {
        let boardRow = [];
        var j = 0;
        console.log(this.props.winIndex + ' ' + this.props.winState);

        switch (this.props.winState) {
          case 0: {
            for (j = 0; j<this.props.boardSize; j++) {
              if (i*this.props.boardSize+j >= this.props.winIndex && (i*this.props.boardSize+j < this.props.winIndex + this.props.winSize)) {
                boardRow.push(this.renderSquare(i*this.props.boardSize+j, "#00e673"));
              } else {
                boardRow.push(this.renderSquare(i*this.props.boardSize+j, "#ffffff"));
              }
            }
            break;
          }
          case 1: {
            for (j = 0; j<this.props.boardSize; j++) {
              if (((i*this.props.boardSize+j)%this.props.boardSize === this.props.winIndex%this.props.boardSize ) &&
                  (i*this.props.boardSize+j >= this.props.winIndex) &&
                  (i*this.props.boardSize+j <= this.props.winIndex + (this.props.boardSize - 1) * this.props.winSize)) {
                boardRow.push(this.renderSquare(i*this.props.boardSize+j, "#00e673"));
              } else {
                boardRow.push(this.renderSquare(i*this.props.boardSize+j, "#ffffff"));
              }
            }
            break;
          }
          case 2: {
            for (j = 0; j<this.props.boardSize; j++) {
              if ((i*this.props.boardSize+j === (this.props.winIndex + this.props.boardSize*diagCounter + diagCounter)) &&
                  (i*this.props.boardSize+j >= this.props.winIndex) &&
                  (i*this.props.boardSize+j <= this.props.winIndex + (this.props.boardSize - 1) * this.props.winSize)) {
                boardRow.push(this.renderSquare(i*this.props.boardSize+j, "#00e673"));
                diagCounter++;
              } else {
                boardRow.push(this.renderSquare(i*this.props.boardSize+j, "#ffffff"));
              }
            }
            break;
          }
          case 3: {
            for (j = 0; j<this.props.boardSize; j++) {
              if ((i*this.props.boardSize+j === (this.props.winIndex + this.props.boardSize*diagCounter - diagCounter)) &&
                  (i*this.props.boardSize+j >= this.props.winIndex) &&
                  (i*this.props.boardSize+j < this.props.winIndex + (this.props.boardSize - 1) * this.props.winSize)) {
                boardRow.push(this.renderSquare(i*this.props.boardSize+j, "#00e673"));
                diagCounter++;
              } else {
                boardRow.push(this.renderSquare(i*this.props.boardSize+j, "#ffffff"));
              }
            }
            break;
          }
          default: {
            for (j = 0; j<this.props.boardSize; j++) {
              boardRow.push(this.renderSquare(i*this.props.boardSize+j, "#ffffff"));
            }
          }
        }

        rowArr.push(<div className="board-row">{boardRow}</div>)
      }

      return (
        <div>
            {rowArr}
        </div>
      );
    }
}
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardSize: 10,
      winSize: 5,
      history: [
        {
          squares: Array(49).fill(null)
        }
      ],
      moveArr: [],
      stepNumber: 0,
      xIsNext: true,
      colArr: [{squares: Array(49).fill(0)}],
      rowArr: [{squares: Array(49).fill(0)}],
      diagArr: [{squares: Array(49).fill(0)}],
      antidiagArr: [{squares: Array(49).fill(0)}],
    };

    this.handleChangeBoardSize = this.handleChangeBoardSize.bind(this);
    this.handleSubmitBoardSize = this.handleSubmitBoardSize.bind(this);
    this.handleChangeWinSize = this.handleChangeWinSize.bind(this);
    this.handleSubmitWinSize = this.handleSubmitWinSize.bind(this);
  }

  handleChangeWinSize(event) {
    this.setState({
      winSize: parseInt(event.target.value),
    });
  }

  handleSubmitWinSize(event) {
    alert('You now need ' + parseInt(this.state.winSize) + ' consecutive squares to win!!!');
    event.preventDefault();
  }

  handleChangeBoardSize(event) {
    this.setState({
      boardSize: parseInt(event.target.value),
    });
  }

  handleSubmitBoardSize(event) {
    this.updateGameSize(this.state.boardSize);
    event.preventDefault();
  }

  updateGameSize(boardSize) {
    this.setState({
      history: [
        {
          squares: Array(boardSize*boardSize).fill(null)
        }
      ],
      moveArr: [],
      stepNumber: 0,
      xIsNext: true,
      colArr: [{squares: Array(boardSize*boardSize).fill(0)}],
      rowArr: [{squares: Array(boardSize*boardSize).fill(0)}],
      diagArr: [{squares: Array(boardSize*boardSize).fill(0)}],
      antidiagArr: [{squares: Array(boardSize*boardSize).fill(0)}],
    })
  }
    
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    const moveArr = this.state.moveArr.slice(0, this.state.stepNumber + 1);
    const winSize = this.state.winSize;

    const rowArr = this.state.rowArr.slice(0, this.state.stepNumber + 1);
    const rowSquares = rowArr[rowArr.length - 1].squares.slice();
    const colArr = this.state.colArr.slice(0, this.state.stepNumber + 1);
    const colSquares = colArr[colArr.length - 1].squares.slice();
    const diagArr = this.state.diagArr.slice(0, this.state.stepNumber + 1);
    const diagSquares = diagArr[diagArr.length - 1].squares.slice();
    const antidiagArr = this.state.antidiagArr.slice(0, this.state.stepNumber + 1);
    const antiDiagSquares = antidiagArr[antidiagArr.length - 1].squares.slice();

    if (calcWinner(squares, rowSquares, colSquares, diagSquares, antiDiagSquares, winSize) !== null) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.addInRow(squares, rowSquares, i, winSize, this.state.boardSize);
    this.addInCol(squares, colSquares, i, winSize, this.state.boardSize);
    this.addInDiag(squares, diagSquares, i, winSize, this.state.boardSize);
    this.addInAntiDiag(squares, antiDiagSquares, i, winSize, this.state.boardSize);

    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      moveArr: moveArr.concat(i),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      rowArr: rowArr.concat([
        {
          squares: rowSquares
        }
      ]),
      colArr: colArr.concat([
        {
          squares: colSquares
        }
      ]),
      diagArr: diagArr.concat([
        {
          squares: diagSquares
        }
      ]),
      antidiagArr: antidiagArr.concat([
        {
          squares: antiDiagSquares
        }
      ]),
    });
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      winState: -1
    });
  }

  addInRow(boardSquares, rowSquares, index, winSize, boardSize) {
    let rootIndex = index - winSize + 1;
    let rowIndex = Math.floor(index/boardSize) * boardSize;
  
    if (rootIndex < rowIndex)
      rootIndex = rowIndex;
  
    let i = 0;
    if (boardSquares[index] === 'X') {
      for (i = rootIndex; i <= index; i++) {
        rowSquares[i] += 1;
      }
    } else {
      for (i = rootIndex; i <= index; i++) {
        rowSquares[i] -= 1;
      }
    }

    console.log(rootIndex + ' ' + rowSquares[rootIndex]);
  }
  
  addInCol(boardSquares, colSquares, index, winsize, boardSize) {
    let rootIndex = index - boardSize * (winsize - 1);
  
    if (rootIndex < 0)
      rootIndex = 0 + (index % boardSize);
  
    let i = 0;
    if (boardSquares[index] === 'X') {
      for (i = rootIndex; i <= index; i = i + boardSize) {
        colSquares[i] += 1;
      }
    } else {
      for (i = rootIndex; i <= index; i = i + boardSize) {
        colSquares[i] -= 1;
      }
    }

    // console.log(rootIndex + ' ' + colSquares[rootIndex]);
    // console.log(colSquares[rootIndex]);
  }

  addInDiag(boardSquares, diagSquares, index, winSize, boardSize) {
    let weight = winSize - 1;

    if (index - weight < Math.floor(index/boardSize) * boardSize) {
      weight = index - Math.floor(index/boardSize) * boardSize;
    }

    if (index - boardSize * weight < 0) {
      weight = Math.floor(index/boardSize);
    }

    let rootIndex = index - boardSize * weight - weight;

    let i = 0;
    if (boardSquares[index] === 'X') {
      for (i = rootIndex; i <= index; i = i + boardSize + 1) {
        diagSquares[i] += 1;
      }
    } else {
      for (i = rootIndex; i <= index; i = i + boardSize + 1) {
        diagSquares[i] -= 1;
      }
    }
  }

  addInAntiDiag(boardSquares, diagSquares, index, winSize, boardSize) {
    let weight = winSize - 1;

    if (index + weight > (Math.floor(index/boardSize) + 1) * boardSize - 1) {
      weight = (Math.floor(index/boardSize) + 1) * boardSize - index - 1;
    }

    if (index - boardSize * weight < 0) {
      weight = Math.floor(index/3);
    }

    let rootIndex = index - boardSize * weight + weight;

    let i = 0;
    if (boardSquares[index] === 'X') {
      for (i = rootIndex; i <= index; i = i + boardSize - 1) {
        diagSquares[i] += 1;
      }
    } else {
      for (i = rootIndex; i <= index; i = i + boardSize - 1) {
        diagSquares[i] -= 1;
      }
    }

    // console.log(rootIndex + ' ' + diagSquares[rootIndex]);
  }
    
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const rowSquares = this.state.rowArr[this.state.stepNumber].squares;
    const colSquares = this.state.colArr[this.state.stepNumber].squares;
    const diagSquares = this.state.diagArr[this.state.stepNumber].squares;
    const antiDiagSquares = this.state.antidiagArr[this.state.stepNumber].squares;
    const winner = calcWinner(current.squares, rowSquares, colSquares, diagSquares, antiDiagSquares, this.state.winSize);

    const winIndex = checkWinIndex(current.squares, rowSquares, colSquares, diagSquares, antiDiagSquares, this.state.winSize);
    const winState = checkWinState(current.squares, rowSquares, colSquares, diagSquares, antiDiagSquares, this.state.winSize);


    const moves = history.map((step, move) => {
      const index = this.state.moveArr[move - 1];
      const row = Math.floor(index/this.state.boardSize) + 1;
      const col = index - Math.floor(index/this.state.boardSize)*this.state.boardSize + 1;
      const moveCheck = (this.state.stepNumber === move) ? true : false;

      const desc = move ?
        'Go to move #' + move + ' (' + (row) + ',' + (col) + ')':
        'Go to game start';

      return (
        <li key={move} style={moveCheck ? {fontWeight:"bold"} : {fontWeight:"normal"}}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (isDraw(current.squares)) {
      status = "Draw!!!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    } 

    return (
      <div>
        <div className="game-input">
          <form onSubmit={this.handleSubmitBoardSize}>
            <label>
              Board Size: 
              <input type="number" value={this.state.boardSize} onChange={this.handleChangeBoardSize}/>
            </label>
            <input type="submit" value="Submit"/>
          </form>
          <form onSubmit={this.handleSubmitWinSize}>
            <label>
              Win Size: 
              <input type="number" value={this.state.winSize} onChange={this.handleChangeWinSize}/>
            </label>
            <input type="submit" value="Submit"/>
          </form>
        </div>
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
              boardSize={this.state.boardSize}
              winState={winState}
              winIndex={winIndex}
              winSize={this.state.winSize}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

// function calculateWinner(squares) {
//     const lines = [
//         [0, 1, 2],
//         [3, 4, 5],
//         [6, 7, 8],
//         [0, 4, 8],
//         [2, 4, 6],
//         [0, 3, 6],
//         [1, 4, 7],
//         [2, 5, 8],
//     ];

//     for (let i=0; i<lines.length; i++) {
//         const [a,b,c] = lines[i]
//         if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
//             return squares[a];
//     }

//     return null;
// }

function calcWinner(boardSquares, rowSquares, colSquares, diagSquares, antidiagArr, winSize) {
  for (var i = 0; i < boardSquares.length; i++) {
    if (Math.abs(rowSquares[i]) === winSize) {
      return boardSquares[i];
    }

    if (Math.abs(colSquares[i]) === winSize) {
      return boardSquares[i];
    }

    if (Math.abs(diagSquares[i]) === winSize) {
      return boardSquares[i];
    }

    if (Math.abs(antidiagArr[i]) === winSize) {
      return boardSquares[i];
    }
  }

  return null;
}

function checkWinIndex(boardSquares, rowSquares, colSquares, diagSquares, antidiagArr, winSize) {
  for (var i = 0; i < boardSquares.length; i++) {
    if (Math.abs(rowSquares[i]) === winSize) {
      return i;
    }

    if (Math.abs(colSquares[i]) === winSize) {
      return i;
    }

    if (Math.abs(diagSquares[i]) === winSize) {
      return i;
    }

    if (Math.abs(antidiagArr[i]) === winSize) {
      return i;
    }
  }

  return -1;
}

function checkWinState(boardSquares, rowSquares, colSquares, diagSquares, antidiagArr, winSize) {
  for (var i = 0; i < boardSquares.length; i++) {
    if (Math.abs(rowSquares[i]) === winSize) {
      return 0;
    }

    if (Math.abs(colSquares[i]) === winSize) {
      return 1;
    }

    if (Math.abs(diagSquares[i]) === winSize) {
      return 2;
    }

    if (Math.abs(antidiagArr[i]) === winSize) {
      return 3;
    }
  }

  return -1;
}

function isDraw(boardSquares) {
  for (let i = 0; i < boardSquares.length; i++) {
    if (boardSquares[i] === null) {
      return false;
    }
  }

  return true;
}
  
// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);