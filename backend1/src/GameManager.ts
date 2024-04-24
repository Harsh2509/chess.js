import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./message";

export class GameManager {
  private users: WebSocket[];
  private waitingUser: WebSocket | null;
  private games: Game[];

  constructor() {
    this.users = [];
    this.waitingUser = null;
    this.games = [];
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      console.log(`Message is: ${message.type}`);

      if (message.type === INIT_GAME) {
        if (this.waitingUser !== null) {
          const game = new Game(this.waitingUser, socket);
          this.games.push(game);
          this.waitingUser = null;
        } else {
          this.waitingUser = socket;
        }
      } else if (message.type === MOVE) {
        const game = this.games.find(
          (game) => game.player1 == socket || game.player2 == socket
        );

        if (game) {
          console.log("Calling makeMove");
          game.makeMove(socket, message.move);
        }
      }
    });
  }
}
