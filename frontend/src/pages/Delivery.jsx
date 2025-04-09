import React, { useState } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsLetterBox from '../components/NewsLetterBox';

import RightArrow from '../assets/dropdown_icon.png'; 
const Delivery = () => {
  
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const handleDeliveryClick = (delivery) => {
    setSelectedDelivery(selectedDelivery === delivery ? null : delivery);
  };

  return (
    <div>
      <div className='text-3xl text-center pt-8 border-t'>
        <Title text2={'SZÁLLÍTÁS'} />
      </div>

      <div className='my-10'>
        <div className='flex flex-col justify-center gap-6 text-gray-600'>
          <p className='font-bold text-lg text-center'>
            Webáruházunkban a rendeléseket kizárólag személyesen tudják átvenni az üzletünkben.
            Az alábbiakban részletes információkat talál a személyes átvétel lehetőségéről:
          </p>

          {/* Szállítási módok felsorolása */}
          <div className='space-y-4'>
            {['personal'].map((delivery) => (
              <div
                key={delivery}
                className='bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition-all'
                onClick={() => handleDeliveryClick(delivery)}
              >
                <div className='flex items-center justify-between'>
                  <p className='font-semibold text-gray-700'>
                    {delivery === 'personal' && 'Személyes átvétel az üzletünkben'}
                  </p>
                  <img
                    src={RightArrow}
                    alt="Arrow"
                    className={`transform transition-all ${
                      selectedDelivery === delivery ? 'rotate-90' : ''
                    } w-5 h-5`}
                  />
                </div>

                {/* Szállítási mód részletei */}
                {selectedDelivery === delivery && (
                  <div className='mt-4 text-gray-600'>
                    {delivery === 'personal' && (
                      <>
                        <p><b>Személyes átvétel az üzletünkben:</b></p>
                        <p>Lehetőség van a rendeléseket személyesen átvenni az alábbi időpontokban:</p>
                        <ul className='list-inside list-disc'>
                          <li>Hétfőtől - Péntekig: 09:00 - 17:00</li>
                          <li>Szombaton: 09:00 - 14:00</li>
                          <li>Vasárnap: Zárva</li>
                        </ul>
                        <p>A rendelés elkészülését követően értesítést küldünk, hogy mikor veheted át személyesen.</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='mt-20 mt-28'>
        <NewsLetterBox />
      </div>
    </div>
  );
};

export default Delivery;
