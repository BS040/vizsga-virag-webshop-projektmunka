import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected',() => {
        console.log("Adatbazis kapcsolodva");
        
    })

    await mongoose.connect(`${process.env.MONGODB_URI}/webshop`)

}

export default connectDB;