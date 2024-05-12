import { useState } from 'react';

export default function Game() {

    const [ascending, setAscending] = useState(true);
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    const [moveHistory, setMoveHistory] = useState(Array(0));

    function handlePlay(nextSquares, moveHistory) {
        //Creates new array that contains all items till current move followed by nextSquares
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
        //When the move made, update last move ot be current set of squares
        setHistory(nextHistory);
        //Each time move made, update currentMove to point to latest entry history
        setCurrentMove(nextHistory.length - 1);

        setMoveHistory(moveHistory);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let description;

        let tempRow = Math.floor(moveHistory[move-1] / 3) + 1;
        let tempCol = moveHistory[move-1] % 3 + 1;
        let positionText;

        if (move > 0) {
          description = 'Go to move #' + move;
          positionText = "You are at move " + move + " at position (" + tempRow + ", " + tempCol + ")";
        } else {
          description = 'Go to game start';
          positionText = "You are at move 0";
        }



        return (
          <li key={move}>
            <button onClick={() => jumpTo(move)}>{description}</button>
            <div>{positionText}</div>
          </li>
        );
      });

      if (!ascending) {
        moves.reverse();
      }

    function toggleSort() {
        setAscending(!ascending); //Changes the boolean flag
    }

    return (
        <div className = "game">
            <div className = "game-board">
                <Board xIsNext={xIsNext} squares = {currentSquares} onPlay={handlePlay} moveHistory={moveHistory}/>
            </div>
            <div className = "game-info">
                <ol>{moves}</ol>
            </div>
            <div>
                <button onClick = {() => toggleSort()}>{ascending ? "Sort descending" : "Sort Ascending"}</button>
            </div>
        </div>
    );
}

function Board({xIsNext, squares, onPlay, moveHistory}) {

  function handleClick(i) {

    if (squares[i]/*|| calculateWinner(squares)*/) {
        return;
    }
    const nextSquares = squares.slice();

    const moveHistoryCopy = moveHistory.slice();


    if (xIsNext) {
        nextSquares[i] = "X";
        moveHistoryCopy.push(i);
    } else {
        nextSquares[i] = "O";
        moveHistoryCopy.push(i);
    }
    onPlay(nextSquares, moveHistoryCopy);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + squares[winner[0]];
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const board = [];

  for (let row = 0; row < 3; row++) {
    let boardRow = [];
    for (let col = 0; col < 3; col++) {
      let index = row * 3 + col;
      const isWinner = winner ? winner.includes(index) : false;
      boardRow.push(<Square
                     value = {squares[index]}
                     onSquareClick = {() => handleClick(index)}
                     isWinner = {isWinner} />);
    }
    board.push(<div className="board-row">{boardRow}</div>)
  }

  return (
      <>
        <div className="status">{status}</div>
        {board}
      </>
    );
}

function Square({value, onSquareClick, isWinner}) {

    return <button
        className= {isWinner ? "square-winner" : "square"}
        onClick = {onSquareClick}>
            { value }
        </button>;
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      console.log([a,b,c]);
      //return squares[a];
      let winningCombo = [a, b, c];
      return winningCombo;
    }
  }
  return null;
}