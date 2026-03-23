const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { generateItinerary, createTrip, getMyTrips, deleteTrip } = require("../controllers/tripController");

router.post("/generate", authMiddleware, generateItinerary);
router.post("/", authMiddleware, createTrip);
router.get("/my", authMiddleware, getMyTrips);
router.delete("/:id", authMiddleware, deleteTrip);

module.exports = router;
