import React from 'react'
import User from './components/User';
import io from "socket.io-client";
import { useEffect, useState } from 'react';

const socket = io("http://localhost:3000");

export default function App() {
  const [gameState, setGameState] = useState(null)
  // Listen for gameState updates from server
  useEffect(() => {
    const handleGameState = (state) => {
      console.log("Ny gameState:", state);
      setGameState(state);
    };

    socket.on("gameState", handleGameState);

    return () => {
      socket.off("gameState", handleGameState);
    };
  }, []);

  return (
    <div>
      <h1>Word Chain</h1>
      <div className="flex">
        <h3>Players Connected: </h3>
        {gameState?.players &&
          Object.entries(gameState.players).map(([id, value]) => (
            <p key={id}>
              {value},
            </p>
          ))
        }
      </div>
      <p>Currently Player {gameState?.currentPlayer}s Turn!</p>
      <User socket={socket} gameState={gameState} />
    </div>
  )
}

