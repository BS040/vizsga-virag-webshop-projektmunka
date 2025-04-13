import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, symbol, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);  // Készlet 
  const [quantity, setQuantity] = useState(1);  // A felhasználó által választott mennyiség

  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(Array.isArray(product.image) ? product.image[0] : '');
      // Alapértelmezett méret és ár

      if(Array.isArray(product.sizes) && product.sizes.length > 0){
      const defaultSize = product.sizes[0];
      setSize(defaultSize.size);
      setPrice(defaultSize.price);
      setStock(defaultSize.stock); // Alapértelmezett készlet 
      setQuantity(1);
      }
    }
  }, [productId, products]);

  const handleSizeChange = (selectedSize) => {
    const selectedProductSize = productData.sizes.find(size => size.size === selectedSize);

    if (selectedProductSize){
    setSize(selectedProductSize.size);
    setPrice(selectedProductSize.price);
    setStock(selectedProductSize.stock);  // Frissíti a készletet 
    setQuantity(1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
  
    // Csak számokat engedünk, és nem engedjük, hogy a mennyiség meghaladja a készletet
    if (value === '' || (value >= 1 && value <= stock && !isNaN(value))) {
      setQuantity(value === '' ? '' : Number(value)); // Ha üres, hagyjuk üresen, különben számra konvertáljuk
    }
  };
  

  const isQuantityValid = quantity >= 1 && quantity <= stock;  // Mennyiség validálása

<button
  onClick={() => {
    if (size && quantity > 0 && quantity <= stock) {
      addToCart(productData._id, size, quantity); // A kiválasztott mennyiséget is átadobjuk a kosárba
    } else {
      alert("Kérlek, válassz érvényes mennyiséget!");
    }
  }}
  className={`bg-black text-white px-3 py-2 text-xs active:bg-gray-700 ${!isQuantityValid ? 'opacity-50 cursor-not-allowed' : ''} w-32 h-12`}
  disabled={!isQuantityValid}  // Ha a mennyiség nem érvényes, a gomb nem elérhető
>
  Kosárba  {/* A gombon is megjelenhet a választott mennyiség de szerintem az ronda vagy furán néz ki*/}
</button>


  if (!productData) {
    return <div>Betöltés...</div>;
  }

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        <div className='flex-1'>
          {/* Fő kép */}
          <div className='w-full sm:w-[100%] border-2 border-gray-400'>
            <img className='w-full max-w-full h-auto object-cover aspect-[4/3]' src={image} alt='Termék fő kép' />
          </div>

          {/* Kis képek a fő kép alatt */}
          <div className='justify-center flex sm:flex-row flex-wrap sm:overflow-x-auto overflow-y-auto w-full mt-4 gap-4 justify-start'>
            {Array.isArray(productData.image) &&
              productData.image.map((item, index) => (
                <img
                  onClick={() => setImage(item)}
                  src={item}
                  key={index}
                  className='w-[calc(100%/4-1rem)] h-[100px] object-cover sm:w-[100px] sm:h-[100px] flex-shrink-0 cursor-pointer border-gray-400 border-2'
                  alt='Termék kép'
                />
              ))}
          </div>
        </div>

        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            {[...Array(4)].map((_, i) => (
              <img key={i} src={assets.star_icon} alt='csillag' className='w-3.5' />
            ))}
            <img src={assets.star_dull_icon} alt='fél csillag' className='w-3.5' />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>
            {price ? `${price} ${symbol}` : 'Ár nem elérhető'}
          </p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

          {Array.isArray(productData.sizes) && productData.sizes.length > 0 && (
            <div className='flex flex-col gap-4 my-8'>
              <p>Opció választása:</p>
              <div className='flex gap-2'>
                {productData.sizes.map((item, index) => (
                  <button
                    onClick={() => handleSizeChange(item.size)}
                    className={`border py-2 px-4 bg-gray-100 ${item.size === size ? 'border-gray-400' : ''}`}
                    key={index}
                  >
                    {item.size}
                  </button>
                ))}
              </div>
              <p className='mb-0'>
                Készlet: {stock} db
              </p>
              <div className='mt-0'>
                <input
                  type="number"
                  min="1"
                  max={stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className='border px-4 py-2 w-24'
                />
              </div>
              <button
                onClick={() => {
                  if (size && quantity > 0 && quantity <= stock) {
                    addToCart(productData._id, size, quantity); // A kiválasztott mennyiséget is átdobjuk a kosárba
                  } else {
                    alert("Kérlek, válassz érvényes mennyiséget!");
                  }
                }}
                className={`bg-black text-white px-3 py-2 text-xs active:bg-gray-700 ${!isQuantityValid ? 'opacity-50 cursor-not-allowed' : ''} w-32 h-12`}
                disabled={!isQuantityValid}  // Ha a mennyiség nem érvényes, a gomb nem elérhető
              >
                Kosárba  {/* A gombon is megjelenhet a választott mennyiség de szerintem az ronda vagy furán nez ki */}
              </button>

            </div>
          )}




          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
          <div className='flex items-center gap-2'>
              <img src={assets.cart_icon} alt="Utánvételes fizetés" className="w-6 h-6" />
              <p>Utánvételes fizetés</p>
            </div>
            <div className='flex items-center gap-2'>
              <img src={assets.quality_icon} alt="7 napos visszaváltás" className="w-6 h-6" />
              <p>7 napos visszaváltás</p>
            </div>
            <div className='flex items-center gap-2'>
              <img src={assets.exchange_icon} alt="Könnyen módosítható termék" className="w-6 h-6" />
              <p>Könnyen módosítható termék</p>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Opciókról bővebben</b>
          <p className='border px-5 py-3 text-sm'>Vélemények (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p className='text-center'>
            <strong>
              Weboldalunk többféle méretkategóriában kínálja virágait, hogy mindenki megtalálja a megfelelő terméket.
            </strong>
          </p>
          <p>
            <strong>1. Cserepes Virágok</strong>
          </p>
          <p>Kicsi (10-20 cm): Ideális kisebb helyekre, például asztalokra vagy ablakpárkányokra.</p>
          <p>Közepes (20-40 cm): Tökéletes ajándéknak vagy irodai környezetbe.</p>
          <p>Nagy (40 cm vagy nagyobb): Nagyobb helyiségekbe, mint nappali, terasz, vagy díszítésre.</p>
          <p><em>Egyéb megrendelés esetén vegye fel velünk a kapcsolatot.</em></p>

          <p>
            <strong>2. Szálas Virágok</strong>
          </p>
          <p>Kicsi (10 szál): Tökéletes kisebb ajándékokhoz vagy személyesebb alkalmakra, mint születésnapok vagy egyéb ünnepségek.</p>
          <p>Közepes (20 szál): Ideális egy szép vázába, vagy nagyobb eseményekre, mint például évfordulók.</p>
          <p>Nagy (30 szál vagy több): Különleges alkalmakra, mint esküvők, jubileumok vagy fontos ünnepek.</p>
          <p><em>Egyéb megrendelés esetén vegye fel a kapcsolatot cégünkkel.</em></p>

          <p>
            <strong>3. Csokor Virágok</strong>
          </p>
          <p>Kicsi (Kézi csokor): Ideális meglepetésként vagy személyes ajándékként.</p>
          <p>Közepes (Klasszikus csokor): Tökéletes romantikus gesztusként vagy baráti ajándékként.</p>
          <p>Nagy (Luxus csokor): Kiemelkedő eseményekre, ünnepekre vagy elegáns ajándékként.</p>
          <p><em>Egyéb megrendelés esetén vegye fel a kapcsolatot cégünkkel.</em></p>
        </div>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  );
};

export default Product;
