import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login';
import Update from './pages/Update'; // Importáljuk az Update komponenst
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ManageUsers from './pages/ManageUsers'; // Importáld az új oldalt
import ScrollToTop from './components/ScrollToTop'






export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const symbol = 'Ft';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
            <ScrollToTop />
              <Routes>
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/update/:id' element={<Update token={token} />} /> {/* Hozzáadtuk az Update route-ot */}
                <Route path='/manageusers' element={<ManageUsers token={token} />} /> {/* Hozzáadtuk a ManageUsers route-ot */}
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
