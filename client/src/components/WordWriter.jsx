import React from 'react'
import Word from './Word';
import { useEffect, useState } from 'react';


export default function WordWriter({ socket, gameState, myPlayerNum }) {
    const [word, setWord] = useState('')
    const [isActive, setIsActive] = useState(false)

    const non_allowed_chars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '=', '+', '[', ']', '{', '}', ';', ':', '"', "'", '<', '>', ',', '.', '?', '/', '\\', '|', '`', '~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ' ']

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
                else if (e.key.length === 1 && !non_allowed_chars.includes(e.key)) {
                    setWord(prev => prev + e.key);
                }
            }
        };
        setIsActive(gameState && gameState.currentPlayer === myPlayerNum);
        
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [gameState, word]);
    return (
        <Word word={word} isActive={isActive} bgColor={"bg-gradient-to-b from-blue-250 to-blue-300"}></Word>
    )
}
