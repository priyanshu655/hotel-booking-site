const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    amenities: [{ type: String }],
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    rooms: { type: Number, required: true, default: 20 },
    category: {
      type: String,
      enum: ["luxury", "budget", "boutique", "resort", "business"],
      default: "budget",
    },
    featured: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);
