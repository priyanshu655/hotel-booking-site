const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");

// CREATE booking
exports.createBooking = async (req, res) => {
  try {
    const { hotelId, checkIn, checkOut, guests, roomsNeeded, paymentMethod } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const numRooms = Number(roomsNeeded) || 1;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return res
        .status(400)
        .json({ message: "Check-out must be after check-in" });
    }

    // Find overlapping bookings
    const overlappingBookings = await Booking.find({
      hotel: hotelId,
      $or: [
        { checkIn: { $lt: checkOutDate, $gte: checkInDate } },
        { checkOut: { $gt: checkInDate, $lte: checkOutDate } },
        {
          $and: [
            { checkIn: { $lte: checkInDate } },
            { checkOut: { $gte: checkOutDate } },
          ],
        },
      ],
    });

    const bookedRooms = overlappingBookings.reduce(
      (acc, booking) => acc + booking.roomsBooked,
      0
    );

    const availableRooms = hotel.rooms - bookedRooms;

    if (availableRooms < numRooms) {
      return res.status(400).json({
        message: `Only ${availableRooms} room(s) available for the selected dates`,
      });
    }

    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = nights * hotel.pricePerNight * numRooms;

    const booking = await Booking.create({
      hotel: hotelId,
      user: req.userId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: Number(guests),
      roomsBooked: numRooms,
      totalPrice,
      paymentMethod: paymentMethod || "credit_card",
    });

    res.status(201).json({ message: "Booking confirmed!", booking });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating booking", error: err.message });
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
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.userId });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling booking", error: err.message });
  }
};
