import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'>
      {/* Bal oldali bar */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
      <div className='text-[#414141]'>
        <div className='flex items-center gap-2'>
            <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
            <p className='font-medium text-sm md:text-base'>Népszerű termékeink</p>
        </div>
          <h1 className='lexend-deca text-3xl sm:py-3 lg:text-5xl leading-relaxed '>Újdonságok</h1>
          <div className='flex items-center gap-2'>
             <p className='font-semibold text-sm md:text-base'>Vásárlás</p>
             <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
          </div>
      </div>
      </div>
      {/* Jobb oldali bar */}
      <img className='w-full sm:w-1/2' src={assets.hero_img} alt="" />
    </div>
  )
}

export default Hero
