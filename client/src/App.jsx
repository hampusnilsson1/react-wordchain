import React from 'react'
import Word from './components/Word'
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function App() {
  return (
    <div>
      <Word socket={socket} ></Word>
    </div>
  )
}

