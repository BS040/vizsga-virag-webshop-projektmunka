import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';   
import { listProducts } from './controllers/productController.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import { getUserDetails } from './controllers/userController.js';

//App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB()
connectCloudinary()

//middlewarek
app.use(express.json());
app.use(cors())

//api végpontok
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)


app.get('/',(req,res)=>{
    res.send("AZ API MUKODIK")
})

app.get('/api/product/list', listProducts);
app.post('/api/user/details', getUserDetails);

app.listen(port, ()=> console.log('Server elindult a PORT : '+ port))