import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Products = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('newest');
  const [showFilter, setShowFilter] = useState(false);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) => subCategory.includes(item.subCategory));
    }

    if (sortType === 'newest') {
      productsCopy.sort((a, b) => b.date - a.date);
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'lowtohigh':
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case 'hightolow':
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col items-center pt-10">
      <div className="text-2xl text-center mb-4">
        <Title text1={'MINDEN '} text2={'TERMÉK'} />
      </div>

      <div className="w-full max-w-screen-xl flex flex-col gap-1 relative">
        <div className="flex justify-between w-full items-center">
          <div className="flex items-center gap-2">
            <p
              onClick={() => setShowFilter(!showFilter)}
              className="my-2 text-xl flex items-center cursor-pointer gap-2"
            >
              SZŰRŐK
              <img
                className={`h-3 ${showFilter ? 'rotate-90' : ''}`}
                src={assets.dropdown_icon}
                alt=""
              />
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="border-2 border-gray-300 text-sm px-2 py-2 cursor-pointer"
            >
              <option value="newest">Újdonság</option>
              <option value="lowtohigh">Ár: Növekvő</option>
              <option value="hightolow">Ár: Csökkenő</option>
            </select>
          </div>
        </div>

        {/* Kategóriák és Alkategóriák (szűrők) */}
        <div
          className={` w-full md:w-1/4 transition-all duration-300 ease-in-out absolute bg-white shadow-lg ${showFilter ? 'max-h-auto overflow-y-auto' : 'max-h-0 overflow-hidden'}`}
          style={{ top: '50px', left: '0', right: '0', zIndex: 10 }}
        >
          <div className="pl-2 pr-2 py-3">
            <p className="mb-3 text-sm font-medium bg-gray-700 text-white p-2">KATEGÓRIA</p>
            <div className="pl-3 flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className="flex-gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={'Csokor'}
                  onChange={toggleCategory}
                />{' '}
                Csokor
              </p>
              <p className="flex-gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={'Szálas'}
                  onChange={toggleCategory}
                />{' '}
                Szálas
              </p>
              <p className="flex-gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={'Cserepes'}
                  onChange={toggleCategory}
                />{' '}
                Cserepes
              </p>
            </div>
          </div>

          {/* Alkategóriák - Kisebb margóval elválasztva és biztosított border */}
          <div className="pl-2 pr-2 py-3 mt-2">
            <p className="mb-3 text-sm font-medium bg-gray-700 text-white p-2">TÍPUSOK</p>
            <div className="pl-3 flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className="flex-gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={'Esküvői'}
                  onChange={toggleSubCategory}
                />{' '}
                Esküvői
              </p>
              <p className="flex-gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={'Kerti'}
                  onChange={toggleSubCategory}
                />{' '}
                Kerti
              </p>
              <p className="flex-gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={'Dekoráció'}
                  onChange={toggleSubCategory}
                />{' '}
                Dekoráció
              </p>
            </div>
          </div>
        </div>

        {/* Termékek megjelenítése */}
        <div className="flex-1 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
