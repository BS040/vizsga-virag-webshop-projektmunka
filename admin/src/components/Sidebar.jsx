import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'


const Sidebar = () => {
  return (
    <div className='w-[20%] min-h-screen border-r-2'>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>

        <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1" to="/add">
          <img className='w-5 h-5' src={assets.add_icon} alt="" />
          <p className='hidden md:block truncate w-[120px]'>Termék hozzáadása</p>
        </NavLink>

        <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1" to="/list">
          <img className='w-5 h-5' src={assets.parcel_icon} alt="" />
          <p className='hidden md:block truncate w-[120px]'>Termékek</p>
        </NavLink>

        <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1" to="/orders">
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='hidden md:block truncate w-[120px]'>Rendelések</p>
        </NavLink>

        <NavLink className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1" to="/manageusers">
          <img className='w-5 h-5' src={assets.user_icon} alt="" />
          <p className='hidden md:block truncate w-[120px]'>Felhasználók</p>
        </NavLink>


      </div>
    </div>
  )
}

export default Sidebar
