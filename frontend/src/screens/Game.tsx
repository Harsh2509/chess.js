import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSockte";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export default function Game() {
  const socket = useSocket();
  const [chess, setChess] = useState<Chess | null>(new Chess());
  const [board, setBoard] = useState(chess?.board());

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (ev) => {
      const message = JSON.parse(ev.data);

      switch (message.type) {
        case INIT_GAME:
          setChess(new Chess());
          setBoard(chess?.board());
          console.log("Game initialized");
          return;

        case MOVE:
          chess?.move(message.payload);
          setBoard(chess?.board());
          console.log("Made a move");
          return;

        case GAME_OVER:
          console.log("Game over");
          return;
      }
    };
  }, [socket, chess]);

  if (!socket) {
    return <div>Connecting...</div>;
  }
  return (
    <div className="justify-center flex">
      <div className="grid grid-cols-6 gap-4 w-full">
        <div className="col-span-4  w-full flex justify-center">
          <ChessBoard board={board} socket={socket} />
        </div>
        <div className="col-span-2  w-full">
          <Button
            onClick={() => {
              socket.send(
                JSON.stringify({
                  type: INIT_GAME,
                })
              );
            }}
          >
            Play
          </Button>
        </div>
      </div>
    </div>
  );
}
