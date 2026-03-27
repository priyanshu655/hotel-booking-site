# 🏨 Planora — Hotel Booking Site: Full Project Documentation

> A full-stack MERN hotel booking and AI-powered trip planning web application.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Directory Structure](#3-directory-structure)
4. [Backend Documentation](#4-backend-documentation)
   - [Entry Point — server.js](#41-entry-point--serverjs)
   - [Database Configuration](#42-database-configuration)
   - [Third-Party Configurations](#43-third-party-configurations)
   - [Database Models (Schemas)](#44-database-models-schemas)
   - [Middleware](#45-middleware)
   - [Controllers](#46-controllers)
   - [Routes & API Endpoints](#47-routes--api-endpoints)
5. [Frontend Documentation](#5-frontend-documentation)
   - [Entry Point & Router](#51-entry-point--router)
   - [API Configuration](#52-api-configuration)
   - [Pages](#53-pages)
6. [Authentication Flow](#6-authentication-flow)
7. [Booking Flow](#7-booking-flow)
8. [Payment Flow](#8-payment-flow)
9. [AI Trip Planner Flow](#9-ai-trip-planner-flow)
10. [Seller Dashboard](#10-seller-dashboard)
11. [Environment Variables](#11-environment-variables)
12. [Installation & Local Setup](#12-installation--local-setup)
13. [Complete API Reference](#13-complete-api-reference)
14. [Data Models Quick Reference](#14-data-models-quick-reference)
15. [Key Features Summary](#15-key-features-summary)

---

## 1. Project Overview

**Planora** is a full-stack hotel booking platform built with the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to search and book hotels, manage their bookings, and plan AI-generated travel itineraries with interactive maps. Hotel owners/sellers can list their properties and view detailed analytics on bookings and revenue.

| Property | Value |
|---|---|
| **Project Type** | Full-Stack Web Application |
| **Architecture** | MVC (Model-View-Controller) |
| **Database** | MongoDB (via Mongoose ODM) |
| **Authentication** | JSON Web Tokens (JWT) |
| **Deployment** | Vercel (Frontend + Backend) |
| **Payment Gateway** | Razorpay |
| **Image Storage** | Cloudinary |
| **AI Integration** | Bytez AI API |
| **Maps** | Leaflet + OpenStreetMap |

---

## 2. Technology Stack

### Backend Technologies

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | Runtime | JavaScript server runtime |
| **Express.js** | ^5.2.1 | Web server & REST API framework |
| **MongoDB** | Cloud/Local | NoSQL document database |
| **Mongoose** | ^9.2.3 | MongoDB object modeling (ODM) |
| **jsonwebtoken** | ^9.0.3 | JWT token creation & verification |
| **bcryptjs** | ^3.0.3 | Password hashing |
| **Multer** | ^2.1.1 | Multipart form-data (file uploads) |
| **multer-storage-cloudinary** | ^4.0.0 | Cloudinary storage adapter for Multer |
| **Cloudinary** | ^1.41.3 | Cloud image storage & transformation |
| **Razorpay** | ^2.9.6 | Payment gateway SDK |
| **Axios** | ^1.13.6 | HTTP client (for AI/geocoding API calls) |
| **bytez.js** | ^3.0.0 | Bytez AI API client (itinerary generation) |
| **cors** | ^2.8.6 | Cross-Origin Resource Sharing |
| **dotenv** | ^17.3.1 | Environment variable management |
| **Nodemon** | dev | Auto-restart server on file changes |

### Frontend Technologies

| Technology | Version | Purpose |
|---|---|---|
| **React** | ^19.2.0 | UI component library |
| **Vite** | ^7.3.1 | Build tool & dev server |
| **React Router DOM** | ^7.13.1 | Client-side routing |
| **Axios** | ^1.13.6 | HTTP requests to backend API |
| **Framer Motion** | ^12.35.0 | Declarative animations |
| **React Hot Toast** | ^2.6.0 | Toast notifications |
| **Recharts** | ^3.8.0 | Data visualization charts |
| **React Leaflet** | ^5.0.0 | React wrapper for Leaflet maps |
| **Leaflet** | ^1.9.4 | Interactive maps library |
| **Lucide React** | ^0.577.0 | Clean icon library |
| **React Icons** | ^5.6.0 | Additional icon packs |
| **ESLint** | ^9.39.1 | Code linting |

---

## 3. Directory Structure

```
hotel-booking-site/
│
├── backend/                              # Node.js + Express API server
│   ├── config/
│   │   ├── cloudinary.js                # Cloudinary SDK + Multer storage setup
│   │   ├── db.js                        # MongoDB connection
│   │   └── razorpay.js                  # Razorpay instance
│   ├── controllers/
│   │   ├── authController.js            # signup, login, getMe
│   │   ├── bookingController.js         # createBooking, getMyBookings, cancelBooking
│   │   ├── hotelController.js           # hotel CRUD + seller analytics
│   │   ├── paymentController.js         # Razorpay order, verify, refund
│   │   └── tripController.js            # AI itinerary generation + trip CRUD
│   ├── middleware/
│   │   ├── authMiddleware.js            # JWT verification (protects routes)
│   │   └── adminMiddleware.js           # Seller/Admin role enforcement
│   ├── models/
│   │   ├── User.js                      # User schema (user / seller / admin)
│   │   ├── Hotel.js                     # Hotel schema (images, amenities, pricing)
│   │   ├── Booking.js                   # Booking schema (payment tracking)
│   │   └── Trip.js                      # Trip/Itinerary schema (AI-generated)
│   ├── routes/
│   │   ├── authRoutes.js                # /api/auth
│   │   ├── hotelRoutes.js               # /api/hotels
│   │   ├── bookingRoutes.js             # /api/bookings
│   │   ├── paymentRoutes.js             # /api/payments
│   │   └── tripRoutes.js                # /api/trips
│   ├── data/
│   │   └── placesDB.js                  # Hardcoded POI data for 30+ cities
│   ├── server.js                        # App entry point
│   ├── seeder.js                        # Database seeding script
│   └── package.json
│
├── frontned/                             # React + Vite frontend (note: typo in folder name)
│   ├── public/                          # Static public assets
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx             # Hotel search, filter, and browse
│   │   │   ├── AuthPage.jsx             # Login & Signup (with plane animation)
│   │   │   ├── HotelDetail.jsx          # Hotel details + booking form
│   │   │   ├── MyBookings.jsx           # User booking management
│   │   │   ├── AddHotel.jsx             # Seller hotel listing form
│   │   │   ├── TripPlanner.jsx          # AI-powered trip planner with map
│   │   │   └── SellerDashboard.jsx      # Seller analytics & charts
│   │   ├── assets/                      # Images and static assets
│   │   ├── App.jsx                      # Root component with router
│   │   ├── App.css                      # Component styles
│   │   ├── config.js                    # API base URL config
│   │   ├── index.css                    # Global styles
│   │   └── main.jsx                     # React DOM entry point
│   ├── index.html                       # HTML shell
│   ├── vite.config.js                   # Vite configuration
│   └── package.json
│
├── package.json                         # Root (leaflet + react-leaflet)
├── vercel.json                          # Vercel deployment configuration
├── SELLER_DASHBOARD_SETUP.md
├── SELLER_DASHBOARD_DOCUMENTATION.md
└── README.md
```

---

## 4. Backend Documentation

The backend is a **Node.js + Express** REST API following the **MVC pattern**. It is organized into configs, models, controllers, middleware, and routes.

### 4.1 Entry Point — `server.js`

This is where the Express application is created, middleware is applied, routes are mounted, and the server starts listening.

```js
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const connectDb = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const tripRoutes = require('./routes/tripRoutes');
const cors = require('cors');

// Connect to MongoDB
connectDb();

// Body parser
app.use(express.json());

// CORS — allows Vercel deployments and localhost
app.use(cors({
    origin: function(origin, callback) {
        if (!origin ||
            origin.includes("vercel.app") ||
            origin.startsWith("http://localhost")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

// Mount routes
app.use("/api/auth",     authRoutes);
app.use("/api/hotels",   hotelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/trips",    tripRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

**What this file does:**
- Loads environment variables from `.env`
- Connects to MongoDB
- Enables JSON body parsing and CORS
- Mounts all route modules under `/api/*`
- Starts the HTTP server

---

### 4.2 Database Configuration

**File:** `backend/config/db.js`

```js
const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";

const connectDb = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully");
    } catch(err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);  // Exit process on DB failure
    }
};

module.exports = connectDb;
```

This function is called once at startup. If the connection fails, the process exits immediately (fail-fast pattern).

**Required env variable:** `MONGODB_URI`

---

### 4.3 Third-Party Configurations

#### Cloudinary — `backend/config/cloudinary.js`

Cloudinary is used to store hotel images in the cloud. Multer (a middleware for handling `multipart/form-data`) is configured with a Cloudinary storage adapter so uploaded images go directly to Cloudinary.

```js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Store images in the "planora-hotels" Cloudinary folder
// Auto-resize to max 1200×800, auto-compress quality
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "planora-hotels",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 800, crop: "limit", quality: "auto" }],
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
```

The exported `upload` middleware is used in hotel routes to handle image file fields.

**Required env variables:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

---

#### Razorpay — `backend/config/razorpay.js`

```js
const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpayInstance;
```

This single Razorpay instance is imported by the payment controller.

**Required env variables:** `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

---

### 4.4 Database Models (Schemas)

#### User Model — `backend/models/User.js`

Represents a registered user. Supports three roles.

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },  // stored as bcrypt hash
    role: {
        type: String,
        enum: ["user", "admin", "seller"],
        default: "user"
    },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
```

| Field | Type | Notes |
|---|---|---|
| `username` | String | Unique, required |
| `email` | String | Unique, required |
| `password` | String | Hashed with bcrypt (10 rounds) |
| `role` | String | `"user"` (default), `"seller"`, `"admin"` |
| `createdAt` | Date | Auto-set by timestamps |
| `updatedAt` | Date | Auto-set by timestamps |

**Roles explained:**
- `user` — Can browse hotels, make bookings, plan trips
- `seller` — Can also list hotels and view analytics
- `admin` — Same permissions as seller

---

#### Hotel Model — `backend/models/Hotel.js`

Represents a hotel listing created by a seller.

```js
const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  location:     { type: String, required: true, trim: true },
  description:  { type: String, required: true },
  pricePerNight:{ type: Number, required: true },
  rating:       { type: Number, default: 0, min: 0, max: 5 },
  amenities:    [{ type: String }],
  images: [
    {
      url:       { type: String, required: true },  // Cloudinary URL
      public_id: { type: String, required: true },  // For deletion
    },
  ],
  rooms:    { type: Number, required: true, default: 20 },
  category: {
    type: String,
    enum: ["luxury", "budget", "boutique", "resort", "business"],
    default: "budget",
  },
  featured:  { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Hotel", hotelSchema);
```

| Field | Type | Notes |
|---|---|---|
| `name` | String | Hotel name |
| `location` | String | City/address |
| `description` | String | Full description |
| `pricePerNight` | Number | In INR (rupees) |
| `rating` | Number | 0–5 star rating |
| `amenities` | [String] | e.g., WiFi, Pool, Gym |
| `images` | [Object] | Each has `url` and `public_id` from Cloudinary |
| `rooms` | Number | Total available rooms |
| `category` | String | luxury / budget / boutique / resort / business |
| `featured` | Boolean | Highlighted on homepage |
| `createdBy` | ObjectId | Reference to the seller User |

---

#### Booking Model — `backend/models/Booking.js`

Tracks every hotel booking made by a user, including payment details.

```js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  hotel:        { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  user:         { type: mongoose.Schema.Types.ObjectId, ref: "User",  required: true },
  checkIn:      { type: Date, required: true },
  checkOut:     { type: Date, required: true },
  guests:       { type: Number, required: true, min: 1 },
  roomsBooked:  { type: Number, required: true, default: 1, min: 1 },
  totalPrice:   { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "confirmed",
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "debit_card", "upi", "net_banking", "wallet"],
    default: "credit_card",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "refunded", "failed"],
    default: "pending",
  },
  paymentId: String,   // Razorpay payment ID
  orderId:   String,   // Razorpay order ID
  refundId:  String,   // Razorpay refund ID
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
```

| Field | Type | Notes |
|---|---|---|
| `hotel` | ObjectId | Reference to Hotel |
| `user` | ObjectId | Reference to User |
| `checkIn` / `checkOut` | Date | Stay dates |
| `guests` | Number | Number of guests |
| `roomsBooked` | Number | Number of rooms |
| `totalPrice` | Number | nights × rooms × pricePerNight |
| `status` | String | pending / confirmed / cancelled |
| `paymentMethod` | String | 5 payment options |
| `paymentStatus` | String | pending / completed / refunded / failed |
| `paymentId` | String | From Razorpay after payment |
| `orderId` | String | Razorpay order reference |
| `refundId` | String | Set when refund is issued |

---

#### Trip Model — `backend/models/Trip.js`

Stores AI-generated travel itineraries, including day-by-day activities with GPS coordinates.

```js
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  time:        String,   // e.g., "09:00 AM"
  icon:        String,   // Emoji icon
  title:       String,   // Activity name
  place:       String,   // Place/venue name
  description: String,   // What to do there
  tip:         String,   // Insider tip
  lat:         Number,   // GPS latitude
  lng:         Number,   // GPS longitude
});

const daySchema = new mongoose.Schema({
  day:        Number,     // Day number (1, 2, 3…)
  title:      String,     // Day title e.g. "Explore the Old City"
  theme:      String,     // Day theme e.g. "Cultural Heritage"
  activities: [activitySchema],
});

const tripSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  destination: { type: String, required: true },
  preferences: [String],   // e.g., ["foodie", "history", "adventure"]
  days:        { type: Number, required: true },
  itinerary:   [daySchema],
}, { timestamps: true });

module.exports = mongoose.model("Trip", tripSchema);
```

---

### 4.5 Middleware

Middleware functions run between the HTTP request and the controller. They are placed on protected routes.

#### Auth Middleware — `backend/middleware/authMiddleware.js`

Protects routes by requiring a valid JWT Bearer token.

```js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header is present and formatted correctly
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;  // Attach user ID to request object
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
```

**How it works:**
1. Reads the `Authorization: Bearer <token>` header
2. Verifies the token using `JWT_SECRET`
3. Decodes the user ID and attaches it to `req.userId`
4. Calls `next()` to proceed to the controller
5. Returns 401 if token is missing, malformed, or expired

---

#### Admin/Seller Middleware — `backend/middleware/adminMiddleware.js`

Ensures the authenticated user has the `seller` or `admin` role. Must be used after `authMiddleware`.

```js
const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || (user.role !== "admin" && user.role !== "seller")) {
      return res.status(403).json({ message: "Admin or Seller access required" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: "Authorization error" });
  }
};

module.exports = adminMiddleware;
```

**Used on:** POST `/api/hotels` (create hotel), DELETE `/api/hotels/:id`, GET `/api/hotels/analytics/dashboard`

---

### 4.6 Controllers

Controllers contain the business logic for each feature. They are called by routes and interact with models.

#### Auth Controller — `backend/controllers/authController.js`

Handles user registration, login, and profile retrieval.

**`signup(req, res)`**
```
1. Read username, email, password, role from req.body
2. Check if user with same email already exists
3. Hash password with bcrypt (10 salt rounds)
4. Create new User document
5. Sign JWT token (expires in 7 days)
6. Return token and user info
```

**`login(req, res)`**
```
1. Read email, password from req.body
2. Find user by email
3. Compare password with bcrypt.compare()
4. Sign JWT token
5. Return token and user info
```

**`getMe(req, res)`**
```
1. req.userId set by authMiddleware
2. Find user by ID (exclude password field)
3. Return user object
```

---

#### Hotel Controller — `backend/controllers/hotelController.js`

**`getHotels(req, res)`**
Fetches hotels with optional filtering and sorting via query parameters:
- `search` — text match on name or location
- `category` — filter by hotel type
- `minPrice` / `maxPrice` — price range
- `amenities` — comma-separated list of required amenities
- `checkIn` / `checkOut` — for availability calculation
- `sort` — `price_asc`, `price_desc`, `rating`, `available`

**`getHotel(req, res)`**
Returns a single hotel by `id` with all fields populated.

**`createHotel(req, res)`**
```
1. Requires authMiddleware + adminMiddleware
2. Multer processes uploaded images → sends to Cloudinary
3. Creates hotel document with image URLs, public_ids
4. Sets createdBy = req.userId
```

**`getMyHotels(req, res)`**
Returns all hotels where `createdBy === req.userId`.

**`deleteHotel(req, res)`**
```
1. Finds hotel by ID
2. Checks hotel.createdBy === req.userId
3. Deletes all Cloudinary images using public_id
4. Deletes the hotel document
```

**`getSellerAnalytics(req, res)`**
Runs multiple MongoDB aggregation queries to produce:
- Total revenue, total bookings, total rooms booked
- Monthly booking trend (last 12 months)
- Bookings grouped by hotel category
- Seasonal distribution (Spring, Summer, Autumn, Winter)
- Booking status breakdown (confirmed, pending, cancelled)
- Occupancy rate per hotel
- Revenue grouped by season

---

#### Booking Controller — `backend/controllers/bookingController.js`

**`createBooking(req, res)`**
```
1. Requires authenticated user
2. Reads hotel, checkIn, checkOut, guests, roomsBooked, paymentMethod from body
3. Validates hotel exists
4. Counts overlapping confirmed bookings for date range
5. Checks (hotel.rooms - alreadyBookedRooms) >= roomsBooked
6. Calculates nights and totalPrice
7. Creates and returns Booking document
```

**`getMyBookings(req, res)`**
Returns all bookings for `req.userId` with hotel details populated.

**`cancelBooking(req, res)`**
```
1. Finds booking by ID
2. Verifies booking.user === req.userId
3. Sets status = "cancelled"
4. Saves and returns updated booking
```

---

#### Payment Controller — `backend/controllers/paymentController.js`

**`createPaymentOrder(req, res)`**
```
1. Reads bookingId from body
2. Finds booking and validates ownership
3. Converts totalPrice (rupees) to paise (×100)
4. Creates Razorpay order with amount, currency "INR", receipt
5. Stores orderId on booking
6. Returns Razorpay order details + key_id
```

**`verifyPayment(req, res)`**
```
1. Reads razorpay_order_id, razorpay_payment_id, razorpay_signature from body
2. Creates HMAC-SHA256 signature using key_secret
3. Compares computed signature vs received signature
4. If match: sets paymentStatus="completed", paymentId on booking
5. If mismatch: returns 400 error
```

**`getPaymentStatus(req, res)`**
Returns the `paymentStatus` and related IDs for a booking.

**`refundPayment(req, res)`**
```
1. Finds booking by ID
2. Calls razorpay.payments.refund(paymentId, { amount })
3. Sets paymentStatus="refunded", refundId on booking
4. Returns refund details
```

---

#### Trip Controller — `backend/controllers/tripController.js`

**`generateItinerary(req, res)`**
```
1. Reads destination, days, preferences from body
2. Geocodes destination using Nominatim API
3. Fetches real Points of Interest from Overpass API (OpenStreetMap)
4. Falls back to placesDB if API unavailable
5. Sends prompt to Bytez AI API with destination + POI context
6. AI returns structured JSON itinerary with day-by-day activities
7. Each activity includes: time, icon, title, place, description, tip, lat, lng
8. Returns itinerary to frontend
```

**`createTrip(req, res)`**
Saves an itinerary to the database linked to `req.userId`.

**`getMyTrips(req, res)`**
Returns all saved trips for the authenticated user.

**`deleteTrip(req, res)`**
Deletes a trip by ID after verifying ownership.

---

### 4.7 Routes & API Endpoints

#### Auth Routes — `/api/auth`

| Method | Path | Middleware | Controller | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/signup` | — | `signup` | Register a new user |
| `POST` | `/api/auth/login` | — | `login` | Authenticate and get token |
| `GET` | `/api/auth/me` | `authMiddleware` | `getMe` | Get logged-in user's profile |

**Signup request body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "user"
}
```

**Login request body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Auth response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "_id": "64f...",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

#### Hotel Routes — `/api/hotels`

| Method | Path | Middleware | Description |
|---|---|---|---|
| `GET` | `/api/hotels` | — | Get all hotels (supports filters) |
| `GET` | `/api/hotels/:id` | — | Get single hotel details |
| `GET` | `/api/hotels/my` | `auth` | Get current user's hotels |
| `GET` | `/api/hotels/analytics/dashboard` | `auth` + `admin` | Get seller analytics data |
| `POST` | `/api/hotels` | `auth` + `admin` + `upload` | Create new hotel listing |
| `DELETE` | `/api/hotels/:id` | `auth` | Delete hotel (owner only) |

**GET `/api/hotels` query parameters:**
```
?search=goa           # Search by name or location
&category=luxury      # Filter by category
&minPrice=1000        # Minimum price per night
&maxPrice=10000       # Maximum price per night
&amenities=WiFi,Pool  # Comma-separated required amenities
&checkIn=2025-08-01   # Check availability from date
&checkOut=2025-08-07  # Check availability to date
&sort=price_asc       # Sort: price_asc | price_desc | rating | available
```

**POST `/api/hotels` — multipart/form-data fields:**
```
name, location, description, pricePerNight, rating,
rooms, category, amenities (JSON array), images (files)
```

---

#### Booking Routes — `/api/bookings`

| Method | Path | Middleware | Description |
|---|---|---|---|
| `POST` | `/api/bookings` | `auth` | Create a new booking |
| `GET` | `/api/bookings/my` | `auth` | Get all bookings for current user |
| `PATCH` | `/api/bookings/:id/cancel` | `auth` | Cancel a booking |

**POST `/api/bookings` request body:**
```json
{
  "hotel": "64f...",
  "checkIn": "2025-08-01",
  "checkOut": "2025-08-05",
  "guests": 2,
  "roomsBooked": 1,
  "paymentMethod": "credit_card"
}
```

**Booking response:**
```json
{
  "_id": "64g...",
  "hotel": { "name": "The Grand Palace", "location": "Goa", ... },
  "checkIn": "2025-08-01T00:00:00.000Z",
  "checkOut": "2025-08-05T00:00:00.000Z",
  "guests": 2,
  "roomsBooked": 1,
  "totalPrice": 8000,
  "status": "confirmed",
  "paymentStatus": "pending"
}
```

---

#### Payment Routes — `/api/payments`

| Method | Path | Middleware | Description |
|---|---|---|---|
| `POST` | `/api/payments/create-order` | `auth` | Create a Razorpay payment order |
| `POST` | `/api/payments/verify` | `auth` | Verify payment after checkout |
| `GET` | `/api/payments/status/:bookingId` | `auth` | Get payment status of a booking |
| `POST` | `/api/payments/refund` | `auth` | Request a payment refund |

---

#### Trip Routes — `/api/trips`

| Method | Path | Middleware | Description |
|---|---|---|---|
| `POST` | `/api/trips/generate` | `auth` | Generate AI itinerary |
| `POST` | `/api/trips` | `auth` | Save a trip to database |
| `GET` | `/api/trips/my` | `auth` | Get all trips for current user |
| `DELETE` | `/api/trips/:id` | `auth` | Delete a saved trip |

**POST `/api/trips/generate` request body:**
```json
{
  "destination": "Jaipur",
  "days": 3,
  "preferences": ["history", "foodie", "art"]
}
```

---

## 5. Frontend Documentation

The frontend is built with **React 19** and **Vite**. It uses React Router for navigation, Axios for API calls, Framer Motion for animations, and Recharts for dashboard charts.

### 5.1 Entry Point & Router

**`frontned/src/main.jsx`** — The React DOM root:
```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

**`frontned/src/App.jsx`** — All routes are defined here:
```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage       from "./pages/AuthPage";
import HomePage       from "./pages/HomePage";
import HotelDetail    from "./pages/HotelDetail";
import MyBookings     from "./pages/MyBookings";
import AddHotel       from "./pages/AddHotel";
import TripPlanner    from "./pages/TripPlanner";
import SellerDashboard from "./pages/SellerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                  element={<HomePage />} />
        <Route path="/auth"              element={<AuthPage />} />
        <Route path="/hotel/:id"         element={<HotelDetail />} />
        <Route path="/bookings"          element={<MyBookings />} />
        <Route path="/add-hotel"         element={<AddHotel />} />
        <Route path="/trip-planner"      element={<TripPlanner />} />
        <Route path="/seller-dashboard"  element={<SellerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

| Route | Page | Access |
|---|---|---|
| `/` | HomePage | Public |
| `/auth` | AuthPage | Public (redirects if logged in) |
| `/hotel/:id` | HotelDetail | Public (booking requires login) |
| `/bookings` | MyBookings | Requires login |
| `/add-hotel` | AddHotel | Requires seller/admin role |
| `/trip-planner` | TripPlanner | Requires login |
| `/seller-dashboard` | SellerDashboard | Requires seller/admin role |

---

### 5.2 API Configuration

**`frontned/src/config.js`**
```js
const API = import.meta.env.VITE_API_URL;

if (!API) {
  console.error("❌ API URL not found. Check environment variables.");
}

export { API };
```

All pages import `API` and use it as the base URL for Axios calls:
```js
import { API } from "../config";
const res = await axios.get(`${API}/hotels`);
```

---

### 5.3 Pages

#### `AuthPage.jsx` — Login & Signup

This page handles user authentication with a visually impressive **animated plane intro** using the HTML5 Canvas API.

**Key features:**
- **Plane intro animation** — A canvas-based animation plays when the page loads, drawing a plane flying along a cubic bezier curve before revealing the auth form
- **Toggle between Sign In / Sign Up** — Single page handles both flows
- **Role selection on signup** — Choose "User" or "Host" (seller) role
- **Password visibility toggle**
- **Form validation** — Checks for empty fields, email format
- **Toast notifications** — Success/error feedback via react-hot-toast
- **JWT token storage** — Saved to `localStorage` as `token`

**Signup flow:**
```
User fills username, email, password, role
  → POST /api/auth/signup
  → Success: store token + user in localStorage → redirect to "/"
  → Error: show toast with error message
```

**Login flow:**
```
User fills email, password
  → POST /api/auth/login
  → Success: store token + user in localStorage → redirect to "/"
  → Error: show toast with error message
```

**Logout flow (from any page with navbar):**
```
User clicks Logout
  → Remove "token" and "user" from localStorage
  → Redirect to "/auth"
```

**Key state variables:**
```js
const [isLogin, setIsLogin]         = useState(true);   // Toggle login/signup view
const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
const [formData, setFormData]       = useState({
  username: "", email: "", password: "", role: "user"
});
const [loading, setLoading]         = useState(false);
```

**Axios call example:**
```js
const handleSignup = async () => {
  const res = await axios.post(`${API}/auth/signup`, formData);
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  navigate("/");
};
```

---

#### `HomePage.jsx` — Hotel Browse & Search

The main landing page where users can discover, search, and filter hotels.

**Key features:**
- **Hotel grid** — Responsive card grid showing all hotels
- **Search bar** — Real-time text search by hotel name or location
- **Category filter bar** — Mood-based categories (All, Luxury, Resort, Boutique, Budget, Business)
- **Advanced filter panel** — Min/max price, amenities multi-select, date range for availability
- **Sort options** — By price (asc/desc), rating, or availability
- **3D tilt card effect** — Hotel cards tilt in 3D on mouse hover using CSS transforms
- **Floating draggable menu (TouchBall)** — An iPhone-style floating button with navigation links. Can be dragged around the screen.
- **Availability calculation** — When dates are entered, rooms available per hotel is shown
- **Navigation bar** — Links to Trip Planner, My Bookings, Add Hotel (sellers), Seller Dashboard (sellers), Login/Logout

**How filters work:**
```js
// All filters are compiled into query parameters and sent to backend
const fetchHotels = async () => {
  const params = new URLSearchParams();
  if (searchQuery)  params.append("search", searchQuery);
  if (category)     params.append("category", category);
  if (minPrice)     params.append("minPrice", minPrice);
  if (maxPrice)     params.append("maxPrice", maxPrice);
  if (amenities.length) params.append("amenities", amenities.join(","));
  if (checkIn)      params.append("checkIn", checkIn);
  if (checkOut)     params.append("checkOut", checkOut);
  if (sort)         params.append("sort", sort);

  const res = await axios.get(`${API}/hotels?${params.toString()}`);
  setHotels(res.data);
};
```

**TiltCard Component:**
```jsx
// Each hotel card listens to mouse move events and applies 3D rotation
const handleMouseMove = (e) => {
  const rect = cardRef.current.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  const rotateX = (-y / rect.height) * 15;
  const rotateY = (x / rect.width) * 15;
  cardRef.current.style.transform =
    `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
};
```

---

#### `HotelDetail.jsx` — Hotel Details & Booking

Detailed view of a single hotel. Accessed via `/hotel/:id`.

**Key features:**
- **Image carousel** — Navigate through hotel photos with Previous/Next buttons
- **Hotel info panel** — Name, location, rating stars, category badge, description
- **Amenities grid** — Icons for each amenity (WiFi, Pool, Gym, etc.)
- **Booking form** (right sidebar):
  - Check-in date picker
  - Check-out date picker
  - Number of guests
  - Number of rooms
  - Payment method dropdown (5 options)
  - Live price calculation (nights × rooms × price)
- **Room availability check** — Shows how many rooms are available for selected dates
- **Save to favorites** — UI button (localStorage based)
- **Share button** — Copies URL to clipboard
- **Sticky navbar** that changes style on scroll

**Booking submission:**
```js
const handleBooking = async () => {
  // Validate dates and room availability
  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000*60*60*24));
  if (nights <= 0) return toast.error("Invalid dates");

  const res = await axios.post(
    `${API}/bookings`,
    { hotel: hotel._id, checkIn, checkOut, guests, roomsBooked, paymentMethod },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  toast.success("Booking confirmed!");
  navigate("/bookings");
};
```

---

#### `MyBookings.jsx` — Booking Management

Authenticated users view and manage all their hotel bookings.

**Key features:**
- **Bookings list** — Each card shows hotel name, photo, location, dates, guests, rooms, total price
- **Status badges** — Color-coded: `confirmed` (green), `pending` (yellow), `cancelled` (red)
- **Filter tabs** — Show All / Confirmed / Pending / Cancelled
- **Cancel booking** — Button with confirmation dialog; calls PATCH `/api/bookings/:id/cancel`
- **Payment status indicator** — Shows `completed`, `pending`, `refunded`, or `failed`
- **Sticky navbar** with Logout

**Fetching bookings:**
```js
const fetchBookings = async () => {
  const res = await axios.get(`${API}/bookings/my`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  setBookings(res.data);
};
```

---

#### `AddHotel.jsx` — Seller Hotel Listing

Only accessible to users with `seller` or `admin` role. Allows hotel creation and management.

**Key features:**
- **Role check** — Redirects non-sellers to homepage
- **Hotel listing form:**
  - Name, Location, Description (text inputs)
  - Price per night, Rating, Number of rooms (number inputs)
  - Category selector (5 options)
  - Amenities multi-select (12 amenities: WiFi, Pool, Gym, Restaurant, Spa, Parking, AC, Room Service, Beach Access, Mountain View, Pet Friendly, Bar)
  - Image upload with drag-and-drop support
  - Image preview grid (thumbnail previews before upload)
- **My Hotels table** — Lists all hotels the user has created (name, location, price, category, rooms, rating)
- **Delete hotel** — Removes listing and deletes images from Cloudinary

**Form submission (multipart/form-data):**
```js
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("name", name);
  formData.append("location", location);
  formData.append("description", description);
  formData.append("pricePerNight", pricePerNight);
  formData.append("rating", rating);
  formData.append("rooms", rooms);
  formData.append("category", category);
  formData.append("amenities", JSON.stringify(amenities));
  images.forEach(img => formData.append("images", img));

  await axios.post(`${API}/hotels`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  toast.success("Hotel listed successfully!");
};
```

---

#### `TripPlanner.jsx` — AI-Powered Trip Planner

The most complex page. Combines AI itinerary generation with an interactive map.

**Key features:**
- **Hero image carousel** — 4 background images rotate every 4 seconds with fade transition
- **Trip form:**
  - Destination input (geocoded with Nominatim)
  - Trip duration slider/input (1–14 days)
  - Preference tags — select from 9 categories: Foodie, History & Culture, Adventure, Nature & Wildlife, Art & Museums, Beach & Water, Nightlife, Spiritual & Wellness, Shopping
- **AI itinerary generation** — Sends request to backend which calls Bytez AI
- **Interactive map** (React Leaflet):
  - Markers for each activity across all days
  - Numbered markers matching the itinerary order
  - Map auto-fits bounds to show all locations
  - `MapFitter` component updates map bounds when itinerary changes
- **Day-by-day itinerary panel:**
  - Each day has a title and theme
  - Activities listed with: time, emoji icon, activity name, venue, description, insider tip
  - Coordinates shown for each activity
- **Save trip** — Stores the itinerary to the database
- **Mobile responsive** — Stacks map and itinerary vertically on small screens

**Generate itinerary flow:**
```js
const generateItinerary = async () => {
  setLoading(true);
  const res = await axios.post(
    `${API}/trips/generate`,
    { destination, days, preferences },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  setItinerary(res.data.itinerary);
  // Map automatically updates to fit all activity markers
};
```

**MapFitter component:**
```jsx
// Automatically adjusts map zoom/bounds to show all activity markers
function MapFitter({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [40, 40] });
    }
  }, [positions, map]);
  return null;
}
```

---

#### `SellerDashboard.jsx` — Analytics Dashboard

Available to sellers and admins. Shows comprehensive booking and revenue analytics using Recharts.

**Key features:**

**Summary Cards:**
- 💰 Total Revenue (sum of all booking prices)
- 📅 Total Bookings (count)
- 🛏️ Total Rooms Booked
- 🏨 Total Hotels Listed

**Charts (powered by Recharts):**

| Chart | Type | Data |
|---|---|---|
| Monthly Booking Trend | Line Chart | Bookings per month (last 12 months) |
| Bookings by Category | Bar Chart | Count per hotel category |
| Seasonal Distribution | Bar Chart | Bookings per season |
| Booking Status Breakdown | Pie Chart | Confirmed vs Pending vs Cancelled |
| Hotel Occupancy Rates | Bar Chart | % occupancy per hotel |
| Revenue by Season | Bar Chart | Revenue per season |

**Tab Navigation:**
- **Overview** — All charts and summary cards
- **My Hotels** — Detailed table of seller's hotels (name, location, price, rooms, occupancy, revenue)
- **Recent Bookings** — Last 10 bookings across all seller's hotels

**Occupancy color coding:**
```js
const getOccupancyColor = (rate) => {
  if (rate >= 70) return "#22c55e";  // Green - high occupancy
  if (rate >= 40) return "#f59e0b";  // Amber - medium occupancy
  return "#ef4444";                  // Red - low occupancy
};
```

**Logout from dashboard:**
```js
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/auth");
};
```

---

## 6. Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    SIGNUP FLOW                              │
│                                                             │
│  User fills form → POST /api/auth/signup                    │
│    ↓                                                        │
│  Backend: Hash password (bcrypt) → Create User → Sign JWT   │
│    ↓                                                        │
│  Response: { token, user }                                  │
│    ↓                                                        │
│  Frontend: localStorage.setItem("token", token)             │
│            localStorage.setItem("user", JSON.stringify(user))│
│    ↓                                                        │
│  Redirect to homepage                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    LOGIN FLOW                               │
│                                                             │
│  User fills email + password → POST /api/auth/login         │
│    ↓                                                        │
│  Backend: Find user by email → bcrypt.compare(password)     │
│    ↓                                                        │
│  If match: Sign JWT (7 day expiry) → Return token + user    │
│    ↓                                                        │
│  Frontend: Store in localStorage → Redirect                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                PROTECTED ROUTE FLOW                         │
│                                                             │
│  Frontend: axios.get(url, {                                 │
│    headers: { Authorization: `Bearer ${token}` }            │
│  })                                                         │
│    ↓                                                        │
│  authMiddleware: Extract token from Authorization header     │
│    ↓                                                        │
│  jwt.verify(token, JWT_SECRET) → Decode userId              │
│    ↓                                                        │
│  req.userId = decoded.id → next()                           │
│    ↓                                                        │
│  Controller runs with req.userId available                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    LOGOUT FLOW                              │
│                                                             │
│  User clicks Logout                                         │
│    ↓                                                        │
│  localStorage.removeItem("token")                           │
│  localStorage.removeItem("user")                            │
│    ↓                                                        │
│  navigate("/auth")                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Booking Flow

```
1. User navigates to /hotel/:id
2. Hotel details loaded (GET /api/hotels/:id)
3. User fills: checkIn, checkOut, guests, rooms, paymentMethod
4. Frontend calculates: nights × roomsBooked × pricePerNight = totalPrice
5. User clicks "Book Now"
6. POST /api/bookings (with Authorization header)
   Backend:
   - Validates hotel exists
   - Counts overlapping confirmed bookings for those dates
   - Checks if enough rooms are available
   - Creates Booking { status: "confirmed", paymentStatus: "pending" }
7. Booking confirmed → redirect to /bookings
8. User can view booking on MyBookings page
9. User can cancel booking (PATCH /api/bookings/:id/cancel)
```

---

## 8. Payment Flow

```
1. After booking is created (status: "confirmed", paymentStatus: "pending")
2. Frontend calls POST /api/payments/create-order { bookingId }
   Backend:
   - Converts totalPrice to paise (×100)
   - Creates Razorpay order
   - Stores orderId on booking
   - Returns { orderId, amount, currency, key_id }
3. Frontend opens Razorpay checkout modal with order details
4. User completes payment (card/UPI/netbanking/wallet)
5. Razorpay returns { razorpay_order_id, razorpay_payment_id, razorpay_signature }
6. Frontend calls POST /api/payments/verify
   Backend:
   - Creates HMAC-SHA256: orderId + "|" + paymentId using key_secret
   - Compares with received signature
   - If valid: booking.paymentStatus = "completed", booking.paymentId = paymentId
7. Payment verified → booking fully confirmed
8. For refunds: POST /api/payments/refund
   - Razorpay processes refund
   - booking.paymentStatus = "refunded", booking.refundId set
```

---

## 9. AI Trip Planner Flow

```
1. User navigates to /trip-planner
2. Enters: destination (e.g., "Jaipur"), number of days (e.g., 3),
   preferences (e.g., ["history", "foodie"])
3. Clicks "Generate My Itinerary"
4. POST /api/trips/generate { destination, days, preferences }

   Backend:
   a. Geocode destination using Nominatim API
      → Get lat/lng coordinates of city
   b. Fetch Points of Interest from Overpass API (OpenStreetMap)
      → Restaurants, museums, parks, temples, etc. near coordinates
   c. If Overpass unavailable, fall back to placesDB (30+ Indian cities)
   d. Build a detailed prompt for Bytez AI:
      "Create a {days}-day itinerary for {destination} with POIs: [list]
       User preferences: {preferences}
       Return JSON with day, title, theme, activities[]"
   e. Call Bytez AI API → Get structured JSON response
   f. Return itinerary array to frontend

5. Frontend displays:
   - Interactive map with numbered markers for all activities
   - Day-by-day accordion panels
   - Each activity: time, icon, name, venue, description, tip, coordinates

6. User can save trip: POST /api/trips { destination, days, preferences, itinerary }
7. Saved trips viewable on the same page
```

---

## 10. Seller Dashboard

The seller dashboard provides hotel owners with business intelligence through 6 interactive charts and 3 data tables.

### Accessing the Dashboard

Only users with `role: "seller"` or `role: "admin"` can access `/seller-dashboard`.

### Analytics Data (GET `/api/hotels/analytics/dashboard`)

The backend runs MongoDB aggregation pipelines to compute:

**Summary metrics:**
```js
// Total revenue across all seller's hotels
db.bookings.aggregate([
  { $match: { hotel: { $in: sellerHotelIds }, status: { $ne: "cancelled" } } },
  { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
])
```

**Monthly trend:**
```js
// Group bookings by year+month for trend line
{ $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            count: { $sum: 1 } } }
```

**Occupancy rate per hotel:**
```js
// (rooms booked / total rooms) × 100
occupancyRate = (totalRoomsBooked / (hotel.rooms * bookingCount)) * 100
```

---

## 11. Environment Variables

### Backend — `backend/.env`

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/planora

# Authentication
JWT_SECRET=your-super-secret-key-minimum-32-characters

# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (payments)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Server
PORT=8080
```

### Frontend — `frontned/.env`

```env
# Development
VITE_API_URL=http://localhost:8080/api

# Production (example)
VITE_API_URL=https://your-backend.vercel.app/api
```

> **Important:** Never commit `.env` files to version control. Add them to `.gitignore`.

---

## 12. Installation & Local Setup

### Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (free tier works)
- Razorpay account (test mode works)

### Step 1 — Clone & Install

```bash
git clone https://github.com/priyanshu655/hotel-booking-site.git
cd hotel-booking-site
```

### Step 2 — Setup Backend

```bash
cd backend
npm install
```

Create `backend/.env` with all required variables (see above).

```bash
npm run dev        # Start development server (nodemon)
# OR
npm start          # Start production server (node)
```

The backend runs on `http://localhost:8080` by default.

### Step 3 — Seed Database (Optional)

```bash
cd backend
node seeder.js       # Import sample hotels and users
node seeder.js -d    # Destroy all seeded data
```

### Step 4 — Setup Frontend

```bash
cd frontned
npm install
```

Create `frontned/.env`:
```env
VITE_API_URL=http://localhost:8080/api
```

```bash
npm run dev        # Start Vite dev server
```

The frontend runs on `http://localhost:5173`.

### Step 5 — Build for Production

```bash
cd frontned
npm run build      # Outputs to frontned/dist/
```

---

## 13. Complete API Reference

### Authentication

```
POST   /api/auth/signup           Register new user
POST   /api/auth/login            Login user, get JWT
GET    /api/auth/me               Get logged-in user (🔒 auth)
```

### Hotels

```
GET    /api/hotels                Browse hotels (supports query filters)
GET    /api/hotels/:id            Get single hotel details
GET    /api/hotels/my             Get logged-in user's hotels (🔒 auth)
GET    /api/hotels/analytics/dashboard  Seller analytics (🔒 auth + seller)
POST   /api/hotels                Create hotel listing (🔒 auth + seller)
DELETE /api/hotels/:id            Delete hotel (🔒 auth, owner only)
```

### Bookings

```
POST   /api/bookings              Create new booking (🔒 auth)
GET    /api/bookings/my           Get user's bookings (🔒 auth)
PATCH  /api/bookings/:id/cancel   Cancel a booking (🔒 auth)
```

### Payments

```
POST   /api/payments/create-order     Create Razorpay order (🔒 auth)
POST   /api/payments/verify           Verify payment signature (🔒 auth)
GET    /api/payments/status/:bookingId Get payment status (🔒 auth)
POST   /api/payments/refund           Refund a payment (🔒 auth)
```

### Trips

```
POST   /api/trips/generate        Generate AI itinerary (🔒 auth)
POST   /api/trips                 Save trip (🔒 auth)
GET    /api/trips/my              Get user's trips (🔒 auth)
DELETE /api/trips/:id             Delete trip (🔒 auth)
```

> 🔒 = Requires `Authorization: Bearer <token>` header

---

## 14. Data Models Quick Reference

```
USER
├── username (String, unique)
├── email (String, unique)
├── password (String, hashed)
├── role ("user" | "seller" | "admin")
└── timestamps

HOTEL
├── name, location, description
├── pricePerNight (Number, INR)
├── rating (Number, 0-5)
├── amenities ([String])
├── images ([{ url, public_id }])
├── rooms (Number)
├── category ("luxury" | "budget" | "boutique" | "resort" | "business")
├── featured (Boolean)
├── createdBy → User
└── timestamps

BOOKING
├── hotel → Hotel
├── user → User
├── checkIn, checkOut (Date)
├── guests, roomsBooked (Number)
├── totalPrice (Number, INR)
├── status ("pending" | "confirmed" | "cancelled")
├── paymentMethod ("credit_card" | "debit_card" | "upi" | "net_banking" | "wallet")
├── paymentStatus ("pending" | "completed" | "refunded" | "failed")
├── paymentId, orderId, refundId (Razorpay IDs)
└── timestamps

TRIP
├── user → User
├── destination (String)
├── preferences ([String])
├── days (Number)
├── itinerary
│   └── [ Day
│       ├── day, title, theme
│       └── activities
│           └── [ Activity
│               ├── time, icon, title, place
│               ├── description, tip
│               └── lat, lng ]
│   ]
└── timestamps
```

---

## 15. Key Features Summary

### 👤 User Features
- ✅ Register and log in with role selection (User or Host/Seller)
- ✅ Browse and search hotels by name, location, category, price, amenities
- ✅ View hotel details with image carousel and amenity listing
- ✅ Check room availability for selected dates
- ✅ Book hotels with real-time total price calculation
- ✅ Choose from 5 payment methods
- ✅ Complete payment via Razorpay gateway
- ✅ Manage bookings — view, filter by status, cancel
- ✅ Generate AI-powered travel itineraries with maps
- ✅ Save and manage trip plans
- ✅ Responsive UI with animations (Framer Motion, plane animation, card tilt)

### 🏨 Seller / Host Features
- ✅ Register as a seller (Host role)
- ✅ List new hotels with photos (Cloudinary upload), amenities, pricing
- ✅ Drag-and-drop image upload with preview
- ✅ Manage hotel listings — view, delete
- ✅ Access analytics dashboard with 6 interactive charts
- ✅ Track revenue, bookings, occupancy rates
- ✅ View seasonal trends and category performance
- ✅ See recent bookings across all their properties

### ⚙️ Technical Features
- ✅ JWT-based authentication (7-day tokens)
- ✅ Role-based access control (user / seller / admin)
- ✅ Password hashing with bcryptjs
- ✅ Cloudinary image storage with auto-resize and optimization
- ✅ Razorpay payment processing with signature verification
- ✅ HMAC-SHA256 payment signature validation
- ✅ Real-time room availability calculation
- ✅ AI itinerary generation (Bytez AI)
- ✅ Real POI data from OpenStreetMap (Overpass API)
- ✅ Geocoding via Nominatim
- ✅ Interactive maps with React Leaflet
- ✅ MongoDB aggregation pipelines for analytics
- ✅ CORS configured for Vercel and localhost
- ✅ Database seeding script for development

---

*Documentation generated for Planora Hotel Booking Site — MERN Stack Application*
