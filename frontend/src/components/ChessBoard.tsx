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
  return <div></div>;
};
