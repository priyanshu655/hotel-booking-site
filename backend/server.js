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

// CORS configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://planora-pi-eosin.vercel.app',
    'https://planora-o2fksilvv-priyanshu655s-projects.vercel.app' // ✅ ADD THIS
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use("/api/auth",authRoutes);
app.use("/api/hotels",hotelRoutes);
app.use("/api/bookings",bookingRoutes);
app.use("/api/trips",tripRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running"));