const dotenv=require('dotenv');
dotenv.config();

const express=require('express');
const app=express();
const connectDb=require('./config/db');
const authRoutes=require('./routes/authRoutes');
const hotelRoutes=require('./routes/hotelRoutes');
const bookingRoutes=require('./routes/bookingRoutes');
const paymentRoutes=require('./routes/paymentRoutes');
const tripRoutes=require('./routes/tripRoutes');
const cors=require('cors');
const { apiLimiter } = require("./middleware/rateLimiters");

connectDb();
app.use(express.json());

// CORS configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_2,
    'http://localhost:5173',
    'http://localhost:3000',
    'https://planora-pi-eosin.vercel.app',
    'https://planora-o2fksilvv-priyanshu655s-projects.vercel.app'
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        if (
            !origin ||
            allowedOrigins.includes(origin) ||
            origin.includes("vercel.app") ||   // ✅ allow ALL Vercel domains
            origin.startsWith("http://localhost")
        ) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use("/api", apiLimiter);
app.use("/api/auth",authRoutes);
app.use("/api/hotels",hotelRoutes);
app.use("/api/bookings",bookingRoutes);
app.use("/api/payment",paymentRoutes);
app.use("/api/payments",paymentRoutes);
app.use("/api/trips",tripRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running"));