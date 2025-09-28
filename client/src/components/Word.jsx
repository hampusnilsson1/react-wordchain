import Letter from './Letter'
import React, { useState, useEffect } from 'react'

export default function Word({ socket, gameState, myPlayerNum }) {
    const [word, setWord] = useState('')

    // Send Word to server
    const submitWord = (wordToSubmit) => {
        if (wordToSubmit.length > 0) {
            socket.emit("newWord", wordToSubmit);
            setWord("");
        }
    };

    // Handle key presses
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameState && gameState.currentPlayer === myPlayerNum) {
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
    }, [gameState, word]);
    return (
        <div className='m-4 p-5 rounded-md shadow-xl max-w-3xl border border-gray-200'>
            <div className='flex flex-wrap gap-0'>
                {word.split('').map((char, idx) => (
                    <Letter key={idx} letter={char} />
                ))}
            </div>
        </div>
    )
}
