import React from 'react'
import { assets } from '../assets/assets'

const Policy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
        <div>
            <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
            <p className='font-semibold'>Csere folyamat</p>
            <p className='text-gray-400'>Könnyen módosítható termékek</p>
        </div>
        <div>
            <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
            <p className='font-semibold'>7 napos visszaváltás</p>
            <p className='text-gray-400'>Minden terméken 7 napos visszaváltás</p>
        </div>
        <div>
            <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
            <p className='font-semibold'>24/7 szolgálat</p>
            <p className='text-gray-400'>24/7 szolgálat a hét minden napján</p>
        </div>

    </div>
  )
}

export default Policy
