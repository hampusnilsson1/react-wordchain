import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // utveckling, tillåt alla
  }
});
const gameState = {
  words: [],
  currentPlayer: 1,
  players: {}
};
let nextPlayerNumber = 1;
let availableNumbers = [];

io.on("connection", (socket) => {
  // Assign player number
  let playerNum;
  if (availableNumbers.length > 0) {
    playerNum = availableNumbers.shift();
  } else {
    playerNum = nextPlayerNumber++;
  }

  gameState.players[socket.id] = playerNum;
  socket.emit("playerNumber", playerNum);
  console.log("En spelare anslöt:", socket.id, "Spelare nummer: ", playerNum);

  // Tell all players about the new player
  io.emit("gameState", gameState);

  // Send current State to the newly connected player
  socket.emit("gameState", gameState);

  // When a player sends a new word
  socket.on("newWord", (word) => {
    // Check if it's the player's turn
    if (gameState.players[socket.id] !== gameState.currentPlayer) {
      console.log(`Spelare ${socket.id} försökte skicka ord utanför sin tur.`);
      return;
    }
    // Validate the word (not empty, not used before, starts with last letter of previous word)
    if (word.trim() !== "" && !gameState.words.includes(word) && (gameState.words[gameState.words.length - 1]?.slice(-1) === word[0] || gameState.words.length === 0)) {
      gameState.words.push(word);

      console.log(`Spelare ${socket.id} skickade ordet: ${word}`);
      const activePlayers = Object.values(gameState.players);
      gameState.currentPlayer = getNextPlayer(gameState.currentPlayer, activePlayers);
      console.log("Nästa spelare är:", gameState.currentPlayer);

      // Send to all players
      io.emit("gameState", gameState);
    }
  });

  // When a player disconnects
  socket.on("disconnect", () => {
    console.log("Spelare frånkopplad:", socket.id);

    // If the disconnected player was the current player, move to next player
    if (gameState.currentPlayer === playerNum) {
      const activePlayers = Object.values(gameState.players);
      gameState.currentPlayer = getNextPlayer(gameState.currentPlayer, activePlayers);
    }
    // Remove and correct slots and next playernumber
    delete gameState.players[socket.id];
    const playerNumbers = Object.values(gameState.players);
    const maxNumber = playerNumbers.length > 0 ? Math.max(playerNumbers) : 0;
    availableNumbers = availableNumbers.filter(num => num <= maxNumber);
    nextPlayerNumber = maxNumber ? maxNumber + 1 : 1;
    if (playerNum < maxNumber){
      availableNumbers.push(playerNum);
    }
    // Send to all players
    io.emit("gameState", gameState);
  });
});

httpServer.listen(3000, () => {
  console.log("Server körs på http://localhost:3000");
});

// Calculate the next player in turn
function getNextPlayer(current, players) {
  if (players.length === 0) return null;
  // Wrap around to the smallest number if at the end
  if (current === Math.max(...players)) return Math.min(...players);
  // Otherwise return the next highest number
  const sorted = players.slice().sort((a, b) => a - b);
  const idx = sorted.indexOf(current);
  return sorted[idx + 1];
}