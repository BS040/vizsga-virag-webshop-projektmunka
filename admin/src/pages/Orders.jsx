import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, symbol } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } });
      if (response.data.success) {
        const ordersWithAmount = response.data.orders.map(order => {
          let totalAmount = 0;
          order.items.forEach(item => {
            totalAmount += item.price * item.quantity;
          });
          order.amount = totalAmount;
          return order;
        });

        const sortedOrders = ordersWithAmount.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${backendUrl}/api/order/status`, { orderId, status: event.target.value }, { headers: { token } });
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const paymentStatusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${backendUrl}/api/order/payment-status`, { orderId, paymentStatus: event.target.value }, { headers: { token } });
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Két külön lista az aktív és a teljesített rendelésekhez
  const activeOrders = orders.filter(order => order.status !== "Lejárt/Teljesített");
  const completedOrders = orders.filter(order => order.status === "Lejárt/Teljesített");

  return (
    <div>
      {/* Aktív rendelések */}
      <p className='mb-2 font-bold text-lg'>Aktív rendelések ({activeOrders.length})</p>
      <div>
        {activeOrders.map((order, index) => (
          <OrderItem key={index} order={order} statusHandler={statusHandler} paymentStatusHandler={paymentStatusHandler} />
        ))}
      </div>

      {/* Teljesített rendelések csak akkor jelenik meg, ha van ilyen */}
      {completedOrders.length > 0 && (
        <div className="mt-10">
          <p className='mb-2 font-bold text-lg'>Teljesített rendelések ({completedOrders.length})</p>
          <div>
            {completedOrders.map((order, index) => (
              <OrderItem key={index} order={order} statusHandler={statusHandler} paymentStatusHandler={paymentStatusHandler} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Külön komponens az egyes rendelésekhez
const OrderItem = ({ order, statusHandler, paymentStatusHandler }) => {
  let borderColor;
  switch (order.status) {
    case "Lejárt/Teljesített":
      borderColor = 'border-green-700';
      break;
    case "Átvehető":
      borderColor = 'border-green-300';
      break;
    case "Előkészítés alatt":
      borderColor = 'border-yellow-300';
      break;
    case "Megrendelve":
      borderColor = 'border-blue-300';
      break;
    default:
      borderColor = 'border-gray-200';
  }

  return (
    <div className={`border-4 ${borderColor} p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700`}>
      <div className='grid grid-cols-1 sm:grid-cols-[0-5fr_2fr_1fr] md:grid-cols-3 lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start'>
        <img className='w-12' src={assets.parcel_icon} alt="" />
        <div>
          {order.items.map((item, index) => (
            <p className='py-0.5' key={index}>
              {item.name} x {item.quantity} <span>{item.size}</span>
              {index < order.items.length - 1 && ','}
            </p>
          ))}
          <p className='mt-3 mb-2 font-semibold'>{order.address.firstName + " " + order.address.lastName}</p>
          <div>
            <p>{order.address.street + ", "}</p>
            <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
          </div>
          <p>{order.address.phone}</p>
          <p>{order.address.email}</p>
        </div>
        <div className="flex flex-col items-start">
          <p className='text-sm sm:text-[15px]'>Termékek: {order.items.length}</p>
          <p className='mt-3'>Fizetés: {order.paymentMethod}</p>
          <p>Fizetés állapota: {order.payment ? "Teljesített" : "Folyamatban"}</p>
          <p>Dátum: {new Date(order.date).toLocaleDateString()}</p>
          <p className='font-semibold mt-3 text-sm sm:text-[15px]'>Érték: {order.amount} {symbol}</p>
        </div>
        <p></p>

        {/* Státusz és fizetés állapot kezelése */}
        <div className='flex flex-col justify-start items-end'>
          <span className='mr-4 mb-1 font-semibold'>Rendelés állapota</span>
          <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className='p-2 font-semibold mb-3'>
            <option value="Megrendelve">Megrendelve</option>
            <option value="Előkészítés alatt">Előkészítés alatt</option>
            <option value="Átvehető">Átvehető</option>
            <option value="Lejárt/Teljesített">Lejárt/Teljesített</option>
          </select>

          <span className='mr-3 mt-2 font-semibold'>Fizetés állapota</span>
          <select onChange={(event) => paymentStatusHandler(event, order._id)} value={order.payment ? "Teljesített" : "Folyamatban"} className='p-2 font-semibold mt-1'>
            <option value="Folyamatban">Folyamatban</option>
            <option value="Teljesített">Teljesített</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Orders;
