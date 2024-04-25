import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSockte";
import { Chess, Color } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export default function Game() {
  const socket = useSocket();
  const [chess, setChess] = useState<Chess | null>(new Chess());
  const [board, setBoard] = useState(chess?.board());
  const [started, setStarted] = useState(false);
  const [color, setColor] = useState<Color | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (ev) => {
      const message = JSON.parse(ev.data);

      switch (message.type) {
        case INIT_GAME:
          setChess(new Chess());
          setBoard(chess?.board());
          setColor(message.payload.color);
          return;

        case MOVE:
          chess?.move(message.payload);
          setBoard(chess?.board());
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
          <ChessBoard
            board={board}
            socket={socket}
            chess={chess}
            setBoard={setBoard}
            color={color}
          />
        </div>
        <div className="col-span-2  w-full">
          {!started && (
            <Button
              onClick={() => {
                socket.send(
                  JSON.stringify({
                    type: INIT_GAME,
                  })
                );
                setStarted(true);
              }}
            >
              Play
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
