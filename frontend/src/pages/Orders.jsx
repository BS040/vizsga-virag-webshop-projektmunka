import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Orders = () => {
  const { backendUrl, symbol, clearCart, setCartItems } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showInProgress, setShowInProgress] = useState(true);
  const navigate = useNavigate();
  const [isCompletedOrdersOpen, setIsCompletedOrdersOpen] = useState(false);
  const token = localStorage.getItem('token');

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value; // új státusz lekérdezése
    try {
      const response = await axios.post(`${backendUrl}/api/order/status`, { orderId, status: newStatus }, { headers: { token } });

      if (response.data.success) {
        await loadOrderData();

        // Ha a státusz "Megrendelve", ki törli a kosarat
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
        let completedItems = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            allOrdersItem.push(item);

            if (order.status === 'Teljesített') {
              completedItems.push(item);
            }
          });
        });
        
  
        // Előző rendelési szám lekérése
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
        setCompletedOrders(completedItems.reverse());
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
    const destination = 'Budapest, Erzsébet krt. 19, 1073'; // A cím, ahova navigálni lehet
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(googleMapsUrl, '_blank'); // Új fülön megnyílik a Google Maps-et
  };

  const navigateToProducts = () => {
    navigate('/products'); // Termékek oldalra navigál
  };

  const toggleCompletedOrders = () => {
    setIsCompletedOrdersOpen(!isCompletedOrdersOpen); // Állapot váltása
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow border-t pt-16">
        <div className="flex justify-between items-center mb-5">
          <div className="text-2xl">
            <Title text2={'RENDELÉSEIM'} />
          </div>
          <button
            onClick={loadOrderData}
            className="border px-5 py-3 text-sm font-medium"
          >
            Státusz frissítése
          </button>
        </div>

        {orderData.length === 0 ? (
          <div className="flex items-center justify-center flex-grow flex-col pt-10">
            <p className="text-center text-gray-500">Nincsenek rendelések</p>
            <button
              onClick={navigateToProducts}
              className="mt-4 px-6 py-3 text-white bg-black hover:bg-gray-800"
            >
              Nézd meg a termékeket
            </button>
          </div>
        ) : (
          <div>
            {/* Folyamatban lévő rendelések */}
            {orderData.filter(item => item.status !== 'Teljesített').length > 0 && (
              <div className="mt-10">
                <button
                  onClick={() => setShowInProgress((prev) => !prev)}
                  className="w-full flex justify-between items-center bg-gray-200 p-3 font-semibold rounded-none border"
                >
                  <span>Folyamatban lévő rendelések ({orderData.filter(item => item.status !== 'Teljesített').length})</span>
                  <span>{showInProgress ? '▲' : '▼'}</span>
                </button>

                {showInProgress && (
                  <div className="mt-3">
                    {orderData.filter(item => item.status !== 'Teljesített').map((order, index) => (
                      <div
                        key={index}
                        className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                      >
                        <div className="flex items-start gap-6 text-sm">
                          <img className="order-item-img" src={order.image[0]} alt="" />
                          <div>
                            <p className="sm:text-base font-medium">{order.name}</p>
                            <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                              <p>{order.price} {symbol}</p>
                              <p>Mennyiség: {order.quantity}</p>
                              <p>Opció: {order.size}</p>
                            </div>
                            <p className="mt-1">
                              Dátum: <span className="text-gray-400">{new Date(order.date).toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </p>
                            <p className="mt-1">Fizetés: <span className="text-gray-400">{order.paymentMethod}</span></p>
                            <p className="mt-1">
                              Fizetés állapota: <span className="text-gray-400">{order.payment ? "Teljesített" : "Folyamatban"}</span>
                            </p>
                          </div>
                        </div>

                        <div className="md:w-1/2 flex justify-end mr-10">
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2">
                              <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                              <p className="text-sm md:text-base">{order.status}</p>
                            </div>
                            {order.status === 'Átvehető' && (
                              <button
                                onClick={handleClick}
                                className="border px-3 py-2 text-sm font-medium bg-black text-white mt-2"
                              >
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
            )}

            {/* Teljesített rendelések */}
            {completedOrders.length > 0 && (
              <div className="mt-10">
                <button
                  onClick={() => setShowCompleted((prev) => !prev)}
                  className="w-full flex justify-between items-center bg-gray-200 p-3 font-semibold rounded-none border"
                >
                  <span>Teljesített rendelések ({completedOrders.length})</span>
                  <span>{showCompleted ? '▲' : '▼'}</span>
                </button>

                {showCompleted && (
                  <div className="mt-3">
                    {completedOrders.map((order, index) => (
                      <div
                        key={index}
                        className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                      >
                        <div className="flex items-start gap-6 text-sm">
                          <img className="order-item-img" src={order.image[0]} alt="" />
                          <div>
                            <p className="sm:text-base font-medium">{order.name}</p>
                            <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                              <p>{order.price} {symbol}</p>
                              <p>Mennyiség: {order.quantity}</p>
                              <p>Opció: {order.size}</p>
                            </div>
                            <p className="mt-1">
                              Dátum: <span className="text-gray-400">{new Date(order.date).toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </p>
                            <p className="mt-1">Fizetés: <span className="text-gray-400">{order.paymentMethod}</span></p>
                            <p className="mt-1">
                              Fizetés állapota: <span className="text-gray-400">{order.payment ? "Teljesített" : "Folyamatban"}</span>
                            </p>
                          </div>
                        </div>

                        <div className="md:w-1/2 flex justify-end mr-10">
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2">
                              <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                              <p className="text-sm md:text-base">{order.status}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;