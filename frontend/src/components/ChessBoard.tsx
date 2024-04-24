import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({
  board,
  socket,
}: {
  board:
    | ({
        square: Square;
        type: PieceSymbol;
        color: Color;
      } | null)[][]
    | undefined;
  socket: WebSocket;
}) => {
  const [from, setFrom] = useState<Square | null>(null);

  return (
    <div className="text-white-200">
      {board &&
        board.map((row, i) => {
          return (
            <div key={i} className="flex">
              {row.map((square, j) => {
                return (
                  <div
                    onClick={() => {
                      if (!from) {
                        setFrom(square ? square.square : null);
                      } else {
                        socket.send(
                          JSON.stringify({
                            type: MOVE,
                            move: {
                              from,
                              to: square?.square, //to is null because square is null
                            },
                          })
                        );
                        setFrom(null);
                      }
                    }}
                    key={j}
                    className={`w-16 h-16 ${
                      (i + j) % 2 === 0 ? "bg-green-500" : "bg-white"
                    }`}
                  >
                    <div className="w-full h-full flex justify-center items-center">
                      {square ? square.type : ""}
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
