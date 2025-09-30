import React from 'react'
import WordWriter from './WordWriter';
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
        <div className='flex flex-col items-center justify-center'>
            <div>Player {myPlayerNum}</div>
            <WordWriter socket={socket} gameState={gameState} myPlayerNum={myPlayerNum}></WordWriter>
        </div>
    )
}
