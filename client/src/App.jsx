import React from 'react'
import User from './components/User';
import Opponent from './components/Opponent';
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
    <div className='flex flex-col items-center justify-between  min-h-screen bg-gradient-to-b from-blue-100 to-blue-300'>
      <div className='flex flex-col items-center p-4'>
        <h1 className='text-5xl'>Word Chain</h1>
        <div className="flex">
          <h3>Players Connected: </h3>
          {gameState?.players && Object.keys(gameState.players).length}
        </div>
      </div>
      <Opponent gameState={gameState}/>
      <User socket={socket} gameState={gameState} />
    </div>
  )
}

