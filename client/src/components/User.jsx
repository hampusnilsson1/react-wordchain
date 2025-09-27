import React from 'react'
import Word from './Word';
import { useEffect, useState } from 'react';

export default function User({ socket, gameState }) {
    const [myPlayerNum, setMyPlayerNum] = useState(null);

    // On connecting get assigned player number
    useEffect(() => {
        socket.on("playerNumber", (num) => {
            setMyPlayerNum(num);
        });

        return () => socket.off("playerNumber");
    }, []);

    return (
        <div>
            <div>Player {myPlayerNum}</div>
            <Word socket={socket} gameState={gameState} myPlayerNum={myPlayerNum}></Word>
        </div>
    )
}
