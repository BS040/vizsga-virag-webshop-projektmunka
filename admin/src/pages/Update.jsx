import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { backendUrl } from '../App';
import uploadPlaceholder from "../assets/upload_area.png";

const Update = ({ token }) => {
    const [product, setProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Szálas',
        subCategory: 'Dekoráció',
        sizes: {
            smallPrice: '',
            mediumPrice: '',
            largePrice: '',
            smallStock: 0,
            mediumStock: 0,
            largeStock: 0,
        },
        bestseller: false,
        images: [], // Az összes kép
    });

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/product/single/${id}`, {
                    headers: { token },
                });

                if (response.data.success) {
                    const product = response.data.product;
                    setProduct(product);
                    setFormData({
                        name: product.name || '',
                        description: product.description || '',
                        category: product.category || 'Szálas',
                        subCategory: product.subCategory || 'Dekoráció',
                        sizes: {
                            smallPrice: product.sizes?.find(size => size.size === "Kicsi")?.price || '',
                            mediumPrice: product.sizes?.find(size => size.size === "Közepes")?.price || '',
                            largePrice: product.sizes?.find(size => size.size === "Nagy")?.price || '',
                            smallStock: product.sizes?.find(size => size.size === "Kicsi")?.stock || 0,
                            mediumStock: product.sizes?.find(size => size.size === "Közepes")?.stock || 0,
                            largeStock: product.sizes?.find(size => size.size === "Nagy")?.stock || 0,
                        },
                        bestseller: product.bestSeller ?? false,
                        images: product.image || [], // Az összes kép
                    });
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchProduct();
    }, [id, token]);

    
    const handleImageChange = (e, index) => {
        if (e.target.files.length > 0) {
            const newImagesArray = [...formData.images];

            // Cseréljük le az képet az újra
            newImagesArray[index] = e.target.files[0];

            // Pontosan 4 kép legyen
            while (newImagesArray.length < 4) {
                newImagesArray.push(null); 
            }

            setFormData({ ...formData, images: newImagesArray });
        }
    };

    // Termék frissítés
    const handleUpdate = async (e) => {
        e.preventDefault();

        const updatedFormData = new FormData();
        updatedFormData.append('id', id);
        updatedFormData.append('name', formData.name);
        updatedFormData.append('description', formData.description);
        updatedFormData.append('category', formData.category);
        updatedFormData.append('subCategory', formData.subCategory);
        updatedFormData.append('bestSeller', formData.bestSeller ? 'true' : 'false');

        const updatedSizes = [
            { size: 'Kicsi', price: formData.sizes.smallPrice, stock: formData.sizes.smallStock },
            { size: 'Közepes', price: formData.sizes.mediumPrice, stock: formData.sizes.mediumStock },
            { size: 'Nagy', price: formData.sizes.largePrice, stock: formData.sizes.largeStock },
        ];
        updatedFormData.append('sizes', JSON.stringify(updatedSizes));

        // Képek hozzáadása: új képek és meglévő képek
        formData.images.forEach((img, index) => {
            if (img instanceof File) {
                updatedFormData.append(`image${index + 1}`, img); // Új kép
            } else if (img) {
                updatedFormData.append(`existingImage${index + 1}`, img); // Meglévő kép URL
            }
        });

        try {
            const response = await axios.put(`${backendUrl}/api/product/update`, updatedFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    token,
                },
            });

            if (response.data.success) {
                navigate('/list');
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!product) {
        return <p>Betöltés...</p>;
    }

    // Fix 4 képes feltöltési mezők létrehozása
    const uploadImagePlaceholders = 4; // Fix 4 hely
    const uploadAreaImage = '/assets/upload_area.png'; // Feltöltési terület képe

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-6">Termék frissítése</h2>
            <form onSubmit={handleUpdate} className="space-y-4">

                <div className="flex flex-col gap-2">
                    <label className="font-medium">Termék neve</label>
                    <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="px-4 py-2 border border-gray-300"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-medium">Leírás</label>
                    <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="px-4 py-2 border border-gray-300"
                    />
                </div>

                {/* Kategória legördülő */}
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1">
                        <label className="font-medium">Kategória</label>
                        <select
                            value={formData.category || 'Szálas'}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300"
                        >
                            <option value="Szálas">Szálas</option>
                            <option value="Csokor">Csokor</option>
                            <option value="Cserepes">Cserepes</option>
                        </select>
                    </div>

                    {/* Típus legördülő */}
                    <div className="flex-1">
                        <label className="font-medium">Típus</label>
                        <select
                            value={formData.subCategory || 'Dekoráció'}
                            onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300"
                        >
                            <option value="Dekoráció">Dekoráció</option>
                            <option value="Kerti">Kerti</option>
                            <option value="Esküvői">Esküvői</option>
                        </select>
                    </div>
                </div>

                {/* Méret és ár + készlet mezők */}
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1">
                        <label className="font-medium">Ár/Kicsi</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.sizes?.smallPrice || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                sizes: { ...formData.sizes, smallPrice: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300"
                        />
                        <label className="font-medium">Készlet/Kicsi</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.sizes?.smallStock || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                sizes: { ...formData.sizes, smallStock: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="font-medium">Ár/Közepes</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.sizes?.mediumPrice || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                sizes: { ...formData.sizes, mediumPrice: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300"
                        />
                        <label className="font-medium">Készlet/Közepes</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.sizes?.mediumStock || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                sizes: { ...formData.sizes, mediumStock: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="font-medium">Ár/Nagy</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.sizes?.largePrice || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                sizes: { ...formData.sizes, largePrice: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300"
                        />
                        <label className="font-medium">Készlet/Nagy</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.sizes?.largeStock || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                sizes: { ...formData.sizes, largeStock: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300"
                        />
                    </div>
                </div>

                {/* Kép feltöltés, fix 4 mező */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {[...Array(uploadImagePlaceholders)].map((_, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                            <label className="font-medium">{`Kép ${index + 1}`}</label>

                            <img
                                src={
                                    formData.images[index] instanceof File
                                        ? URL.createObjectURL(formData.images[index])
                                        : formData.images[index] || uploadPlaceholder // Alapértelmezett kép
                                }
                                alt={`Kép ${index + 1}`}
                                className="w-32 h-32 object-cover border"
                            />

                            {/* Kép módosítása */}
                            <input
                                id={`file-input-${index}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, index)}
                                className="hidden"
                            />
                            <label
                                htmlFor={`file-input-${index}`}
                                className="flex items-center justify-center w-full h-10 bg-black text-white cursor-pointer hover:bg-gray-800 transition duration-300 px-4"
                            >
                                Kép választása
                            </label>
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    className={`w-full py-3 mt-4 transition duration-300
        ${formData.images.length < 4 ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
                    disabled={formData.images.length < 4}
                >
                    Frissítés
                </button>

            </form>
        </div>
    );
};

export default Update;
