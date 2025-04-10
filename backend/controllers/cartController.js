import userModel from "../models/userModel.js";

// Termékek hozzáadása a termék kosárba
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;  // 'req.body' kell az adatokat lekérni

    // Felhasználó adatainak lekérése az adatbázisból
    const userData = await userModel.findById(userId);

    // Ha nincs kosár, hozz létre egy üreset
    let cartData = userData.cartData || {};

    // Ha már létezik az itemId, frissítjük a kosarat
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;  // Ha a méret már létezik, növeld a mennyiséget
      } else {
        cartData[itemId][size] = 1;  // Ha a méret nem létezik, hozd létre
      }
    } else {
      cartData[itemId] = {};  // Ha nem létezik az itemId, hozz létre egy újat
      cartData[itemId][size] = 1;
    }

    // A módosított kosár adatokat elmentjük
    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Termék sikeresen hozzáadva" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Kosár frissítése
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData;

    if (!cartData[itemId]) {
      cartData[itemId] = {};  // Ha a termék nincs a kosárban, hozz létre egy objektumot EGY BUG MIATT KERÜLT BELE 
    }

    // Frissítjük a termék mennyiségét a kosárban
    cartData[itemId][size] = quantity;

    // Módosított kosár elmentése
    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Kosár sikeresen frissítve" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Kosár lekérése
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData;

    res.json({ success: true, cartData });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
