import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { symbol } = useContext(ShopContext);

  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden">
        {/* Kép beállítása egy fix méretre */}
        <img
          className="hover:scale-110 transition ease-in-out w-full h-48 object-cover"
          src={image[0]}
          alt={name}
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      {/* Ár beállítása és formázása */}
      <p className="text-sm font-medium">{price} {symbol}</p>
    </Link>
  );
};

export default ProductItem;
