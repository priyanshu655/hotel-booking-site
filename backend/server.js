const dotenv=require('dotenv');
dotenv.config();

const express=require('express');
const app=express();
const connectDb=require('./config/db');
const authRoutes=require('./routes/authRoutes');
const hotelRoutes=require('./routes/hotelRoutes');
const bookingRoutes=require('./routes/bookingRoutes');
const tripRoutes=require('./routes/tripRoutes');
const cors=require('cors');

connectDb();
app.use(express.json());
app.use(cors());
app.use("/api/auth",authRoutes);
app.use("/api/hotels",hotelRoutes);
app.use("/api/bookings",bookingRoutes);
app.use("/api/trips",tripRoutes);


app.listen(8080,()=>{
    console.log("running on port 8080");
});