const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");
const { cloudinary } = require("../config/cloudinary");

// GET all hotels (with optional filters)
exports.getHotels = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sort,
      amenities,
      checkIn,
      checkOut,
    } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }
    if (amenities) {
      const amenityList = amenities.split(",").map((a) => a.trim());
      filter.amenities = { $all: amenityList };
    }

    let hotels;

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      // Find bookings that overlap with the selected dates
      const overlappingBookings = await Booking.find({
        hotel: { $ne: null },
        status: "confirmed",
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

      const hotelBookings = {}; // hotelId -> rooms booked
      for (const booking of overlappingBookings) {
        const hotelId = booking.hotel.toString();
        if (!hotelBookings[hotelId]) {
          hotelBookings[hotelId] = 0;
        }
        hotelBookings[hotelId] += booking.roomsBooked;
      }

      const allHotels = await Hotel.find(filter).populate(
        "createdBy",
        "username"
      );

      hotels = allHotels
        .map((hotel) => {
          const bookedRooms = hotelBookings[hotel._id.toString()] || 0;
          const availableRooms = hotel.rooms - bookedRooms;
          return {
            ...hotel.toObject(),
            availableRooms: availableRooms,
          };
        })
        .filter((hotel) => hotel.availableRooms > 0);
    } else {
      // When no dates provided, calculate available rooms from all confirmed bookings
      const allHotels = await Hotel.find(filter).populate("createdBy", "username");
      
      // Get all confirmed bookings
      const allBookings = await Booking.find({ hotel: { $ne: null }, status: "confirmed" });
      
      const hotelBookings = {}; // hotelId -> total rooms booked
      for (const booking of allBookings) {
        const hotelId = booking.hotel.toString();
        if (!hotelBookings[hotelId]) {
          hotelBookings[hotelId] = 0;
        }
        hotelBookings[hotelId] += booking.roomsBooked;
      }
      
      hotels = allHotels.map((hotel) => {
        const bookedRooms = hotelBookings[hotel._id.toString()] || 0;
        const availableRooms = hotel.rooms - bookedRooms;
        return {
          ...hotel.toObject(),
          availableRooms: Math.max(0, availableRooms),
        };
      });
    }

    // Sorting
    const sortHotels = (arr) => {
      return arr.sort((a, b) => {
        if (sort === "price_asc") return a.pricePerNight - b.pricePerNight;
        if (sort === "price_desc") return b.pricePerNight - a.pricePerNight;
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "available" && checkIn && checkOut)
          return b.availableRooms - a.availableRooms;
        // Default sort by creation date if no other sort is specified
        if (a.createdAt && b.createdAt) return b.createdAt - a.createdAt;
        return 0;
      });
    };

    const sortedHotels = sortHotels(hotels);

    res.json(sortedHotels);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching hotels", error: err.message });
  }
};

// GET single hotel
exports.getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate("createdBy", "username");
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: "Error fetching hotel", error: err.message });
  }
};

// CREATE hotel (admin only)
exports.createHotel = async (req, res) => {
  try {
    const { name, location, description, pricePerNight, rating, amenities, rooms, category, featured } = req.body;

    const images = req.files
      ? req.files.map((f) => ({ url: f.path, public_id: f.filename }))
      : [];

    const totalRooms = Number(rooms) || 1;

    const hotel = await Hotel.create({
      name,
      location,
      description,
      pricePerNight: Number(pricePerNight),
      rating: Number(rating) || 0,
      amenities: amenities ? (typeof amenities === "string" ? JSON.parse(amenities) : amenities) : [],
      images,
      rooms: totalRooms,
      category: category || "budget",
      featured: featured === "true" || featured === true,
      createdBy: req.userId,
    });

    res.status(201).json({ message: "Hotel created", hotel });
  } catch (err) {
    res.status(400).json({ message: "Error creating hotel", error: err.message });
  }
};

// GET hotels listed by this admin
exports.getMyHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ createdBy: req.userId }).sort({ createdAt: -1 });
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your hotels", error: err.message });
  }
};

// DELETE hotel (only owner)
exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    if (hotel.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this hotel" });
    }

    // Remove images from Cloudinary
    for (const img of hotel.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await Hotel.findByIdAndDelete(req.params.id);
    res.json({ message: "Hotel deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting hotel", error: err.message });
  }
};

