import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    // A termékeket időrendbe rendezése, a legújabbak kerülnek előre
    const sortedProducts = [...products].sort((a, b) => b.date - a.date); // csökkenő sorrend
    setLatestProducts(sortedProducts.slice(0, 10)); // Csak az első 10 legújabb termék
  }, [products]);

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={"LEGÚJABB "} text2={"TERMÉKEINK"} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
         Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus explicabo numquam laborum suscipit praesentium similique quis, tempore quasi, nemo natus, nulla sunt voluptatem rem aperiam quia et doloribus placeat pariatur!
        </p>
      </div>
      {/* Termékek */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {
          latestProducts.map((item, index) => (
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
          ))
        }
      </div>
    </div>
  );
};

export default LatestCollection;
