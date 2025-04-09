import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

    <div>
        <img src={assets.logo} className='footer-logo' alt="" />
        <p className='w-full md:w-2/3 text-gray-600 mt-5'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis optio odio molestias aliquam esse. Reiciendis, illo. Nam rerum eaque dolorem, nesciunt commodi incidunt. Quaerat tempora perspiciatis, nemo non labore maxime.
        </p>
    </div>

    <div>
        <p className='text-xl font-medium mb-5'>Információk</p>
        <ul className='flex flex-col gap-1 text-gray-600'>
            <NavLink to= '/'><li className='hover:underline'>Menü</li></NavLink>
            <NavLink to= '/about'><li className='hover:underline'>Rólunk</li></NavLink>
            <NavLink to= '/delivery'><li className='hover:underline'>Szállítás</li></NavLink>
            <NavLink to='/dataprotection'><li className='hover:underline'>Adatvédelem tájékoztató</li></NavLink>
        </ul>
    </div>

        <div>
            <p className='text-xl font-medium mb-5'>Kapcsolat felvétel</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li><a href="tel:+36301234567" className='hover:underline'>+36 30 123 4567</a></li>
                <li><a href="mailto:ugyfelszolgalat@virag.com" className='hover:underline'>ugyfelszolgalat@virag.com</a></li>
            </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025@virag.com - Minden jog fenntartva.</p>
      </div>
    </div>
  )
}

export default Footer
