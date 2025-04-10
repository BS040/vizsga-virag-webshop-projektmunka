import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Termék hozzáadása
const addProduct = async (req, res) => {
    try {
        const { name, description, category, subCategory, sizes, bestseller } = req.body;

        // Képek kezelése
        const image1 = req.files?.image1 && req.files.image1[0];
        const image2 = req.files?.image2 && req.files.image2[0];
        const image3 = req.files?.image3 && req.files.image3[0];
        const image4 = req.files?.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter(item => item !== undefined);

        // Képek feltöltése a Cloudinary-ba
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url;
            })
        );

        // Termék adatainak összegyűjtése
        const productData = {
            name,
            description,
            category,
            subCategory,
            bestSeller: (bestseller === 'true') ? true : false, // Ha nincs bestSeller, alapértelmezetten false
            sizes: JSON.parse(sizes).map(size => ({
                ...size,
                stock: size.stock || 0 // Készlet hozzáadása, ha nem adták meg, akkor 0
            })),
            image: imagesUrl,
            date: Date.now(),
        };

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Termék hozzáadva" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Termékek kilistázása
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Termékek törlése
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Termék eltávolítva" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Egyetlen termék lekérése
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Termék nem található' });
        }

        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Termék frissítése
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, category, subCategory, sizes, bestseller } = req.body;

        // Termék keresése az ID alapján
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Termék nem található' });
        }

        // Kezdő lista a meglévő képekkel
        let imageUrls = [...product.image];

        // Meglévő képek (ha nem lettek frissítve, akkor ezek maradnak)
        const existingImage1 = req.body.existingImage1;
        const existingImage2 = req.body.existingImage2;
        const existingImage3 = req.body.existingImage3;
        const existingImage4 = req.body.existingImage4;

        if (existingImage1) imageUrls[0] = existingImage1;
        if (existingImage2) imageUrls[1] = existingImage2;
        if (existingImage3) imageUrls[2] = existingImage3;
        if (existingImage4) imageUrls[3] = existingImage4;

        // Új képek feltöltése, ha vannak
        const imageFiles = [req.files?.image1, req.files?.image2, req.files?.image3, req.files?.image4];

        for (let i = 0; i < imageFiles.length; i++) {
            if (imageFiles[i]) {
                const result = await cloudinary.uploader.upload(imageFiles[i][0].path, { resource_type: "image" });
                imageUrls[i] = result.secure_url; 
            }
        }

        // Termék adatainak frissítése
        product.name = name || product.name;
        product.description = description || product.description;
        product.category = category || product.category;
        product.subCategory = subCategory || product.subCategory;
        product.sizes = sizes ? JSON.parse(sizes).map(size => ({
            ...size,
            stock: size.stock || 0 // Készlet hozzáadása, ha nincs, akkor alapértelmezett 0
        })) : product.sizes;

        // Bestseller frissítése
        if (bestseller !== undefined) {
            product.bestSeller = (bestseller === 'true');
        }

        // Frissített képek mentése
        product.image = imageUrls;

        await product.save();

        res.json({ success: true, message: "Termék sikeresen frissítve", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { listProducts, addProduct, removeProduct, singleProduct, updateProduct };
