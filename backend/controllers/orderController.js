import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js"
import Stripe from "stripe"
import nodemailer from 'nodemailer'

const currency = 'huf'
const shipping = 0

//Útvonalak
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


const sendEmail = async (orderDetails, status) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let subject, text;

    // Az e-mail tartalma státusz alapján változik
    if (status === "Átvehető") {
        subject = 'A rendelése átvehető!';
        text = `
Kedves ${orderDetails.userName},

Örömmel értesítjük, hogy rendelése készen áll az átvételre. Az alábbiakban találhatók a rendelés részletei:

Termékek:
${orderDetails.items.map(item => `${item.name} x ${item.quantity}`).join(', ')}

Rendelés összege: ${orderDetails.amount} Ft

Teljes név: ${orderDetails.address.fullName}
Rendelési cím: ${orderDetails.address.street}, ${orderDetails.address.city}, ${orderDetails.address.state}, ${orderDetails.address.zipcode}
Ország: ${orderDetails.address.country}
Telefonszám: ${orderDetails.address.phone}

!!FONTOS!!
Rendelését három napon belül veheti át. Amennyiben ez nem történik meg, előreutalás esetén nem utaljuk vissza a rendelés összegét, viszont amennyiben személyesen átvételre került volna sor
(és ez végül nem teljesült), az oldalról letiltásra kerül, és többé nem rendelhet az oldalról.
Amennyiben ezek után újra akarja oldalni fiókját írjon e-mailt az adminisztrátornak az ugyfelszolgalat@virag.com címre.

Megértését és vásárlását köszönjük!

Üdvözlettel,
A Virágwebshop csapata
        `;
    } else if (status === "Teljesített") {
        subject = 'A rendelése teljesítve lett!';
        text = `
Kedves ${orderDetails.userName},

Örömmel értesítjük, hogy rendelése sikeresen teljesítve lett. Az alábbiakban találhatók a rendelés részletei:

Termékek:
${orderDetails.items.map(item => `${item.name} x ${item.quantity}`).join(', ')}

Rendelés összege: ${orderDetails.amount} Ft

Teljes név: ${orderDetails.address.fullName}
Rendelési cím: ${orderDetails.address.street}, ${orderDetails.address.city}, ${orderDetails.address.state}, ${orderDetails.address.zipcode}
Ország: ${orderDetails.address.country}
Telefonszám: ${orderDetails.address.phone}

Köszönjük, hogy nálunk vásárolt!

Üdvözlettel,
A Virágwebshop csapata
        `;
    } else if (status === "Nem teljesített") {
        subject = 'A rendelése lejárt!';
        text = `
Kedves ${orderDetails.userName},

Sajnálattal értesítjük, hogy rendelése lejárt. Az alábbiakban találhatók a rendelés részletei:

Termékek:
${orderDetails.items.map(item => `${item.name} x ${item.quantity}`).join(', ')}

Rendelés összege: ${orderDetails.amount} Ft

Teljes név: ${orderDetails.address.fullName}
Rendelési cím: ${orderDetails.address.street}, ${orderDetails.address.city}, ${orderDetails.address.state}, ${orderDetails.address.zipcode}
Ország: ${orderDetails.address.country}
Telefonszám: ${orderDetails.address.phone}

Mivel három napon belül nem tudta a rendelését átvenni ezért már nem érhető el, és az oldalról már vagy hamarosan letiltasra kerül. 
Amennyiben ezek után újra akarja oldalni fiókját írjon e-mailt az adminisztrátornak az ugyfelszolgalat@virag.com címre.

Üdvözlettel,
A Virágwebshop csapata
        `;
    } else {
        // Alapértelmezett visszaigazoló e-mail
        subject = 'Rendelés visszaigazolás';
        text = `
Kedves ${orderDetails.userName},

A rendelését sikeresen megkaptuk. Az alábbiakban találhatóak a rendelés részletei:

Termékek:
${orderDetails.items.map(item => `${item.name} x ${item.quantity}`).join(', ')}

Rendelés összege: ${orderDetails.amount} Ft

Teljes név: ${orderDetails.address.fullName}
Rendelési cím: ${orderDetails.address.street}, ${orderDetails.address.city}, ${orderDetails.address.state}, ${orderDetails.address.zipcode}
Ország: ${orderDetails.address.country}
Telefonszám: ${orderDetails.address.phone}

Köszönjük, hogy nálunk vásárolt!

Üdvözlettel,
A Virágwebhop csapata
        `;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: orderDetails.userEmail,
        subject: subject,
        text: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};



