import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Orders = () => {
  const { backendUrl, symbol, clearCart, setCartItems } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value; // új státusz lekérdezése
    try {
      const response = await axios.post(`${backendUrl}/api/order/status`, { orderId, status: newStatus }, { headers: { token } });

      if (response.data.success) {
        await loadOrderData();

        // Ha a státusz "Megrendelve", törölje a kosarat
        if (newStatus === "Megrendelve") {
          clearCart(); // Kosár törlése a rendelés után
        }
      }
    } catch (error) {
      console.error(error);
    }
  };


  const loadOrderData = async () => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }
  
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            allOrdersItem.push(item);
          });
        });
  
        // Előző rendelés szám lekérése
        const previousOrderCount = parseInt(localStorage.getItem('previousOrderCount')) || 0;
  
        // Új rendelés érkezett?
        const currentOrderCount = allOrdersItem.length;
        if (currentOrderCount > previousOrderCount) {
          // Kosár nullázása
          const storedCart = localStorage.getItem('cartItems');
          if (storedCart) {
            let cart = JSON.parse(storedCart);
            Object.keys(cart).forEach(productId => {
              Object.keys(cart[productId]).forEach(option => {
                cart[productId][option] = 0;
              });
            });
            localStorage.setItem('cartItems', JSON.stringify(cart));
            setCartItems(cart);
          }
  
          // Frissítjük az előző rendelés számot
          localStorage.setItem('previousOrderCount', currentOrderCount.toString());
        }
  
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  useEffect(() => {
    if (token) {
      loadOrderData();
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart)); // Kosár adatok betöltése
      }
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  // useEffect(() => {
  //   if (orderData.length > 0) {
  //     const storedCart = localStorage.getItem('cartItems');
  //     if (storedCart) {
  //       let cart = JSON.parse(storedCart);
        
  //       // Végigmegyünk az összes terméken és minden mennyiséget 0-ra állítunk
  //       Object.keys(cart).forEach(productId => {
  //         Object.keys(cart[productId]).forEach(option => {
  //           cart[productId][option] = 0;
  //         });
  //       });
  
  //       // Frissített kosár mentése
  //       localStorage.setItem('cartItems', JSON.stringify(cart));
  //       setCartItems(cart); // Context frissítése is
  //     }
  //   }
  // }, [orderData.length]); // Figyeli, ha változik az orderData hossza
  
  
  

  const handleClick = () => {
    const destination = 'Budapest, Erzsébet krt. 19, 1073'; // A cím, ahova navigálni szeretnél
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(googleMapsUrl, '_blank'); // Új fülön megnyitja a Google Maps-et
  };

  const navigateToProducts = () => {
    navigate('/products'); // Ide állítsd be a termékek oldalának az URL-jét
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <div className="flex-grow border-t pt-16">
      <div className="flex justify-between items-center mb-5">
        <div className='text-2xl'>
          <Title text2={'RENDELÉSEIM'} />
        </div>
        <button
          onClick={loadOrderData}
          className='border px-5 py-3 text-sm font-medium'>
          Státusz frissítése
        </button>
      </div>

      {orderData.length === 0 ? (
        <div className="flex items-center justify-center flex-grow flex-col pt-10">
            <p className="text-center text-gray-500">Nincsenek rendelések</p>
            <button
              onClick={navigateToProducts}
              className="mt-4 px-6 py-3 text-white bg-black hover:bg-gray-800">
              Nézd meg a termékeket
            </button>
          </div>
        ) : (
      <div>
        {orderData.map((item, index) => (
          <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div className='flex items-start gap-6 text-sm'>
              <img className='order-item-img ' src={item.image[0]} alt="" />
              <div>
                <p className='sm:text-base font-medium '>{item.name}</p>
                <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                  <p>{item.price} {symbol}</p>
                  <p>Mennyiség: {item.quantity}</p>
                  <p>Opció: {item.size}</p>
                </div>
                <p className='mt-1'>
                  Dátum: <span className='text-gray-400'>{new Date(item.date).toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </p>
                <p className='mt-1'>Fizetés: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                <p className='mt-1'>
                  Fizetés állapota: <span className='text-gray-400'>{item.payment ? "Teljesített" : "Folyamatban"}</span>
                </p>
              </div>
            </div>

            <div className='md:w-1/2 flex justify-end mr-10'>
              <div className='flex flex-col items-end'>
                <div className='flex items-center gap-2'>
                  <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                  <p className='text-sm md:text-base'>{item.status}</p>
                </div>
                {/* Gomb megjelenítése, ha a státusz "átvehető" */}
                {item.status === 'Átvehető' && (
                  <button
                    onClick={handleClick}
                    className='border px-3 py-2 text-sm font-medium bg-black text-white mt-2'>
                    Útvonal
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
        )}
    </div>
    </div>
  );
};

export default Orders;
