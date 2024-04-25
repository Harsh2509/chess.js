import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({
  board,
  socket,
  chess,
  setBoard,
  color,
}: {
  board:
    | ({
        square: Square;
        type: PieceSymbol;
        color: Color;
      } | null)[][]
    | undefined;
  socket: WebSocket;
  chess: Chess | null;
  setBoard: React.Dispatch<
    React.SetStateAction<
      | ({
          square: Square;
          type: PieceSymbol;
          color: Color;
        } | null)[][]
      | undefined
    >
  >;
  color: Color | null;
}) => {
  const [from, setFrom] = useState<Square | null>(null);

  const isFlipped = color === "b";

  return (
    <div className="text-white-200">
      {board &&
        board !== undefined &&
        (isFlipped ? board.slice().reverse() : board).map((row, i) => {
          return (
            <div key={i} className="flex">
              {row.map((square, j) => {
                const squareRepresentation = (String.fromCharCode(
                  97 + (j % 8)
                ) + (isFlipped ? i + 1 : 8 - i).toString()) as Square;
                return (
                  <div
                    onClick={() => {
                      if (!from) {
                        setFrom(squareRepresentation);
                      } else {
                        socket.send(
                          JSON.stringify({
                            type: MOVE,
                            move: {
                              from,
                              to: squareRepresentation,
                            },
                          })
                        );
                        console.log({
                          from,
                          to: squareRepresentation,
                        });
                        try {
                          chess?.move({ from, to: squareRepresentation });
                          setBoard(chess?.board());
                        } catch (err) {
                          console.error(err);
                        }

                        setFrom(null);
                      }
                    }}
                    key={j}
                    className={`w-16 h-16 ${
                      (i + j) % 2 === 0 ? "bg-green-500" : "bg-white"
                    }`}
                  >
                    <div className="w-full h-full flex justify-center items-center cursor-pointer">
                      {square ? (
                        <img
                          src={`${
                            square.color == "b"
                              ? `${square?.type?.toUpperCase()} copy`
                              : square?.type
                          }.png`}
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
    </div>
  );
};