// Rendelés utávételes módja

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        // Ellenőrzi a készletet és frissíti
        for (let item of items) {
            const product = await productModel.findById(item._id);
            if (!product) {
                return res.status(404).json({ success: false, message: "A termék nem található." });
            }

            // Megkeresi a megfelelő méretet
            const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
            if (sizeIndex === -1) {
                return res.status(400).json({ success: false, message: "Nem megfelelő méret." });
            }

            // Ellenőrizi a készletet
            if (product.sizes[sizeIndex].stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Nincs elég készleten: ${product.name} (${item.size})` });
            }

            // Csökkenti a készletet
            product.sizes[sizeIndex].stock -= item.quantity;
            await product.save();
        }

        // Új rendelés létrehozása
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Utánvétel",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        const user = await userModel.findById(userId);
        const orderDetails = {
            userEmail: user.email,
            userName: user.name,
            orderId: newOrder._id,
            items: items,
            amount: amount,
            address: address,
        };
        await sendEmail(orderDetails);

        res.json({ success: true, message: "A rendelés sikeresen leadva" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// Rendelés stripe módja
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        // Ellenőrzi a készletet és frissítjük
        for (let item of items) {
            const product = await productModel.findById(item._id);
            if (!product) {
                return res.status(404).json({ success: false, message: "A termék nem található." });
            }

            const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
            if (sizeIndex === -1) {
                return res.status(400).json({ success: false, message: "Nem megfelelő méret." });
            }

            if (product.sizes[sizeIndex].stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Nincs elég készleten: ${product.name} (${item.size})` });
            }

            product.sizes[sizeIndex].stock -= item.quantity;
            await product.save();
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Bankkártya",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Szállítás'
                },
                unit_amount: shipping * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}


//Stripe verifikáció
const verifyStripe = async (req, res) => {

    const { orderId, success, userId } = req.body

    try {
        const order = await orderModel.findById(orderId);
        const user = await userModel.findById(userId);

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true })
            await userModel.findByIdAndUpdate(userId, { cartData: {} })

            const orderDetails = {
                userEmail: user.email,
                userName: user.name,
                orderId: order._id,
                items: order.items,
                amount: order.amount,
                address: order.address,
            };
            await sendEmail(orderDetails);

            res.json({ success: true })
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

// Rendelés paypal módja
// const placeOrderPaypal = async (req,res) => {

// }

// Az összes rendelés az admin felületen
const allOrders = async (req, res) => {
    try {

        const orders = await orderModel.find({})
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error)
        res.json({ success: false, messages: error.message })
    }
}

// A felhasználó rendelései 
const userOrders = async (req, res) => {
    try {

        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error)
        res.json({ success: false, messages: error.message })
    }
}

//Rendelési státusz frissitése
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        // Rendelés keresése
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Rendelés nem található" });
        }

        // A státusz frissítése
        order.status = status;

        // Ha a státusz "Átvehető", akkor küld e-mailt a felhasználónak
        if (status === "Átvehető") {
            const user = await userModel.findById(order.userId);
            const orderDetails = {
                userEmail: user.email,
                userName: user.name,
                orderId: order._id,
                items: order.items,
                amount: order.amount,
                address: order.address,
            };
            
            await sendEmail(orderDetails, status);
        }

        // Ha a státusz "Teljesített", akkor küld e-mailt a felhasználónak
        else if (status === "Teljesített") {
            const user = await userModel.findById(order.userId);
            const orderDetails = {
                userEmail: user.email,
                userName: user.name,
                orderId: order._id,
                items: order.items,
                amount: order.amount,
                address: order.address,
            };
            
            await sendEmail(orderDetails, status);
        }

        // Ha a státusz "Lejárt", akkor küld e-mailt a felhasználónak
        else if (status === "Nem teljesített") {
            const user = await userModel.findById(order.userId);
            const orderDetails = {
                userEmail: user.email,
                userName: user.name,
                orderId: order._id,
                items: order.items,
                amount: order.amount,
                address: order.address,
            };
            
            await sendEmail(orderDetails, status);
        }

        // A rendelés mentése
        await order.save();

        res.json({ success: true, message: "Státusz frissítve" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, messages: error.message });
    }
};




// Fizetési állapot frissítése
const updatePaymentStatus = async (req, res) => {
    const { orderId, paymentStatus } = req.body;

    try {
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Rendelés nem található' });
        }

        // Frissíti a payment mezőt
        order.payment = (paymentStatus === "Teljesített");
        await order.save();

        return res.json({ success: true, message: 'Fizetési állapot frissítve' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}


export { verifyStripe, placeOrder, allOrders, placeOrderStripe, userOrders, updateStatus, updatePaymentStatus }
