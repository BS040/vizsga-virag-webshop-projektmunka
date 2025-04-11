import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, symbol } from '../App';
import { toast } from 'react-toastify';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');


  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        setList((prevList) => prevList.filter((item) => item._id !== id));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);


  const filteredList = list.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <>
      <p className='mb-2 font-bold text-center text-lg'>Minden Termék ({list.length})</p>
      <div className="w-full flex justify-center">
      <input
        type="text"
        placeholder="Keresés terméknévre..."
        className="mb-3 px-3 py-2 border rounded-none text-center w-full max-w-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      </div>
      <div className='flex flex-col gap-2'>
        {/* Fejléc */}
        <div className='hidden md:grid grid-cols-[0.5fr_1.11fr_0.55fr_0.40fr_0.30fr_0.40fr_0.50fr] items-center py-2 px-3 border bg-gray-100 text-sm font-bold'>
          <b>Kép</b>
          <b>Termék neve</b>
          <b>Kategória</b>
          <b>Méret</b>
          <b>Ár</b>
          <b>Felkapott</b>
          <b className='text-center'>Művelet</b>
        </div>

        {/* Terméklista */}
        {filteredList.map((item) => (
          <ProductRow key={item._id} item={item} removeProduct={removeProduct} navigate={navigate} />
        ))}
      </div>
    </>
  );
};

const ProductRow = ({ item, removeProduct, navigate }) => {
  const [selectedSize, setSelectedSize] = useState(item.sizes[0]?.size || "");
  const handleSizeChange = (event) => setSelectedSize(event.target.value);

  const selectedPrice = item.sizes.find(s => s.size === selectedSize)?.price || "N/A";

  return (
    <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center gap-3 py-2 px-3 border text-sm'>
      <img className='w-12 h-12 object-cover' src={item.image[0]} alt={item.name} />
      <p className='font-medium'>{item.name}</p>

      {/* Kategóriák */}
      <div className="flex gap-2">
        {item.category === 'Szálas' && (
          <span className='px-2 py-1 bg-green-200'>
            Szálas
          </span>
        )}
        {item.category === 'Csokor' && (
          <span className='px-2 py-1 bg-blue-200'>
            Csokor
          </span>
        )}
        {item.category === 'Cserepes' && (
          <span className='px-2 py-1 bg-yellow-200'>
            Cserepes
          </span>
        )}
      </div>

      {/* Méretválasztó */}
      <select value={selectedSize} onChange={handleSizeChange} className='border px-2 py-1 rounded-none'>
        {item.sizes.map((sizeObj) => (
          <option key={sizeObj._id} value={sizeObj.size}>{sizeObj.size}</option>
        ))}
      </select>

      {/* Ár */}
      <p className='font-bold'>{selectedPrice} {symbol}</p>

      {/* Felkapott */}
      <p className={`font-bold ${item.bestSeller ? 'text-green-600' : 'text-red-600'}`}>
        {item.bestSeller ? 'Igen' : 'Nem'}
      </p>

      {/* Műveletek */}
      <div className="flex gap-3 text-lg">
        {/* Szerkesztés ikon */}
        <p onClick={() => navigate(`/update/${item._id}`)} className="cursor-pointer text-blue-600 hover:text-blue-800">
          ✏️
        </p>

        {/* Törlés ikon */}
        <p onClick={() => removeProduct(item._id)} className='cursor-pointer text-red-600 hover:text-red-800'>
          ✖
        </p>
      </div>
    </div>
  );
};

export default List;
