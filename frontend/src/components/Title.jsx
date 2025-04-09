import React from 'react'

const Title = ({ text1, text2 }) => {
  return (
    <div className='flex flex-col items-center mb-3 w-full'>
      <p className='text-gray-500 text-center'>
        {text1} <span className='text-gray-700 font-medium'>{text2}</span>
      </p>
      <p className='w-16 sm:w-24 h-[2px] bg-gray-700 mt-2'></p>
    </div>

    //A címek meletti csík módosítása

  )
}

export default Title
