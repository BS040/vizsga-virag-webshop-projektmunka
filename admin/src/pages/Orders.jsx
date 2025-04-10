import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, symbol } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [showActive, setShowActive] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = legújabb, 'asc' = legrégebbi
  const [showExpired, setShowExpired] = useState(false);





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

  // Aktív rendelések
  const activeOrders = orders.filter(order => order.status !== "Nem teljesített" && order.status !== "Teljesített");
  const filteredActiveOrders = activeOrders.filter(order => {
    const statusMatch = statusFilter ? order.status === statusFilter : true;
    const paymentMatch = paymentFilter
      ? paymentFilter === "Teljesített"
        ? order.payment === true
        : order.payment === false
      : true;
    const dateMatch = filterDate
      ? new Date(order.date) >= new Date(filterDate)
      : true;
    const searchMatch = searchTerm
      ? (
        (order.address?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (order.address?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      )
      : true;

    return statusMatch && paymentMatch && dateMatch && searchMatch;
  });

  const sortedFilteredActiveOrders = [...filteredActiveOrders].sort((a, b) => {
    return sortOrder === 'desc'
      ? new Date(b.date) - new Date(a.date) // Legújabb elöl
      : new Date(a.date) - new Date(b.date); // Legrégebbi elöl
  });



  const completedOrders = orders.filter(order => order.status === "Teljesített");
  const expiredOrders = orders.filter(order => order.status === "Nem teljesített");

  return (
    <div>
      {/* Keresés mező és szűrők konténer */}
      <div className="mb-6 flex flex-col items-center">
        {/* Kereső mező */}
        <div className="mb-4 w-full max-w-md">
          <label className="block mb-1 font-semibold text-center">Keresés (név vagy email)</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pl. Kovács Anna vagy anna@email.hu"
            className="p-2 border rounded-none w-full"
          />
        </div>

        {/* Szűrők sorban, középen */}
        <div className="flex flex-wrap justify-center gap-6">
          {/* Rendezés */}
          <div>
            <label className="block mb-1 font-semibold text-center">Rendezés</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 border rounded-none"
            >
              <option value="desc">Legújabb</option>
              <option value="asc">Legrégebbi</option>
            </select>
          </div>

          {/* Rendelés állapota */}
          <div>
            <label className="block mb-1 font-semibold text-center">Rendelés állapota</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded-none"
            >
              <option value="">Összes</option>
              <option value="Megrendelve">Megrendelve</option>
              <option value="Előkészítés alatt">Előkészítés alatt</option>
              <option value="Átvehető">Átvehető</option>
            </select>
          </div>

          {/* Fizetés állapota */}
          <div>
            <label className="block mb-1 font-semibold text-center">Fizetés állapota</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="p-2 border rounded-none"
            >
              <option value="">Összes</option>
              <option value="Folyamatban">Folyamatban</option>
              <option value="Teljesített">Teljesített</option>
            </select>
          </div>

          {/* Dátumszűrés */}
          <div>
            <label className="block mb-1 font-semibold text-center">Dátumtól</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="p-1.5 border rounded-none"
            />
          </div>
        </div>
      </div>


      {/* Aktív rendelések */}
      <div className="mt-10">
        <button
          onClick={() => setShowActive(prev => !prev)}
          className="w-full flex justify-between items-center bg-gray-200 p-3 font-semibold rounded-none border"
        >
          <span>Aktív rendelések ({sortedFilteredActiveOrders.length})</span>
          <span>{showActive ? '▲' : '▼'}</span>
        </button>

        {showActive && (
          <div className="mt-3">
            {sortedFilteredActiveOrders.length > 0 ? (
              sortedFilteredActiveOrders.map((order, index) => (
                <OrderItem
                  key={index}
                  order={order}
                  statusHandler={statusHandler}
                  paymentStatusHandler={paymentStatusHandler}
                />
              ))
            ) : (
              <div className="text-center text-gray-500">Nincsenek aktív rendelések</div>
            )}
          </div>
        )}
      </div>


      {/* Teljesített rendelések */}
      {completedOrders.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowCompleted(prev => !prev)}
            className="w-full flex justify-between items-center bg-gray-200 p-3 font-semibold rounded-none border"
          >
            <span>Teljesített rendelések ({completedOrders.length})</span>
            <span>{showCompleted ? '▲' : '▼'}</span>
          </button>

          {showCompleted && (
            <div className="mt-3">
              {completedOrders.map((order, index) => (
                <OrderItem
                  key={index}
                  order={order}
                  statusHandler={statusHandler}
                  paymentStatusHandler={paymentStatusHandler}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Nem teljesített rendelések */}
      {expiredOrders.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowExpired(prev => !prev)}
            className="w-full flex justify-between items-center bg-gray-200 p-3 font-semibold rounded-none border"
          >
            <span>Nem teljesített rendelések ({expiredOrders.length})</span>
            <span>{showExpired ? '▲' : '▼'}</span>
          </button>

          {showExpired && (
            <div className="mt-3">
              {expiredOrders.map((order, index) => (
                <OrderItem
                  key={index}
                  order={order}
                  statusHandler={statusHandler}
                  paymentStatusHandler={paymentStatusHandler}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Külön színek az egyes rendelés állapotokhoz
const OrderItem = ({ order, statusHandler, paymentStatusHandler }) => {
  let borderColor;
  switch (order.status) {
    case "Nem teljesített":
      borderColor = 'border-red-600';
      break;
    case "Teljesített":
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
          <p className='mt-3 mb-2 font-semibold'>{order.address.fullName}</p>
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
          <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className='p-2 font-semibold mb-3 rounded-none'>
            <option value="Megrendelve">Megrendelve</option>
            <option value="Előkészítés alatt">Előkészítés alatt</option>
            <option value="Átvehető">Átvehető</option>
            <option value="Teljesített">Teljesített</option>
            <option value="Nem teljesített">Nem teljesített</option>
          </select>

          <span className='mr-3 mt-2 font-semibold'>Fizetés állapota</span>
          <select onChange={(event) => paymentStatusHandler(event, order._id)} value={order.payment ? "Teljesített" : "Folyamatban"} className='p-2 font-semibold mt-1 rounded-none'>
            <option value="Folyamatban">Folyamatban</option>
            <option value="Teljesített">Teljesített</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Orders;
