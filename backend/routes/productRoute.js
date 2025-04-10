import express from 'express';
import { addProduct, listProducts, removeProduct, singleProduct, updateProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';  // Ha fájlokat küldesz, az upload middleware szükséges
import adminAuth from '../middleware/adminAuth.js';  // Admin jogosultságok

const productRoute = express.Router();

productRoute.post('/add', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), addProduct);
productRoute.post('/remove', adminAuth, removeProduct);
productRoute.get('/list', listProducts);  
productRoute.get('/single/:productId', singleProduct);  
productRoute.put('/update', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), (req, res, next) => {
    console.log('Update request received:', req.body);  
    next();
}, updateProduct);

export default productRoute;
