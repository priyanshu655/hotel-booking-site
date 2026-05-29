const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const redisClient = require("../config/redis");

const HOTEL_LIST_CACHE_VERSION_KEY = "cache:hotels:version";

const bumpHotelListCacheVersion = async () => {
  if (!redisClient) return;

  await redisClient.incr(HOTEL_LIST_CACHE_VERSION_KEY);
};

// CREATE booking
exports.createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { hotelId, checkIn, checkOut, guests, roomsNeeded, paymentMethod } = req.body;

    const hotelExists = await Hotel.exists({ _id: hotelId });
    if (!hotelExists) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const numRooms = Number(roomsNeeded) || 1;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return res
        .status(400)
        .json({ message: "Check-out must be after check-in" });
    }

    session.startTransaction();

    const hotel = await Hotel.findOneAndUpdate(
      {
        _id: hotelId,
        $expr: {
          $gte: [
            { $ifNull: ["$availableRooms", "$rooms"] },
            numRooms,
          ],
        },
      },
      {
        $inc: { availableRooms: -numRooms },
      },
      {
        new: true,
        session,
      }
    );

    if (!hotel) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Not enough rooms available for booking",
      });
    }

    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = nights * hotel.pricePerNight * numRooms;

    const [booking] = await Booking.create([
      {
        hotel: hotelId,
        user: req.userId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: Number(guests),
        roomsBooked: numRooms,
        totalPrice,
        status: "pending",
        paymentMethod: paymentMethod || "credit_card",
      },
    ], { session });

    await session.commitTransaction();
    await bumpHotelListCacheVersion();

    res.status(201).json({ message: "Booking confirmed!", booking });
  } catch (err) {
    try {
      await session.abortTransaction();
    } catch (abortErr) {
      // ignore abort errors and return the original failure
    }
    res
      .status(400)
      .json({ message: "Error creating booking", error: err.message });
  } finally {
    session.endSession();
  }
};

// GET user's bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate("hotel", "name location images pricePerNight rooms")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
};

// CANCEL booking
exports.cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const booking = await Booking.findOne({ _id: req.params.id, user: req.userId }).session(session);
    if (!booking) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.status === "cancelled") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    await Hotel.findByIdAndUpdate(
      booking.hotel,
      { $inc: { availableRooms: booking.roomsBooked } },
      { session }
    );

    booking.status = "cancelled";
    await booking.save({ session });

    await session.commitTransaction();
    await bumpHotelListCacheVersion();

    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    try {
      await session.abortTransaction();
    } catch (abortErr) {
      // ignore abort errors and return the original failure
    }
    res.status(500).json({ message: "Error cancelling booking", error: err.message });
  } finally {
    session.endSession();
  }
};
