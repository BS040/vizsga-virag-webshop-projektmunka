import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { products, symbol, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  // Ellenőrzés, hogy van-e termék a kosárban
  const hasItemsInCart = Object.values(cartItems).some(item => Object.values(item).some(quantity => quantity > 0));

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];

      // Az kosár termékeihez adjuk hozzá az árakat
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          const quantity = cartItems[itemId][size];
          if (quantity > 0) {
            const productData = products.find((product) => product._id === itemId);
            if (productData) {
              // Megkeressük a mérethez tartozó árat és készletet
              const sizeData = productData.sizes.find((s) => s.size === size);
              const price = sizeData ? sizeData.price : 0;
              const stock = sizeData ? sizeData.stock : 0; // Készlet mennyiség
              tempData.push({
                _id: itemId,
                size,
                quantity,
                price,  // Tároljuk az árat is
                stock,  // Tároljuk a készletet
                productData
              });
            }
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const handleInputChange = (item, e) => {
    let value = e.target.value === '' ? 1 : Number(e.target.value);

    // Ha az érték meghaladja a készletet, akkor a megfelelő tartományba korlátozzuk
    if (value < 1) {
      value = 1;  // Minimum 1 kell legyen
    }
    if (value > item.stock) {
      value = item.stock;  // Nem lehet nagyobb, mint a készlet
    }

    // Csak akkor frissítjük a mennyiséget, ha érvényes értéket adunk meg
    updateQuantity(item._id, item.size, value);
  };

  const handleInput = (item, e) => {
    // A nem kívánt karakterek eltávolítása, hogy ne lehessen nagyobb számot beírni
    const max = item.stock;
    const value = e.target.value;

    // Ha a beírt szám meghaladja a maximális készletet, eltávolítjuk az extra karaktereket
    if (Number(value) > max) {
      e.target.value = max;
    }
  };

  const handleAddToCart = (item) => {
    // Hogy a kosárban lévő mennyiség elérte-e a készletet
    const currentQuantity = cartItems[item._id] ? cartItems[item._id][item.size] || 0 : 0;
    
    if (currentQuantity >= item.stock) {
      // Ha már a kosárban van a maximális mennyiség, nem lehet hozzáadni
      alert('Nem tudsz több terméket hozzáadni a kosárhoz, mint amennyi készleten van.');
      return;
    }

    // Növeli a mennyiséget
    updateQuantity(item._id, item.size, currentQuantity + 1);
  };

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text2={"KOSÁR"} />
      </div>
      <div>
        {cartData.map((item, index) => {
          return (
            <div key={index} className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4">
              <div className="flex items-start gap-6">
                <img className="w-16 sm:w-20" src={item.productData.image[0]} alt="" />
                <div>
                  <p className="text-xs sm:text-lg font-medium ">{item.productData.name}</p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>{item.price} {symbol}</p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item.size}</p>
                  </div>
                </div>
              </div>

              <input
                onInput={(e) => handleInput(item, e)}  // Figyeli az inputot, hogy letiltsa a nagyobb számot
                onChange={(e) => handleInputChange(item, e)} // Valódi érték frissítése
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}  // Minimum érték 1
                max={item.stock}  // Beállítja a maximális értéket a készlet alapján
                defaultValue={item.quantity}
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt=""
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end mb-8"> 
            <button 
              onClick={() => navigate('/placeorder')} 
              className={`bg-black text-white text-sm my-8 px-8 py-3 ${!hasItemsInCart ? 'opacity-50 cursor-not-allowed' : ''}`} 
              disabled={!hasItemsInCart}
            >
              TOVÁBB A RENDELÉSHEZ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


// <div className="w-full text-end mb-8"> Itt az mb-8 hozzálett adva 
