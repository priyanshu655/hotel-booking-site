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
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:5173', 
            'http://localhost:3000',
            'https://planora-pi-eosin.vercel.app'
        ];
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
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