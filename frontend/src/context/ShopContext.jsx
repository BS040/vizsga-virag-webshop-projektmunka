
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

// Backend URL beállítása
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "HUF";
  const symbol = "Ft";
  const delivery_fee = 0;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  // Kosár adatainak beolvasása localStorage-ból
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart)); // Kosár adatok betöltése
    }
  }, []);

  //Kosár kiürítése a rendelés után 
  const clearCart = () => {
    console.log('Törlöm a kosarat...');
    localStorage.removeItem('cartItems'); 
    setCartItems({}); 
    console.log('Kosár törölve.');
  };
  
  

 // Kosárhoz adás
const addToCart = async (itemId, size, quantity) => {
  if (!size || quantity <= 0) {
    toast.error("Válassz egy érvényes opciót és mennyiséget!");
    return;
  }

  let cartData = structuredClone(cartItems);
  const product = products.find(product => product._id === itemId);
  const selectedSize = product.sizes.find(item => item.size === size);

  // Ha a kosárban már van-e a termékből, akkor nem haladhatja meg a készletet
  const currentQuantityInCart = cartData[itemId] ? cartData[itemId][size] || 0 : 0;
  const newQuantity = currentQuantityInCart + quantity;

  if (newQuantity > selectedSize.stock) {
    toast.error("Nincs ennyi készleten!");
    return;
  }

  // Ha nincs még az item, akkor létrehozzuk
  if (!cartData[itemId]) {
    cartData[itemId] = {};
  }

  // Frissítjük a kosárban lévő mennyiséget
  cartData[itemId][size] = newQuantity;

  setCartItems(cartData);
  toast.success("Termék sikeresen hozzáadva");

  // Kosár adatainak tárolása localStorage-ban
  localStorage.setItem('cartItems', JSON.stringify(cartData));

  if (token) {
    try {
      
      const response = await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, size, quantity },
        { headers: { token } }
      );

      if (response.data.success) {
        // Kosár frissítés sikeres
      } else {
        toast.error("Hiba történt a kosár frissítésekor.");
      }
    } catch (error) {
      console.error("Hiba történt a kosár frissítésekor:", error);
      toast.error("Nem sikerült frissíteni a kosarat. Ellenőrizd a backend kiszolgálót.");
    }
  }
};



  // Kosárban lévő termékek összesítése
  const getCartCount = () => {
    return Object.values(cartItems).reduce(
      (acc, sizes) => acc + Object.values(sizes).reduce((sum, qty) => sum + qty, 0),
      0
    );
  };

  // Kosár mennyiség frissítése
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId] && cartData[itemId][size] !== undefined) {
      cartData[itemId][size] = quantity;
      setCartItems(cartData);

      // Kosár adatainak tárolása localStorage-ban
      localStorage.setItem('cartItems', JSON.stringify(cartData));

      if (token) {
        try {
          const response = await axios.post(
            `${backendUrl}/api/cart/update`,
            { itemId, size, quantity },
            { headers: { token } }
          );

          if (response.data.success) {
            // toast.success("Kosár mennyisége frissítve az adatbázisban is");
          } else {
            toast.error("Hiba történt a kosár mennyiségének frissítésekor.");
          }
        } catch (error) {
          console.error("Hiba történt a kosár mennyiségének frissítésekor:", error);
          toast.error("Nem sikerült frissíteni a kosarat. Ellenőrizd a backend kiszolgálót.");
        }
      }
    }
  };

  
// Kosár teljes árának számítása
const getCartAmount = () => {
  return Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
    let item = products.find((product) => product._id === itemId);
    if (!item) return total;

    // Az kiválasztott méretekhez az árát hozzáadjuk
    Object.entries(sizes).forEach(([size, quantity]) => {
      const sizeData = item.sizes.find(s => s.size === size);
      if (sizeData) {
        total += sizeData.price * quantity; // Mérethez tartozó ár szorzása a mennyiséggel
      }
    });

    return total;
  }, 0);
};


  // Termékek lekérése a backendről
  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        const updatedProducts = response.data.products.map((product) => {
          const smallSize = product.sizes.find((size) => size.size === "Kicsi");
          return {
            ...product,
            price: smallSize ? smallSize.price : 0,
          };
        });
        setProducts(updatedProducts);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Hiba a termékek lekérésekor:", error);
      toast.error("Nem sikerült betölteni a termékeket! Ellenőrizd a backend kiszolgálót.");
    }
  };

  // Adatok betöltése induláskor
  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  // Token eltávolítása és kijelentkezés kezelése
const logout = () => {
  setToken(''); // Token törlése az állapotból
  setCartItems({}); // Kosár törlése az állapotból
  localStorage.removeItem('token'); // Token eltávolítása a localStorage-ból
  localStorage.removeItem('cartItems'); // Kosár eltávolítása a localStorage-ból
  navigate('/login'); // Navigálás a bejelentkezési oldalra
};


  // Kontextus értékek
  const value = {
    products,
    currency,
    symbol,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    setToken,
    token,
    backendUrl, // A backendUrl ShopContextben
    logout, // A logout funkció hozzáadása
    clearCart,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export { ShopContext, ShopContextProvider };
export default ShopContextProvider;
