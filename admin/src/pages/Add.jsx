import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Csokor");
  const [subCategory, setSubCategory] = useState("Esküvői");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([
    { size: 'Kicsi', price: '', stock: 0 },
    { size: 'Közepes', price: '', stock: 0 },
    { size: 'Nagy', price: '', stock: 0 },
  ]);

  // Képek ellenőrzése hogy mindegyik feltöltve lett-e
  const allImagesUploaded = image1 && image2 && image3 && image4;

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Ha nincs 4 kép feltöltve, nem engedjük a termék hozzáadását
    if (!allImagesUploaded) {
      toast.error("Minden kép feltöltése szükséges a termék hozzáadásához!");
      return;
    }


    try {
      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  // Méret és ár frissítése
  const handleSizeChange = (size, field, value) => {
    if (field === 'price' && (isNaN(value) || value < 0)) {
      return;
    }
    if (field === 'stock' && (isNaN(value) || value < 0)) {
      return;
    }

    setSizes((prevSizes) =>
      prevSizes.map((item) =>
        item.size === size ? { ...item, [field]: value } : item
      )
    )
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>

      {/* Kép feltöltés */}
      <div>
        <p className='mb-2'>Kép feltöltése</p>
        <div className='flex gap-2 '>
          <label htmlFor="image1" className="w-20 h-20 border-2 border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer">
            <img className='cursor-pointer w-full h-full object-cover' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
          <label htmlFor="image2" className="w-20 h-20 border-2 border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer">
            <img className='cursor-pointer w-full h-full object-cover' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>
          <label htmlFor="image3" className="w-20 h-20 border-2 border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer">
            <img className='cursor-pointer w-full h-full object-cover' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>
          <label htmlFor="image4" className="w-20 h-20 border-2 border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer">
            <img className='cursor-pointer w-full h-full object-cover' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>
        </div>
      </div>

      {/* Termék neve */}
      <div className='w-full '>
        <p className='mb-2'>Termék neve</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 rounded-none' type="text" placeholder='Írd ide a termék nevét' required />
      </div>

      {/* Termék leírása */}
      <div className='w-full '>
        <p className='mb-2'>Termék leírás</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2 rounded-none' placeholder='Írd ide a termék leírását' required />
      </div>

      {/* Kategória és típus */}
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8 '>
        <div>
          <p className='mb-2'>Kategória</p>
          <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2 rounded-none'>
            <option value="Csokor">Csokor</option>
            <option value="Szálas">Szálas</option>
            <option value="Cserepes">Cserepes</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Típus</p>
          <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2 rounded-none'>
            <option value="Esküvői">Esküvői</option>
            <option value="Kerti">Kerti</option>
            <option value="Dekoráció">Dekoráció</option>
          </select>
        </div>
      </div>

      {/* Ár/Méret és Készlet */}
      <div className='mb-2'>
        <p className='mb-2'>Ár/Méret</p>
        <div className='flex gap-3'>
          {sizes.map((size) => (
            <div key={size.size} className='flex flex-col'>
              <p>{size.size}</p>
              <input type='number' 
              placeholder={`Ár (${size.size})`} 
              value={size.price} 
              onChange={(e) => handleSizeChange(size.size, 'price', e.target.value)} 
              onKeyDown={(e) => {
                if (
                  ['e', 'E', '+', '-', ',', '.'].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }} className='w-[120px] px-3 py-2 rounded-none' />
            </div>
          ))}
        </div>
      </div>

      <div className='mb-2'>
        <p className='mb-2'>Méret/Készlet</p>
        <div className='flex gap-3'>
          {sizes.map((size) => (
            <div key={size.size} className='flex flex-col'>
              <p>{size.size}</p>
              <input type='number'
                placeholder={`Készlet (${size.size})`}
                value={size.stock}
                onChange={(e) => handleSizeChange(size.size, 'stock', e.target.value)}
                onKeyDown={(e) => {
                  if (
                    ['e', 'E', '+', '-', ',', '.'].includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }} className='w-[120px] px-3 py-2 rounded-none' />
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller */}
      <div className='flex gap-2 mt-2'>
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
        <label className='cursor-pointer' htmlFor="bestseller">Felkapottakhoz adás</label>
      </div>

      {/* Hozzáadás gomb */}
      <button type="submit" className={`w-28 py-3 mt-4 bg-black text-white ${!allImagesUploaded ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!allImagesUploaded}>
        Hozzáadás
      </button>

    </form>
  )
}

export default Add
