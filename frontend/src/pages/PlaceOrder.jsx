import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CartTotal from '../components/CartTotal';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';



const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    fullName: '',
    country: '',
    state: '',
    street: '',
    city: '',
    zipcode: '',
    phone: '',
    email: '',
    company: ''
  });

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [states, setStates] = useState([]);
  const [phonePlaceholder, setPhonePlaceholder] = useState('+36'); // Alap placeholder

  const countryCallingCodes = {
    Hungary: '+36',
    Serbia: '+381',
    Germany: '+49',
    Austria: '+43',
    Slovenia: '+386',
    Slovakia: '+421',
    Romania: '+40',
  };

  const countryCallingCodes2 = {
    Hungary: 'Pl. +36 70 123 4567',
    Serbia: 'Npr. +381 63 123 456',
    Germany: 'Z.B. +49 170 1234567',
    Austria: 'Z.B. +43 664 123 4567',
    Slovenia: 'Npr. +386 40 123 456',
    Slovakia: 'Napr. +421 902 123 456',
    Romania: 'Ex. +40 721 123 456',
  };



  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setStates(regions[country] || []);  // A kiválasztott ország alapján frissítjük a megyéket
    setFormData((data) => ({ ...data, country }));
    setPhonePlaceholder(countryCallingCodes2[country] || '+36');
  };

  const regions = {
    Hungary: [
      "Budapest", "Baranya", "Bács-Kiskun", "Békés", "Borsod-Abaúj-Zemplén", "Csongrád", "Fejér", "Győr-Moson-Sopron", "Hajdú-Bihar", "Heves", "Jász-Nagykun-Szolnok", "Komárom-Esztergom", "Nógrád", "Pest", "Somogy", "Szabolcs-Szatmár-Bereg", "Tolna", "Vas", "Veszprém", "Zala"
    ],
    Serbia: [
      "Belgrade", "Vojvodina", "Central Serbia", "Šumadija", "Southern and Eastern Serbia"
    ],
    Germany: [
      "Bavaria", "Berlin", "Hesse", "North Rhine-Westphalia", "Saxony", "Hamburg"
    ],
    Austria: [
      "Vienna", "Lower Austria", "Upper Austria", "Styria", "Tyrol", "Carinthia", "Salzburg", "Burgenland", "Vorarlberg"
    ],
    Slovenia: [
      "Pomurska", "Podravska", "Osrednjeslovenska", "Jugovzhodna Slovenija", "Osrednja Slovenija", "Pomurska", "Koroška", "Jugovzhodna Slovenija"
    ],
    Slovakia: [
      "Bratislava", "Trnava", "Nitra", "Trenčín", "Žilina", "Prešov", "Košice"
    ],
    Romania: [
      "București", "Ilfov", "Cluj", "Timiș", "Iași", "Constanța", "Suceava", "Brașov", "Dolj", "Galați", "Vaslui", "Prahova"
    ]
  };


  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData(data => ({ ...data, [name]: value }));

    if (name === "country") {
      // Beállítjuk a számot a kiválasztott ország alapján
      setSelectedCountry(value);
      setStates(regions[value] || []);  // Megyék frissítése a választott ország alapján
      setFormData(data => ({
        ...data,
        state: '', // Állapot törlése, ha országot váltanak
        phone: countryCallingCodes[value] || '', // Telefonszám törlése is, hogy az új placeholder látszódjon
      }));
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      let orderItems = []
      let totalAmount = 0  // Az összesített kosárérték (termékek + szállítási díj)

      // Kosár ellenőrzése és helyes árazás
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));

            // Az itemInfo létezik ??
            if (itemInfo) {
              // Ha az itemInfo létezik, akkor a megfelelő méret kell
              const selectedSize = itemInfo.sizes.find(size => size.size === item);

              if (selectedSize) {
                // Ha megvan a megfelelő méretet, ár hozzárendelés
                itemInfo.size = item;
                itemInfo.quantity = cartItems[items][item];
                itemInfo.price = selectedSize.price; // Ez az ár a kiválasztott mérethez

                orderItems.push(itemInfo);
                totalAmount += itemInfo.price * itemInfo.quantity;
              } else {
                console.error(`Méret nem található: ${item} a termékhez: ${itemInfo.name}`);
              }
            }
          }
        }
      }


      // Ha üres a kosár, nem lehet rendelést leadni
      if (orderItems.length === 0) {
        toast.error("A kosár üres!");
        return;
      }

      // Helyes összeg lett kiszámítva ??
      console.log("Rendelési tételek:", orderItems);
      console.log("Kiszámolt teljes összeg:", totalAmount);

      // A végső rendelési adat
      let orderData = {
        address: formData,
        items: orderItems,
        amount: totalAmount + delivery_fee  // Végső összeg (termékek + szállítás)
      }

      // Fizetési módok kezelése
      switch (method) {
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
          if (response.data.success) {
            setCartItems({})
            navigate('/orders')
          } else {
            toast.error(response.data.message)
          }
          break;

        case 'stripe':
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } })
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data
            window.location.replace(session_url)
          } else {
            toast.error(responseStripe.data.message)
          }
          break;

        default:
          break;
      }

    } catch (error) {
      // Hibakezelés
      if (error.response && error.response.status === 400) {
        toast.error("Hiba történt a rendelés leadása közben.");
      } else {
        toast.error("Hiba történt! Kérjük, próbáld újra később.");
      }
      console.error(error);
    }
  }



  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      const decoded = JSON.parse(atob(token.split('.')[1])); 
      const userId = decoded.id;

      const fetchUserEmail = async () => {
        try {
          const res = await axios.post(backendUrl + '/api/user/details', { userId }, { headers: { token } });
          if (res.data.success) {
            setFormData((prev) => ({ ...prev, email: res.data.user.email }));
          }
        } catch (error) {
          console.error("Nem sikerült lekérni a felhasználói emailt:", error);
        }
      };

      fetchUserEmail();

      const fetchUserName = async () => {
        try {
          const res = await axios.post(backendUrl + '/api/user/details', { userId }, { headers: { token } });
          if (res.data.success) {
            setFormData((prev) => ({ ...prev, fullName: res.data.user.name }));
          }
        } catch (error) {
          console.error("Nem sikerült lekérni a felhasználó nevét:", error);
        }
      };

      fetchUserName();
    }
  }, [token, navigate]);




  // Ellenőrizze, hogy van-e token a localStorage-ban, ha nincs, irányítja a felhasználót a bejelentkezés oldalra
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     navigate('/login'); // Ha nincs token, irányítsd a felhasználót a bejelentkezési oldalra
  //   }
  // }, [navigate]);

  // // Form állapot frissítése
  // const handleChange = (e) => {
  //   const { id, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [id]: value
  //   });
  // };

  // // Ellenőrzés, hogy minden kötelező mező ki van-e töltve
  const isFormValid = () => {
    const { fullName, country, state, street, city, zipcode, phone, email } = formData;
    return fullName && country && state && street && city && zipcode && phone && email;
  };

  // // Űrlap elküldése
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!isFormValid()) {
  //     alert('Kérjük, töltsön ki minden kötelező mezőt!');
  //   } else {
  //     // A rendelés leadása (pl. API hívás)
  //     navigate('/orders');
  //   }
  // };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-'>
      {/* ------------ Bal Oldal ------------ */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'RENDELÉSI '} text2={'ADATOK'} />
        </div>

        
        {/* Teljes név */}
        <div className='w-full'>
          <label htmlFor="fullName" className='block text-sm mb-1'>Teljes név *</label>
          <input name="fullName" className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text"
            value={formData.fullName} onChange={onChangeHandler} required
            readOnly />
        </div>


        {/* Cég */}
        <div className='w-full'>
          <label htmlFor="company" className='block text-sm mb-1'>Cégnév (Opcionális)</label>
          <input name="company" className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text"
            value={formData.company} onChange={onChangeHandler}
            onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-z0-9./záéíóúőüöűŰÁÉÍÓÚŐÜÖ -]/g, '')} />
        </div>

        {/* Ország */}
        <div className='w-full'>
          <label htmlFor="country" className='block text-sm mb-1'>Ország *</label>
          <select name="country" className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            value={formData.country} onChange={onChangeHandler} required>
            <option value="">Választás ...</option>
            <option value="Hungary">Magyarország</option>
            <option value="Serbia">Szerbia</option>
            <option value="Germany">Németország</option>
            <option value="Austria">Ausztria</option>
            <option value="Slovenia">Szlovénia</option>
            <option value="Slovakia">Szlovákia</option>
            <option value="Romania">Románia</option>
            {/* A többi ország */}
          </select>
        </div>

        {/* Utca, házszám és megye */}
        <div className='flex gap-2'>
          <div className='w-full'>
            <label htmlFor="state" className='block text-sm mb-1'>Megye *</label>
            <select name="state" className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
              value={formData.state} onChange={onChangeHandler} required>
              <option value="">Választás ...</option>
              {states.map((state, index) => (
                <option key={index} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div className='w-full'>
            <label htmlFor="street" className='block text-sm mb-1'>Utca, házszám *</label>
            <input name="street" className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text"
              value={formData.street} onChange={onChangeHandler} required
              onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-z0-9./záéíóúőüöűŰÁÉÍÓÚŐÜÖ ]/g, '')} />
          </div>
        </div>

        {/* Város és irányítószám */}
        <div className='flex gap-3'>
          <div className='w-full'>
            <label htmlFor="city" className='block text-sm mb-1'>Város *</label>
            <input name="city" className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text"
              value={formData.city} onChange={onChangeHandler} required
              onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-záéíóúőüöűŰÁÉÍÓÚŐÜÖ ]/g, '')} />
          </div>
          <div className='w-full'>
            <label htmlFor="zipcode" className='block text-sm mb-1'>Irányítószám *</label>
            <input name="zipcode" className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
              type="number" value={formData.zipcode} onChange={onChangeHandler} min="0" required
              onInput={(e) => e.target.value = e.target.value.replace(/[^0-9 ]/g, '')} />
          </div>
        </div>

        {/* Telefonszám */}
        <div className='w-full'>
          <label htmlFor="phone" className='block text-sm mb-1'>Telefonszám *</label>
          <input name="phone" className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder={selectedCountry ? countryCallingCodes2[selectedCountry] : ''} type="text"
            value={formData.phone} onChange={onChangeHandler} required
            onInput={(e) => e.target.value = e.target.value.replace(/[^0-9+]/g, '')} />
          {/* 
            EZ AZÉRT LEHET JÓ HOGY HA MEGAKARJUK AKADÁLYOZNI HOGY A FELHASZNÁLÓ KITUDJA TÖRÖLNI A HIVÓ AZONOSíTÓT
            onInput={(e) => {
              if (!e.target.value.startsWith(countryCallingCodes[selectedCountry])) {
                e.target.value = countryCallingCodes[selectedCountry] + e.target.value.replace(countryCallingCodes[selectedCountry], ''); // Csak a telefonszám többi részét engedjük módosítani
              }
              setFormData(data => ({ ...data, phone: e.target.value }));
            }} /> */}
        </div>

        {/* Email */}
        <div className='w-full'>
          <label htmlFor="email" className='block text-sm mb-1'>E-mail cím *</label>
          <input
            name="email"
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full bg-gray-100 cursor-not-allowed'
            type="email"
            value={formData.email}
            readOnly
          />
        </div>
      </div>

      {/* ----------- Jobb oldal ----------- */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'FIZETÉSI '} text2={'LEHETŐSÉGEK'} />

          <div className='flex gap-3 flex-col lg:flex-row'>
            {/* Az utánvételes és kártyártás fizetés */}
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>UTÁNVÉTEL</p>
            </div>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>BANKÁRTYÁS FIZETÉS</p>
            </div>
          </div>

          <div className="mt-6 p-4 border bg-gray-100 h-[250px] w-full sm:w-[420px] overflow-y-auto">
            <h4 className="font-semibold text-lg">Üzlet Nyitvatartás:</h4>
            <p className="text-sm text-gray-600">Hétfő-Péntek: 09:00 - 17:00</p>
            <p className="text-sm text-gray-600">Szombat: 09:00 - 14:00</p>
            <p className="text-sm text-gray-600">Vasárnap: Zárva</p>
            <h4 className="font-semibold text-lg mt-4">Cím:</h4>
            <p className="text-sm text-gray-600">1234 Budapest, Fő utca 56.</p>
            <h4 className="font-semibold text-lg mt-4">Bankártyás fizetés esetén:</h4>
            <p className="text-sm text-gray-600">
              Amennyiben teljesül a tranzakció és a vásárlás sikeres, és erről visszaigazoló
              emailt küldünk, és a termék átvehető állapotba kerül, abban az esetben
              nyitvatartási időtől függetlenül átvehető, amit előre telefonon vagy e-mailben
              tudnak velünk egyeztetni.
            </p>

            {/* Telefonszám */}
            <h4 className="font-semibold text-lg mt-4">Telefonszám:</h4>
            <p className="text-sm text-gray-600">
              <a href="tel:+367012345678" className="text-gray-600 hover:underline">
                +36 70 123 45 67
              </a>
            </p>

            {/* E-mail cím */}
            <h4 className="font-semibold text-lg mt-4">E-mail:</h4>
            <p className="text-sm text-gray-600">
              <a href="mailto:valami@virag.hu" className="text-gray-600 hover:underline">
                valami@virag.hu
              </a>
            </p>
          </div>



          <div className='w-full text-end mt-8 '>
            <button type='submit'
              className={`bg-black text-white px-16 py-3 text-sm ${isFormValid() ? '' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!isFormValid()}
            >
              RENDELÉS
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