// GET seller analytics and dashboard data
exports.getSellerAnalytics = async (req, res) => {
  try {
    // Get all hotels created by this seller
    const hotels = await Hotel.find({ createdBy: req.userId });
    const hotelIds = hotels.map((h) => h._id);

    if (hotelIds.length === 0) {
      return res.json({
        hotels: [],
        totalBookings: 0,
        totalRoomsBooked: 0,
        totalRevenue: 0,
        bookingsByMonth: [],
        bookingsByCategory: [],
        bookingsBySeason: [],
        bookingsByStatusChart: [],
        recentBookings: [],
        occupancyByHotel: [],
      });
    }

    // Get all bookings for this seller's hotels
    const bookings = await Booking.find({
      hotel: { $in: hotelIds },
    }).populate("hotel", "name category pricePerNight");

    // Calculate basic stats
    const totalBookings = bookings.length;
    const totalRoomsBooked = bookings.reduce((sum, b) => sum + b.roomsBooked, 0);
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

    // Group bookings by month for line chart
    const bookingsByMonth = {};
    bookings.forEach((booking) => {
      const date = new Date(booking.checkIn);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!bookingsByMonth[monthKey]) {
        bookingsByMonth[monthKey] = { month: monthKey, bookings: 0, revenue: 0, roomsBooked: 0 };
      }
      bookingsByMonth[monthKey].bookings += 1;
      bookingsByMonth[monthKey].revenue += booking.totalPrice;
      bookingsByMonth[monthKey].roomsBooked += booking.roomsBooked;
    });
    const monthlyData = Object.values(bookingsByMonth).sort((a, b) => a.month.localeCompare(b.month));

    // Group bookings by hotel category
    const bookingsByCategory = {};
    bookings.forEach((booking) => {
      const category = booking.hotel.category || "uncategorized";
      if (!bookingsByCategory[category]) {
        bookingsByCategory[category] = { category, count: 0, revenue: 0 };
      }
      bookingsByCategory[category].count += 1;
      bookingsByCategory[category].revenue += booking.totalPrice;
    });
    const categoryData = Object.values(bookingsByCategory);

    // Group bookings by season
    const bookingsBySeason = { summer: 0, winter: 0, spring: 0, fall: 0 };
    const seasonalRevenue = { summer: 0, winter: 0, spring: 0, fall: 0 };
    bookings.forEach((booking) => {
      const month = new Date(booking.checkIn).getMonth();
      let season;
      if (month >= 5 && month <= 7) season = "summer";
      else if (month >= 11 || month <= 1) season = "winter";
      else if (month >= 2 && month <= 4) season = "spring";
      else season = "fall";

      bookingsBySeason[season]++;
      seasonalRevenue[season] += booking.totalPrice;
    });
    const seasonData = Object.entries(bookingsBySeason).map(([season, count]) => ({
      season: season.charAt(0).toUpperCase() + season.slice(1),
      bookings: count,
      revenue: seasonalRevenue[season],
    }));

    // Group bookings by status
    const bookingsByStatus = {};
    bookings.forEach((booking) => {
      const status = booking.status || "confirmed";
      if (!bookingsByStatus[status]) {
        bookingsByStatus[status] = 0;
      }
      bookingsByStatus[status]++;
    });
    const statusData = Object.entries(bookingsByStatus).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
    }));

    // Get occupancy by hotel
    const occupancyByHotel = hotels.map((hotel) => {
      const hotelBookings = bookings.filter((b) => b.hotel._id.toString() === hotel._id.toString());
      const totalRoomDays = hotel.rooms * 365; // Approximate
      const bookedRoomDays = hotelBookings.reduce((sum, b) => {
        const checkIn = new Date(b.checkIn);
        const checkOut = new Date(b.checkOut);
        const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        return sum + b.roomsBooked * days;
      }, 0);
      const occupancyRate = ((bookedRoomDays / totalRoomDays) * 100).toFixed(2);

      return {
        hotelName: hotel.name,
        totalRooms: hotel.rooms,
        totalBookings: hotelBookings.length,
        occupancyRate: parseFloat(occupancyRate),
        totalRoomsBooked: hotelBookings.reduce((sum, b) => sum + b.roomsBooked, 0),
      };
    });

    // Get recent bookings (last 10)
    const recentBookings = bookings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map((b) => ({
        _id: b._id,
        hotelName: b.hotel.name,
        roomsBooked: b.roomsBooked,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        totalPrice: b.totalPrice,
        status: b.status,
      }));

    res.json({
      hotels,
      totalBookings,
      totalRoomsBooked,
      totalRevenue,
      bookingsByMonth: monthlyData,
      bookingsByCategory: categoryData,
      bookingsBySeason: seasonData,
      bookingsByStatusChart: statusData,
      recentBookings,
      occupancyByHotel,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching analytics", error: err.message });
  }
};
