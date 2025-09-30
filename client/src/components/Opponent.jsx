import React, { use } from 'react'
import Word from './Word'
import Letter from './Letter';
import { useEffect, useState } from 'react';

export default function Opponent({ gameState }) {

    const [lastWord, setLastWord] = useState(null);

    useEffect(() => {
        setLastWord(gameState?.words && gameState.words.length > 0
            ? gameState.words[gameState.words.length - 1]
            : null)
    }, [gameState]);

    return (
        <div className='flex flex-col items-center justify-between flex-1'>
            {lastWord ?
                <div className='flex flex-col items-center'> 
                    <p>Last Word:</p>
                    <Word word={lastWord} isActive={true} bgColor={"bg-gradient-to-b from-green-200 to-green-300"} />
                    <p className='mt-5'>Next word should start with:</p>
                    <Letter letter={lastWord[lastWord.length - 1]} />
                </div>
                :
                <p>No words played yet</p>
            }
            <p className='mb-10'>Currently Player {gameState?.currentPlayer}s Turn!</p>
        </div>
    )
}
