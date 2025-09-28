import React from 'react'

export default function Letter({ letter }) {
  return (
    <div className='w-18 h-18 text-3xl font-bold bg-blue-50 rounded-md flex justify-center items-center gap-2 m-1 shadow-[0_4px_1px_-1px_#B2C1D4]'>
      {letter.toUpperCase()}
    </div>
  )
}
