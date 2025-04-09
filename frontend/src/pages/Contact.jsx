import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const Contact = () => {
  const handleClick = () => {
    // Előre beállított cím, ezt saját elképzelés szerint majd át kéne írni most a Tibi Atya Borkápolnája van benne
    //És nyilván attól függ hogy ki hova szeretne menni vagy hol a bolt és csak a címet kell átírni
    const destination = 'Budapest, Erzsébet krt. 19, 1073';
    
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;

    window.open(googleMapsUrl, '_blank');
  }

  return (
    <div>
      
      <div className='text-center text-2xl pt-10 border-t'>
          <Title text1={'KAPCSOLAT '} text2={'FELVÉTEL'}/>
      </div>
      
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
          <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
          <div className='flex flex-col justify-center items-start gap-6'>
            <p className='font-semibold text-xl text-gray-600'>Üzletünk</p>
            <p className='text-gray-500'>Valami Utca 12 <br /> 1234 Budapest, Pest, Magyarország </p>
            <p className='font-semibold text-xl text-gray-600'>Nyitvatartás</p>
            <p className='text-gray-500 '>Hétfő - Péntek: 09:00 - 17:00 <br />
            Szombat: 09:00 - 14:00 <br /> Vasárnap: Zárva</p>
            <p className='font-semibold text-xl text-gray-600'>Elérhetőségeink</p>
            <p className='text-gray-500 '>Tel: +36 30 123 4567 <br />E-mail: ugyfelszolgalat@virag.com</p>
            <p className='font-semibold text-xl text-gray-600'>Látogass el hozzánk</p>
            <button onClick={handleClick} className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Útvonal</button>
          </div>
      </div>
      <NewsLetterBox/>
    </div>
  )
}

export default Contact
