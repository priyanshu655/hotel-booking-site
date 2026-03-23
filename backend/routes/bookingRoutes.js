const express = require("express");
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking } = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createBooking);
router.get("/my", authMiddleware, getMyBookings);
router.patch("/:id/cancel", authMiddleware, cancelBooking);

module.exports = router;
