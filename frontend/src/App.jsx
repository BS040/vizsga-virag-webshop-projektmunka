import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import Delivery from './pages/Delivery'
import DataProtection from './pages/DataProtection'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import ScrollToTop from './components/ScrollToTop'
// import ResetPassword from './pages/ResetPassword'


const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar/>
      <SearchBar/>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/product/:productId' element={<Product/>}/>
        <Route path='/cart'  element={<Cart/>}/>
        <Route path='/login'  element={<Login/>}/>
        <Route path='/placeorder'  element={<PlaceOrder/>}/>
        <Route path='/orders'  element={<Orders/>}/>
        <Route path='/delivery'  element={<Delivery/>}/>
        <Route path='/dataprotection'  element={<DataProtection/>}/>
        <Route path='/verify'  element={<Verify/>}/>
        {/* <Route path='/reset-password/:token'  element={<ResetPassword/>}/> */}

      </Routes>
      <Footer/>
    </div>
  )
}

export default App
