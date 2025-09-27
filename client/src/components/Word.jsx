import Letter from './Letter'
import React, { useState, useEffect } from 'react'

export default function Word({ socket }) {
    const [word, setWord] = useState('')

    const [myPlayerNum, setMyPlayerNum] = useState(null);
    const [gameState, setGameState] = useState(null)
    
    const submitWord = (wordToSubmit) => {
        if (wordToSubmit.length > 0) {
            socket.emit("newWord", wordToSubmit);
            setWord("");
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameState && gameState.currentPlayer === myPlayerNum){
                if (e.key === "Backspace") {
                    setWord(prev => prev.slice(0, -1));
                }
                else if (e.key === "Enter" && word.length > 0) {
                    submitWord(word)
                    return "";
                }
                else if (e.key.length === 1) {
                    setWord(prev => prev + e.key);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [gameState, myPlayerNum, socket, word]);

    // On connecting get player number
    useEffect(() => {
        socket.on("playerNumber", (num) => {
            setMyPlayerNum(num);
        });

        return () => socket.off("playerNumber");
    }, []);

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
            <div>{myPlayerNum}</div>
            <div className='flex gap-0'>
                {word.split('').map((char, idx) => (
                    <Letter key={idx} letter={char} />
                ))}
            </div>
        </div>
    )
}
