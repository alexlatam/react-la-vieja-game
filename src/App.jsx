import { useState } from "react";
import Proptype from "prop-types";
import confetti from "canvas-confetti";

const TURNS = {
  X: "x",
  O: "o"
};

const WINNER_COMBINATIONS = [
  // Horizontal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonal
  [0, 4, 8],
  [2, 4, 6]
];

const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `square ${isSelected ? "is-selected" : ""}`;
  const handleClick = () => updateBoard(index);
  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
};

function App() {
  // Estado correspondiente al tablero
  const [board, setBoard] = useState(Array(9).fill(null));
  // Estado correspondiente al turno actual
  const [turn, setTurn] = useState(TURNS.X);

  // Estado correspondiente al ganador
  // null -> no hay ganador
  // false -> empate
  // O -> ganó O
  const [winner, setWinner] = useState(null);

  const checkWinner = (boardToCheck) => {
    // Recorrer las combinaciones ganadoras
    for (const combination of WINNER_COMBINATIONS) {
      // Obtener los valores de la combinación
      const [a, b, c] = combination;
      // Si los tres valores son iguales y no son null
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        // Retornar el valor del ganador
        return boardToCheck[a];
      }
    }
    // Si no hay ganador
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
  };

  const checkEndGame = (newBoard) => {
    // Si hay un ganador o si hay espacios vacíos
    return checkWinner(newBoard) || !newBoard.includes(null);
  };

  const updateBoard = (index) => {
    if (board[index] || winner) return;
    // Actualizar el tablero en la posición index
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    // Cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    // Verificar si hay ganador
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };

  return (
    <main className="board">
      <h1> Tic Tac Toe </h1>
      <button onClick={resetGame}>Reiniciar el juego</button>
      <section className="game">
        {board.map((_, index) => (
          <Square key={index} index={index} updateBoard={updateBoard}>
            {board[index]}
          </Square>
        ))}
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}> {TURNS.X} </Square>
        <Square isSelected={turn === TURNS.O}> {TURNS.O} </Square>
      </section>

      {winner !== null && (
        <section className="winner">
          <div className="text">
            {winner === false ? "Empate :/" : "Ganador!"}
            <header className="win">
              {winner && <Square>{winner}</Square>}
            </header>

            <footer>
              <button onClick={resetGame}>Empezar de nuevo</button>
            </footer>
          </div>
        </section>
      )}
    </main>
  );
}

Square.propTypes = {
  children: Proptype.string,
  isSelected: Proptype.bool,
  updateBoard: Proptype.func,
  index: Proptype.number
};

export default App;
