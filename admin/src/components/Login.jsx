import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'


const Login = ({setToken}) => {

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const onSubmitHandler = async(e) =>{
        try {
            e.preventDefault();
            const response = await axios.post(backendUrl + '/api/user/admin', {email,password})
            if (response.data.success) {
              setToken(response.data.token)
            } else {
              toast.error(response.data.message)
            }
                
        } catch (error) {
            console.log(error);
            toast.error(response.data.message)
            
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
      <div className='bg-white shadow-md rounded-none px-8 py-6 max-w-md'>
        <h1 className='text-2xl text-center font-bold mb-4'>Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
            <div className='mb-3 min-w-72'>
                <p className='text-sm font-medium text-center text-gray-700 mb-2'>E-mail cím</p>
                <input onChange={(e)=> setEmail(e.target.value)} value={email} className='rounded-none w-full px-3 py-2 border text-center border-gray-300 outline-none' type="email" placeholder='Írd be az e-mailt' required/>
            </div>
            <div className='mb-3 min-w-72'>
                <p className='text-sm font-medium text-center text-gray-700 mb-2'>Jelszó</p>
                <input onChange={(e)=> setPassword(e.target.value)} value={password} className='rounded-none w-full px-3 py-2 border text-center border-gray-300 outline-none' type="password" placeholder='Írd be a jelszót' required/>
            </div>
            <button className='mt-2 w-full py-2 px-4 rounded-none text-white bg-black' type="submit"> Belépés </button>
        </form>
      </div>
    </div>
  )
}

export default Login
