const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  time: String,
  icon: String,
  title: String,
  place: String,
  description: String,
  tip: String,
  lat: Number,
  lng: Number,
});

const daySchema = new mongoose.Schema({
  day: Number,
  title: String,
  theme: String,
  activities: [activitySchema],
});

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    destination: { type: String, required: true },
    preferences: [String],
    days: { type: Number, required: true },
    itinerary: [daySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
