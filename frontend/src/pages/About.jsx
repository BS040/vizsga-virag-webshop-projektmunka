import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
          <Title text2={'RÓLUNK'}/>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos ex debitis quo praesentium eaque quod itaque adipisci, illum rerum officia eos, nemo porro nihil! Maiores dignissimos nihil nulla porro expedita.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam laborum assumenda omnis minus pariatur hic laudantium ipsum, blanditiis facere impedit ipsa deserunt voluptatum, enim ex incidunt consectetur, veritatis minima quisquam.</p>
            <b className='text-gray-800'>Küldetésünk</b>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus quisquam ut ducimus eaque saepe enim aliquam quo quia excepturi fugiat, omnis maiores deleniti dolore, adipisci, itaque iusto tempora vel voluptatem?</p>
          </div>
      </div>
      <div className='text-2xl py-4'>
        <Title text1={'MIÉRT '} text2={'VÁLASSZ MINKET'}/>
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Minőség:</b>
            <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt ipsam molestias a excepturi quis ex quisquam accusamus, totam ad labore voluptate qui explicabo modi perspiciatis, porro magnam. In, corrupti accusamus!</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Egyszerűség:</b>
            <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt ipsam molestias a excepturi quis ex quisquam accusamus, totam ad labore voluptate qui explicabo modi perspiciatis, porro magnam. In, corrupti accusamus!</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Kimagasló ügyfélszolgalat:</b>
            <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt ipsam molestias a excepturi quis ex quisquam accusamus, totam ad labore voluptate qui explicabo modi perspiciatis, porro magnam. In, corrupti accusamus!</p>
          </div>
      </div>
        <NewsLetterBox/>
    </div>
  )
}

export default About
