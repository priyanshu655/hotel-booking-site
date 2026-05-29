const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");
const { cloudinary } = require("../config/cloudinary");
const redisClient = require("../config/redis");

const getAvailableRooms = (hotel) => hotel.availableRooms ?? hotel.rooms;
const HOTEL_LIST_CACHE_VERSION_KEY = "cache:hotels:version";

const buildHotelListCacheKey = (query, version) => {
  const parts = Object.entries(query || {})
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(",") : String(value)}`);

  return `hotels:v${version}:${parts.length > 0 ? parts.join("&") : "all"}`;
};

const getHotelListCacheVersion = async () => {
  if (!redisClient) return 0;

  try {
    const version = await redisClient.get(HOTEL_LIST_CACHE_VERSION_KEY);
    return Number(version || 0);
  } catch (err) {
    console.error("Redis cache version read failed:", err.message);
    return 0;
  }
};

const bumpHotelListCacheVersion = async () => {
  if (!redisClient) return;

  try {
    await redisClient.incr(HOTEL_LIST_CACHE_VERSION_KEY);
  } catch (err) {
    console.error("Redis cache version bump failed:", err.message);
  }
};

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
    const cacheVersion = await getHotelListCacheVersion();
    const cacheKey = buildHotelListCacheKey(req.query, cacheVersion);

    if (redisClient) {
      try {
        const cachedHotels = await redisClient.get(cacheKey);
        if (cachedHotels) {
          return res.json(JSON.parse(cachedHotels));
        }
      } catch (err) {
        console.error("Redis cache read failed:", err.message);
      }
    }

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

    const allHotels = await Hotel.find(filter).populate("createdBy", "username");
    const hotels = allHotels
      .map((hotel) => ({
        ...hotel.toObject(),
        availableRooms: Math.max(0, getAvailableRooms(hotel)),
      }))
      .filter((hotel) => hotel.availableRooms > 0);

    // Sorting
    const sortHotels = (arr) => {
      return arr.sort((a, b) => {
        if (sort === "price_asc") return a.pricePerNight - b.pricePerNight;
        if (sort === "price_desc") return b.pricePerNight - a.pricePerNight;
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "available")
          return b.availableRooms - a.availableRooms;
        // Default sort by creation date if no other sort is specified
        if (a.createdAt && b.createdAt) return b.createdAt - a.createdAt;
        return 0;
      });
    };

    const sortedHotels = sortHotels(hotels);

    if (redisClient) {
      try {
        await redisClient.set(cacheKey, JSON.stringify(sortedHotels), {
          ex: 300,
        });
      } catch (err) {
        console.error("Redis cache write failed:", err.message);
      }
    }

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
    res.json({
      ...hotel.toObject(),
      availableRooms: Math.max(0, getAvailableRooms(hotel)),
    });
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
      availableRooms: totalRooms,
      category: category || "budget",
      featured: featured === "true" || featured === true,
      createdBy: req.userId,
    });

    await bumpHotelListCacheVersion();

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
    await bumpHotelListCacheVersion();
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
