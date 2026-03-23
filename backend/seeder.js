const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Hotel = require("./models/Hotel");
const User = require("./models/User");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const hotelsData = [
  {
    name: "Burj Al Arab Jumeirah",
    location: "Dubai, UAE",
    description: "Iconic sail-shaped luxury hotel on its own island. The pinnacle of Arabian hospitality.",
    pricePerNight: 45000,
    rating: 5.0,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80", public_id: "seed1_1" },
      { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", public_id: "seed1_2" }
    ],
    rooms: 202,
    category: "luxury",
  },
  {
    name: "Atlantis The Palm",
    location: "Palm Jumeirah, Dubai",
    description: "Legendary resort on the Palm with an iconic waterpark and aquarium.",
    pricePerNight: 22000,
    rating: 4.9,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80", public_id: "seed2_1" },
      { url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80", public_id: "seed2_2" }
    ],
    rooms: 1548,
    category: "resort",
  },
  {
    name: "Armani Hotel Dubai",
    location: "Downtown Dubai",
    description: "World's first Armani Hotel inside the Burj Khalifa. Designed by Giorgio Armani himself.",
    pricePerNight: 38000,
    rating: 4.8,
    amenities: ["Bar", "Restaurant", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80", public_id: "seed3_1" },
      { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80", public_id: "seed3_2" }
    ],
    rooms: 160,
    category: "luxury",
  },
  {
    name: "Four Seasons Resort Dubai",
    location: "Jumeirah Beach, Dubai",
    description: "Beachfront elegance with panoramic views of the Arabian Gulf.",
    pricePerNight: 31000,
    rating: 4.9,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80", public_id: "seed4_1" },
      { url: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&q=80", public_id: "seed4_2" }
    ],
    rooms: 237,
    category: "luxury",
  },
  {
    name: "Palazzo Versace Dubai",
    location: "Culture Village, Dubai",
    description: "A masterpiece of Italian luxury and craftsmanship on Dubai Creek.",
    pricePerNight: 27500,
    rating: 4.7,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80", public_id: "seed5_1" },
      { url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80", public_id: "seed5_2" }
    ],
    rooms: 215,
    category: "luxury",
  },
  {
    name: "Jumeirah Beach Hotel",
    location: "Jumeirah, Dubai",
    description: "Wave-shaped iconic hotel on the beach with direct views of Burj Al Arab.",
    pricePerNight: 18500,
    rating: 4.8,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800&q=80", public_id: "seed6_1" },
      { url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80", public_id: "seed6_2" }
    ],
    rooms: 598,
    category: "resort",
  },
  {
    name: "Ritz-Carlton DIFC",
    location: "DIFC, Dubai",
    description: "Sophisticated urban luxury in the heart of Dubai's financial district.",
    pricePerNight: 29000,
    rating: 4.9,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800&q=80", public_id: "seed7_1" },
      { url: "https://images.unsplash.com/photo-1631049551064-da0ec9d70304?w=800&q=80", public_id: "seed7_2" }
    ],
    rooms: 341,
    category: "luxury",
  },
  {
    name: "One&Only Royal Mirage",
    location: "Al Sufouh, Dubai",
    description: "Arabian palace-inspired resort with lush gardens stretching to private beach.",
    pricePerNight: 34000,
    rating: 4.9,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", public_id: "seed8_1" },
      { url: "https://images.unsplash.com/photo-1602002418082-dd4a7f9b8b17?w=800&q=80", public_id: "seed8_2" }
    ],
    rooms: 250,
    category: "resort",
  },
  {
    name: "W Dubai – The Palm",
    location: "Palm Jumeirah, Dubai",
    description: "Vibrant, design-forward hotel at the tip of Palm Jumeirah with sunset views.",
    pricePerNight: 21000,
    rating: 4.7,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security"],
    images: [
      { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", public_id: "seed9_1" },
      { url: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80", public_id: "seed9_2" }
    ],
    rooms: 295,
    category: "boutique",
  },
  {
    name: "Sofitel Dubai Downtown",
    location: "Downtown Dubai",
    description: "French elegance meets Arabian architecture with stunning Burj Khalifa views.",
    pricePerNight: 12000,
    rating: 4.6,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1590447305000-20aff1d3a71d?w=800&q=80", public_id: "seed10_1" },
      { url: "https://images.unsplash.com/photo-1626195774395-5d8ac766f6f4?w=800&q=80", public_id: "seed10_2" }
    ],
    rooms: 350,
    category: "business",
  },
  {
    name: "Hyatt Regency Creek Heights",
    location: "Deira, Dubai",
    description: "Modern comfort overlooking Dubai Creek with easy city access.",
    pricePerNight: 9500,
    rating: 4.5,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80", public_id: "seed11_1" },
      { url: "https://images.unsplash.com/photo-1611048661702-7b55ced346b4?w=800&q=80", public_id: "seed11_2" }
    ],
    rooms: 316,
    category: "business",
  },
  {
    name: "Intercontinental Dubai Marina",
    location: "Dubai Marina",
    description: "Sleek tower hotel with breathtaking marina and sea views from every room.",
    pricePerNight: 15000,
    rating: 4.7,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80", public_id: "seed12_1" },
      { url: "https://images.unsplash.com/photo-1537639622086-539fd91a4f18?w=800&q=80", public_id: "seed12_2" }
    ],
    rooms: 328,
    category: "business",
  },
  {
    name: "Desert Rose Resort",
    location: "Al Barsha, Dubai",
    description: "Intimate boutique resort with authentic desert-inspired décor and curated experiences.",
    pricePerNight: 8500,
    rating: 4.8,
    amenities: ["Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1553653924-39b70295f8da?w=800&q=80", public_id: "seed13_1" },
      { url: "https://images.unsplash.com/photo-1549294413-26f195200386?w=800&q=80", public_id: "seed13_2" }
    ],
    rooms: 120,
    category: "boutique",
  },
  {
    name: "Marriott Marquis City Centre",
    location: "Deira, Dubai",
    description: "Grand urban hotel perfectly located for exploring old and new Dubai.",
    pricePerNight: 11000,
    rating: 4.6,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80", public_id: "seed14_1" },
      { url: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80", public_id: "seed14_2" }
    ],
    rooms: 400,
    category: "business",
  },
  {
    name: "Taj Dubai",
    location: "Business Bay, Dubai",
    description: "Timeless Indian luxury with contemporary design and iconic Burj Khalifa vistas.",
    pricePerNight: 19000,
    rating: 4.8,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80", public_id: "seed15_1" },
      { url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80", public_id: "seed15_2" }
    ],
    rooms: 296,
    category: "luxury",
  },
  {
    name: "Waldorf Astoria Dubai Palm",
    location: "Palm Jumeirah, Dubai",
    description: "Art deco grandeur on the Palm with a private beach and world-class dining.",
    pricePerNight: 36000,
    rating: 4.9,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800&q=80", public_id: "seed16_1" },
      { url: "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800&q=80", public_id: "seed16_2" }
    ],
    rooms: 319,
    category: "luxury",
  },
  {
    name: "Address Beach Resort",
    location: "Jumeirah Beach Residence",
    description: "Home to the world's highest infinity pool with jaw-dropping beach views.",
    pricePerNight: 23000,
    rating: 4.8,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1548708104-1f91e04b740a?w=800&q=80", public_id: "seed17_1" },
      { url: "https://images.unsplash.com/photo-1570213489059-0aac6626cade?w=800&q=80", public_id: "seed17_2" }
    ],
    rooms: 193,
    category: "resort",
  },
  {
    name: "Hilton Dubai Al Habtoor City",
    location: "Al Habtoor City, Dubai",
    description: "Spectacular mega-resort complex with multiple pools, restaurants and shows.",
    pricePerNight: 13500,
    rating: 4.6,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=800&q=80", public_id: "seed18_1" },
      { url: "https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800&q=80", public_id: "seed18_2" }
    ],
    rooms: 444,
    category: "resort",
  },
  {
    name: "Kempinski Hotel & Residences Palm",
    location: "Palm Jumeirah, Dubai",
    description: "European sophistication with a private beach on the iconic Palm Jumeirah.",
    pricePerNight: 26000,
    rating: 4.7,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80", public_id: "seed19_1" },
      { url: "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?w=800&q=80", public_id: "seed19_2" }
    ],
    rooms: 244,
    category: "luxury",
  },
  {
    name: "Bluewaters Residences Hotel",
    location: "Bluewaters Island, Dubai",
    description: "Contemporary island living next to Ain Dubai, the world's largest observation wheel.",
    pricePerNight: 17000,
    rating: 4.5,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security"],
    images: [
      { url: "https://images.unsplash.com/photo-1529290130-4ca3753253ae?w=800&q=80", public_id: "seed20_1" },
      { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", public_id: "seed20_2" }
    ],
    rooms: 210,
    category: "boutique",
  },
  {
    name: "XVA Art Hotel",
    location: "Al Fahidi, Dubai",
    description: "Heritage boutique hotel inside a restored traditional wind-tower house in old Dubai.",
    pricePerNight: 7200,
    rating: 4.7,
    amenities: ["Restaurant", "TV", "AC", "WiFi", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80", public_id: "seed21_1" },
      { url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80", public_id: "seed21_2" }
    ],
    rooms: 13,
    category: "boutique",
  },
  {
    name: "Grand Hyatt Dubai",
    location: "Oud Metha, Dubai",
    description: "Expansive resort-style hotel in the city with tropical gardens and 13 dining outlets.",
    pricePerNight: 14000,
    rating: 4.6,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80", public_id: "seed22_1" },
      { url: "https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?w=800&q=80", public_id: "seed22_2" }
    ],
    rooms: 674,
    category: "resort",
  },
  {
    name: "Banyan Tree Dubai",
    location: "Downtown Dubai",
    description: "Asian-inspired sanctuary with private pools and holistic spa treatments.",
    pricePerNight: 28000,
    rating: 4.8,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80", public_id: "seed23_1" },
      { url: "https://images.unsplash.com/photo-1570213489059-0aac6626cade?w=800&q=80", public_id: "seed23_2" }
    ],
    rooms: 160,
    category: "luxury",
  },
  {
    name: "Oberoi Dubai",
    location: "Business Bay, Dubai",
    description: "Impeccable Indian luxury hospitality with Burj Khalifa views and butler service.",
    pricePerNight: 32000,
    rating: 4.9,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1533044309907-0fa3413da946?w=800&q=80", public_id: "seed24_1" },
      { url: "https://images.unsplash.com/photo-1611048661702-7b55ced346b4?w=800&q=80", public_id: "seed24_2" }
    ],
    rooms: 252,
    category: "luxury",
  },
  {
    name: "Radisson Blu Hotel Dubai Waterfront",
    location: "Dubai Marina",
    description: "Smart waterfront hotel with direct beach access and marina walk restaurants.",
    pricePerNight: 8800,
    rating: 4.4,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1559508551-44bff1de756b?w=800&q=80", public_id: "seed25_1" },
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", public_id: "seed25_2" }
    ],
    rooms: 267,
    category: "business",
  },
  {
    name: "Mövenpick Hotel Jumeirah Beach",
    location: "Jumeirah Beach Residence",
    description: "Swiss hospitality excellence steps from JBR Beach and The Walk.",
    pricePerNight: 10500,
    rating: 4.5,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=800&q=80", public_id: "seed26_1" },
      { url: "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800&q=80", public_id: "seed26_2" }
    ],
    rooms: 295,
    category: "business",
  },
  {
    name: "Anantara The Palm Dubai",
    location: "Palm Jumeirah, Dubai",
    description: "Over-water villas and Thai-inspired luxury on the Palm with pristine beach.",
    pricePerNight: 25500,
    rating: 4.8,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80", public_id: "seed27_1" },
      { url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80", public_id: "seed27_2" }
    ],
    rooms: 293,
    category: "resort",
  },
  {
    name: "The St. Regis Downtown Dubai",
    location: "Downtown Dubai",
    description: "Timeless luxury with butler service and signature Bloody Mary at the Bar.",
    pricePerNight: 33000,
    rating: 4.8,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80", public_id: "seed28_1" },
      { url: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80", public_id: "seed28_2" }
    ],
    rooms: 215,
    category: "luxury",
  },
  {
    name: "Jumeirah Emirates Towers",
    location: "Sheikh Zayed Road, Dubai",
    description: "Iconic twin towers hotel with exclusive shopping boulevard and power dining.",
    pricePerNight: 16500,
    rating: 4.6,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=800&q=80", public_id: "seed29_1" },
      { url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80", public_id: "seed29_2" }
    ],
    rooms: 400,
    category: "business",
  },
  {
    name: "Aloft Dubai South",
    location: "Dubai South",
    description: "Urban-inspired smart hotel near Expo City and Al Maktoum Airport.",
    pricePerNight: 6500,
    rating: 4.3,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Security"],
    images: [
      { url: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80", public_id: "seed30_1" },
      { url: "https://images.unsplash.com/photo-1617625802912-cde586faf749?w=800&q=80", public_id: "seed30_2" }
    ],
    rooms: 200,
    category: "business",
  },
  {
    name: "Caesars Resort Bluewaters",
    location: "Bluewaters Island, Dubai",
    description: "Roman-inspired resort on Bluewaters with beach, pools and entertainment.",
    pricePerNight: 20000,
    rating: 4.7,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800&q=80", public_id: "seed31_1" },
      { url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80", public_id: "seed31_2" }
    ],
    rooms: 382,
    category: "resort",
  },
  {
    name: "Pullman Dubai Creek City Centre",
    location: "Deira, Dubai",
    description: "Contemporary hotel directly connected to City Centre Deira mall.",
    pricePerNight: 9800,
    rating: 4.5,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80", public_id: "seed32_1" },
      { url: "https://images.unsplash.com/photo-1585670078561-d6b2b7b2e2c3?w=800&q=80", public_id: "seed32_2" }
    ],
    rooms: 325,
    category: "business",
  },
  {
    name: "Le Royal Méridien Beach Resort",
    location: "Dubai Marina",
    description: "Sprawling beachfront resort with private sandy beach and 10 restaurants.",
    pricePerNight: 16000,
    rating: 4.6,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", public_id: "seed33_1" },
      { url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80", public_id: "seed33_2" }
    ],
    rooms: 502,
    category: "resort",
  },
  {
    name: "voco Dubai",
    location: "Sheikh Zayed Road, Dubai",
    description: "IHG's sustainable hotel brand with playful design and green credentials.",
    pricePerNight: 7800,
    rating: 4.4,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=800&q=80", public_id: "seed34_1" },
      { url: "https://images.unsplash.com/photo-1560185127-6b14cc33d617?w=800&q=80", public_id: "seed34_2" }
    ],
    rooms: 210,
    category: "business",
  },
  {
    name: "Sheraton Grand Hotel Dubai",
    location: "Sheikh Zayed Road, Dubai",
    description: "A classic of Dubai hospitality with spectacular views and prime location.",
    pricePerNight: 12500,
    rating: 4.5,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80", public_id: "seed35_1" },
      { url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", public_id: "seed35_2" }
    ],
    rooms: 474,
    category: "business",
  },
  {
    name: "FIVE Palm Jumeirah",
    location: "Palm Jumeirah, Dubai",
    description: "Dubai's most vibrant resort with legendary pool parties and nightlife.",
    pricePerNight: 19500,
    rating: 4.6,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security"],
    images: [
      { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80", public_id: "seed36_1" },
      { url: "https://images.unsplash.com/photo-1509600110300-21b9b36ddcb7?w=800&q=80", public_id: "seed36_2" }
    ],
    rooms: 478,
    category: "resort",
  },
  {
    name: "Paramount Hotel Dubai",
    location: "Business Bay, Dubai",
    description: "Inspired by golden-age Hollywood with glamorous rooms and a rooftop pool bar.",
    pricePerNight: 18000,
    rating: 4.7,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1517956823943-54b5a7e80a6d?w=800&q=80", public_id: "seed37_1" },
      { url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80", public_id: "seed37_2" }
    ],
    rooms: 823,
    category: "business",
  },
  {
    name: "SLS Dubai Hotel & Residences",
    location: "Business Bay, Dubai",
    description: "SBE's art-deco masterpiece with stunning Burj Khalifa and canal views.",
    pricePerNight: 21500,
    rating: 4.7,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80", public_id: "seed38_1" },
      { url: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80", public_id: "seed38_2" }
    ],
    rooms: 254,
    category: "luxury",
  },
  {
    name: "Dream Inn Apartments – Dubai Marina",
    location: "Dubai Marina",
    description: "Cosy, spotless studio apartments with full kitchen and stunning marina view.",
    pricePerNight: 2219,
    rating: 5.0,
    amenities: ["Parking", "TV", "AC", "WiFi", "Pool", "Security"],
    images: [
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", public_id: "seed39_1" },
      { url: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&q=80", public_id: "seed39_2" }
    ],
    rooms: 2,
    category: "boutique",
  },
  {
    name: "Nikki Beach Resort & Spa Dubai",
    location: "Pearl Jumeira, Dubai",
    description: "Glamorous beach resort with Ibiza-inspired club vibes and pristine white sands.",
    pricePerNight: 22500,
    rating: 4.6,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80", public_id: "seed40_1" },
      { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80", public_id: "seed40_2" }
    ],
    rooms: 128,
    category: "resort",
  },
  {
    name: "Meraas La Ville Hotel & Suites",
    location: "City Walk, Dubai",
    description: "Boutique lifestyle hotel in the trendy City Walk open-air district.",
    pricePerNight: 14500,
    rating: 4.8,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800&q=80", public_id: "seed41_1" },
      { url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80", public_id: "seed41_2" }
    ],
    rooms: 156,
    category: "boutique",
  },
  {
    name: "Vida Dubai Mall & Residences",
    location: "Downtown Dubai",
    description: "Connected to Dubai Mall via sky-bridge with Burj Khalifa fountain views.",
    pricePerNight: 16800,
    rating: 4.7,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&q=80", public_id: "seed42_1" },
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80", public_id: "seed42_2" }
    ],
    rooms: 160,
    category: "business",
  },
  {
    name: "Canvas Hotel Dubai",
    location: "Al Quoz, Dubai",
    description: "Arts-district boutique hotel celebrating local creativity and culture.",
    pricePerNight: 6800,
    rating: 4.4,
    amenities: ["Bar", "Restaurant", "Parking", "TV", "AC", "WiFi", "Pool", "Security"],
    images: [
      { url: "https://images.unsplash.com/photo-1584132869994-873f9363a562?w=800&q=80", public_id: "seed43_1" },
      { url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80", public_id: "seed43_2" }
    ],
    rooms: 166,
    category: "boutique",
  },
  {
    name: "Jumeirah Dar Al Masyaf",
    location: "Madinat Jumeirah, Dubai",
    description: "Collection of private Arabian summer houses in Madinat Jumeirah resort.",
    pricePerNight: 42000,
    rating: 4.9,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80", public_id: "seed44_1" },
      { url: "https://images.unsplash.com/photo-1580977251946-c37cce77e7a5?w=800&q=80", public_id: "seed44_2" }
    ],
    rooms: 29,
    category: "luxury",
  },
  {
    name: "Copthorne Hotel Dubai",
    location: "Sheikh Zayed Road, Dubai",
    description: "Well-priced hotel with rooftop pool and easy metro access on SZR.",
    pricePerNight: 7500,
    rating: 4.3,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800&q=80", public_id: "seed45_1" },
      { url: "https://images.unsplash.com/photo-1614649531440-09dc04f20bcd?w=800&q=80", public_id: "seed45_2" }
    ],
    rooms: 340,
    category: "business",
  },
  {
    name: "Habtoor Palace Dubai",
    location: "Al Habtoor City, Dubai",
    description: "Majestic palace-style hotel with extravagant décor and grand ballrooms.",
    pricePerNight: 30000,
    rating: 4.8,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", public_id: "seed46_1" },
      { url: "https://images.unsplash.com/photo-1565018054866-968e244671af?w=800&q=80", public_id: "seed46_2" }
    ],
    rooms: 234,
    category: "luxury",
  },
  {
    name: "Dukes The Palm Hotel",
    location: "Palm Jumeirah, Dubai",
    description: "London club-inspired hotel with afternoon tea and cricket-green lawns.",
    pricePerNight: 18800,
    rating: 4.6,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=800&q=80", public_id: "seed47_1" },
      { url: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80", public_id: "seed47_2" }
    ],
    rooms: 279,
    category: "luxury",
  },
  {
    name: "Millennium Plaza Downtown Hotel",
    location: "Sheikh Zayed Road, Dubai",
    description: "Contemporary hotel at the heart of Dubai's entertainment and business hub.",
    pricePerNight: 9200,
    rating: 4.4,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", public_id: "seed48_1" },
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80", public_id: "seed48_2" }
    ],
    rooms: 317,
    category: "business",
  },
  {
    name: "Jumeirah Mina A'Salam",
    location: "Madinat Jumeirah, Dubai",
    description: "Arabian-inspired palace resort with abra-filled waterways and souq.",
    pricePerNight: 28500,
    rating: 4.8,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80", public_id: "seed49_1" },
      { url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80", public_id: "seed49_2" }
    ],
    rooms: 292,
    category: "resort",
  },
  {
    name: "Al Seef Heritage Hotel Dubai",
    location: "Al Seef, Dubai",
    description: "Boutique hotel blending old and new Dubai along the historic Creek.",
    pricePerNight: 11500,
    rating: 4.7,
    amenities: ["Restaurant", "Parking", "TV", "AC", "WiFi", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1549893072-4bc678117f45?w=800&q=80", public_id: "seed50_1" },
      { url: "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?w=800&q=80", public_id: "seed50_2" }
    ],
    rooms: 317,
    category: "boutique",
  },
  {
    name: "JW Marriott Marquis Dubai",
    location: "Business Bay, Dubai",
    description: "Iconic twin towers — the world's tallest hotel with 40+ dining experiences.",
    pricePerNight: 17500,
    rating: 4.7,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80", public_id: "seed51_1" },
      { url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80", public_id: "seed51_2" }
    ],
    rooms: 1608,
    category: "business",
  },
  {
    name: "InterContinental Residence Suites",
    location: "Dubai Festival City",
    description: "Spacious suites with kitchen and Creek views — perfect for extended stays.",
    pricePerNight: 13200,
    rating: 4.6,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80", public_id: "seed52_1" },
      { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80", public_id: "seed52_2" }
    ],
    rooms: 202,
    category: "business",
  },
  {
    name: "Rove Downtown Dubai",
    location: "Downtown Dubai",
    description: "Meraas' design-forward budget brand — walking distance from Burj Khalifa.",
    pricePerNight: 5800,
    rating: 4.4,
    amenities: ["Restaurant", "Parking", "TV", "AC", "WiFi", "Pool", "Laundry", "Security"],
    images: [
      { url: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80", public_id: "seed53_1" },
      { url: "https://images.unsplash.com/photo-1609347744403-2306bdb03bc3?w=800&q=80", public_id: "seed53_2" }
    ],
    rooms: 533,
    category: "business",
  },
  {
    name: "Flora Grand Hotel",
    location: "Deira, Dubai",
    description: "Great-value hotel in bustling Deira with easy Gold Souk access.",
    pricePerNight: 4500,
    rating: 4.3,
    amenities: ["Restaurant", "Parking", "TV", "AC", "WiFi", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1576354302919-96748cb8299e?w=800&q=80", public_id: "seed54_1" },
      { url: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&q=80", public_id: "seed54_2" }
    ],
    rooms: 182,
    category: "business",
  },
  {
    name: "Address Fountain Views",
    location: "Downtown Dubai",
    description: "Ultra-luxury tower with the best seats for the Dubai Fountain show every night.",
    pricePerNight: 39000,
    rating: 4.9,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1580977251946-c37cce77e7a5?w=800&q=80", public_id: "seed55_1" },
      { url: "https://images.unsplash.com/photo-1590447305000-20aff1d3a71d?w=800&q=80", public_id: "seed55_2" }
    ],
    rooms: 280,
    category: "luxury",
  },
  {
    name: "Arabian Courtyard Hotel & Spa",
    location: "Al Fahidi, Dubai",
    description: "Traditional Arabian-style hotel opposite the Dubai Museum and old souqs.",
    pricePerNight: 6200,
    rating: 4.4,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80", public_id: "seed56_1" },
      { url: "https://images.unsplash.com/photo-1549918778-1e5d8e36a5d4?w=800&q=80", public_id: "seed56_2" }
    ],
    rooms: 173,
    category: "boutique",
  },
  {
    name: "Bvlgari Resort Dubai",
    location: "Jumeira Bay Island, Dubai",
    description: "The world's most exclusive resort on its own private island — pure jewel of Dubai.",
    pricePerNight: 68000,
    rating: 5.0,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800&q=80", public_id: "seed57_1" },
      { url: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80", public_id: "seed57_2" }
    ],
    rooms: 100,
    category: "luxury",
  },
  {
    name: "ibis Styles Dubai Jumeirah",
    location: "Jumeirah, Dubai",
    description: "Colorful budget hotel with free breakfast just 3 minutes from JBR Beach.",
    pricePerNight: 4200,
    rating: 4.2,
    amenities: ["Restaurant", "Parking", "TV", "AC", "WiFi", "Pool", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1611048661702-7b55ced346b4?w=800&q=80", public_id: "seed58_1" },
      { url: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&q=80", public_id: "seed58_2" }
    ],
    rooms: 248,
    category: "business",
  },
  {
    name: "DAMAC Maison Dubai Mall Street",
    location: "Downtown Dubai",
    description: "Fully furnished apartment-style suites steps away from Dubai Mall.",
    pricePerNight: 10800,
    rating: 4.5,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Laundry", "Spa", "Security"],
    images: [
      { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", public_id: "seed59_1" },
      { url: "https://images.unsplash.com/photo-1560185008-a33f5c7c5c93?w=800&q=80", public_id: "seed59_2" }
    ],
    rooms: 464,
    category: "business",
  },
  {
    name: "The Abu Dhabi Edition",
    location: "Al Bateen Marina, Abu Dhabi",
    description: "Ian Schrager's bold luxury brand in Abu Dhabi's elegant marina district.",
    pricePerNight: 24000,
    rating: 4.8,
    amenities: ["Bar", "Restaurant", "Parking", "Gym", "TV", "AC", "WiFi", "Pool", "Spa", "Security", "Breakfast"],
    images: [
      { url: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800&q=80", public_id: "seed60_1" },
      { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", public_id: "seed60_2" }
    ],
    rooms: 198,
    category: "luxury",
  },
];

const importData = async () => {
  try {
    await Hotel.deleteMany();

    // Find an admin user to associate hotels with
    let adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.log("No admin user found, creating one...");
      adminUser = await User.create({
        username: "admin_seeder",
        email: "admin_seeder@planora.com",
        password: "password123",
        role: "admin",
      });
    }

    const sampleHotels = hotelsData.map((hotel) => {
      return { ...hotel, createdBy: adminUser._id };
    });

    await Hotel.insertMany(sampleHotels);
    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Hotel.deleteMany();
    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
