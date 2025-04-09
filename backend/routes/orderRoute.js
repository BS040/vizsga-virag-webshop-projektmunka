import express from 'express';
import {placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe, updatePaymentStatus} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';


const orderRouter = express.Router()

// Admin Funkciók 
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)


//Fizetési funkciók
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser, placeOrderStripe)
// orderRouter.post('/paypal',authUser,placeOrderPaypal)

//Felhasználó lehetőségei
orderRouter.post('/userorders',authUser,userOrders)

//Fizetési authentikáció
orderRouter.post('/verifyStripe', authUser, verifyStripe)

// Új végpont a fizetési állapot frissítésére
orderRouter.post('/payment-status', authUser, updatePaymentStatus);


export default orderRouter