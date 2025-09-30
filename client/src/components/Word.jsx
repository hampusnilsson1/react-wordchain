import Letter from './Letter'

export default function Word({ word, isActive , bgColor}) {
    return (
        <div className={`m-4 p-5 rounded-md shadow-xl max-w-3xl min-h-31 min-w-31 border border-gray-200 ${bgColor} ${!isActive
            ? ' opacity-50 pointer-events-none'
            : ' opacity-100'
            }`}>
            <div className='flex flex-wrap gap-0'>
                {word.split('').map((char, idx) => (
                    <Letter key={idx} letter={char} />
                ))}
            </div>
        </div>
    )
}
