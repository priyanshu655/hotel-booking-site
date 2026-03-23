const express = require("express");
const router = express.Router();
const { getHotels, getHotel, createHotel, deleteHotel, getMyHotels, getSellerAnalytics } = require("../controllers/hotelController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { upload } = require("../config/cloudinary");

// Public routes
router.get("/", getHotels);

// Protected routes (requires authentication) - MUST be before /:id
router.get("/my", authMiddleware, getMyHotels);
router.get("/analytics/dashboard", authMiddleware, getSellerAnalytics);

// Public routes (specific ID lookup - MUST be last)
router.get("/:id", getHotel);

// Protected routes (admin/seller only)
router.post("/", authMiddleware, adminMiddleware, upload.array("images", 5), createHotel);
router.delete("/:id", authMiddleware, adminMiddleware, deleteHotel);

module.exports = router;
