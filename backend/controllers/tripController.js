const Trip = require("../models/Trip");
const Bytez = require("bytez.js");
const { PLACES_DB, lookupCity } = require("../data/placesDB");
const axios = require("axios");

const BYTEZ_API_KEY = "198080f2ac224651d2f50ef0d394b992";

// ── Preferences metadata ──
const PREF_INFO = {
  foodie: { label: "Foodie", theme: "Culinary Delights" },
  history: { label: "History", theme: "Heritage Trail" },
  adventure: { label: "Adventure", theme: "Thrilling Escapades" },
  nature: { label: "Nature", theme: "Into the Wild" },
  art: { label: "Art & Culture", theme: "Cultural Immersion" },
  beach: { label: "Beach", theme: "Coastal Paradise" },
  nightlife: { label: "Nightlife", theme: "After Dark" },
  spiritual: { label: "Spiritual", theme: "Soul Journey" },
  shopping: { label: "Shopping", theme: "Retail Therapy" },
};

// ── Map preferences to OSM tourism/amenity tags ──
const PREF_TO_OSM = {
  foodie: ["restaurant", "cafe", "fast_food", "food_court", "bakery"],
  history: ["museum", "monument", "memorial", "castle", "archaeological_site", "historic", "ruins"],
  adventure: ["theme_park", "viewpoint", "attraction", "sports_centre", "stadium"],
  nature: ["park", "garden", "zoo", "nature_reserve", "beach", "waterfall"],
  art: ["museum", "gallery", "arts_centre", "theatre", "artwork"],
  beach: ["beach", "swimming_pool"],
  nightlife: ["nightclub", "bar", "pub", "casino"],
  spiritual: ["place_of_worship", "monastery"],
  shopping: ["marketplace", "mall", "shop"],
};

// ── Geocode destination using Nominatim (free OSM service) ──
async function geocodeDestination(destination) {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: destination,
        format: "json",
        limit: 1,
        addressdetails: 1,
      },
      headers: { "User-Agent": "Planora-TripPlanner/1.0" },
      timeout: 10000,
    });
    
    if (response.data?.length > 0) {
      const place = response.data[0];
      return {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
        displayName: place.display_name,
        city: place.address?.city || place.address?.town || place.address?.village || destination,
        country: place.address?.country,
      };
    }
    return null;
  } catch (err) {
    console.log("Geocoding error:", err.message);
    return null;
  }
}

// ── Fetch real POIs from OpenStreetMap using Overpass API ──
async function fetchRealPOIs(lat, lng, preferences, radius = 15000) {
  try {
    // Build Overpass query for tourism and relevant amenities
    const tourismTypes = ["attraction", "museum", "viewpoint", "zoo", "theme_park", "aquarium", 
                          "artwork", "gallery", "information", "hotel"];
    const amenityTypes = ["restaurant", "cafe", "bar", "place_of_worship", "theatre", "cinema",
                          "nightclub", "marketplace", "park"];
    const historicTypes = ["monument", "memorial", "castle", "ruins", "archaeological_site", 
                           "palace", "fort", "temple", "church", "mosque"];
    const leisureTypes = ["park", "garden", "nature_reserve", "beach_resort", "stadium", "sports_centre"];
    const shopTypes = ["mall", "marketplace", "department_store"];

    const overpassQuery = `
      [out:json][timeout:30];
      (
        node["tourism"~"${tourismTypes.join("|")}"](around:${radius},${lat},${lng});
        node["amenity"~"${amenityTypes.join("|")}"](around:${radius},${lat},${lng});
        node["historic"~"${historicTypes.join("|")}"](around:${radius},${lat},${lng});
        node["leisure"~"${leisureTypes.join("|")}"](around:${radius},${lat},${lng});
        node["shop"~"${shopTypes.join("|")}"](around:${radius},${lat},${lng});
        way["tourism"~"${tourismTypes.join("|")}"](around:${radius},${lat},${lng});
        way["historic"~"${historicTypes.join("|")}"](around:${radius},${lat},${lng});
        way["leisure"~"${leisureTypes.join("|")}"](around:${radius},${lat},${lng});
      );
      out center 200;
    `;

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      `data=${encodeURIComponent(overpassQuery)}`,
      { 
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 30000,
      }
    );

    const places = [];
    const seenNames = new Set();

    for (const element of response.data?.elements || []) {
      const name = element.tags?.name || element.tags?.["name:en"];
      if (!name || seenNames.has(name.toLowerCase())) continue;
      seenNames.add(name.toLowerCase());

      const placeLat = element.lat || element.center?.lat;
      const placeLng = element.lon || element.center?.lon;
      if (!placeLat || !placeLng) continue;

      // Determine place type and icon
      const { tags, icon } = categorizePlace(element.tags, preferences);

      places.push({
        name,
        lat: placeLat,
        lng: placeLng,
        tags,
        icon,
        desc: element.tags?.description || generateDescription(name, tags, element.tags),
        tip: element.tags?.["opening_hours"] 
          ? `Hours: ${element.tags["opening_hours"]}` 
          : "Check local hours before visiting.",
        osmType: element.tags?.tourism || element.tags?.amenity || element.tags?.historic || element.tags?.leisure,
      });
    }

    // Sort by relevance to user preferences
    places.sort((a, b) => {
      const aScore = a.tags.filter(t => preferences.includes(t)).length;
      const bScore = b.tags.filter(t => preferences.includes(t)).length;
      return bScore - aScore;
    });

    return places.slice(0, 80); // Return top 80 places
  } catch (err) {
    console.log("Overpass API error:", err.message);
    return [];
  }
}

// ── Categorize place based on OSM tags ──
function categorizePlace(tags, preferences) {
  const result = { tags: [], icon: "📍" };
  
  const tagMap = {
    // Tourism
    museum: { tag: "history", icon: "🏛️" },
    attraction: { tag: "adventure", icon: "⭐" },
    viewpoint: { tag: "nature", icon: "🌄" },
    zoo: { tag: "nature", icon: "🦁" },
    aquarium: { tag: "nature", icon: "🐠" },
    theme_park: { tag: "adventure", icon: "🎢" },
    artwork: { tag: "art", icon: "🎨" },
    gallery: { tag: "art", icon: "🖼️" },
    // Amenities
    restaurant: { tag: "foodie", icon: "🍽️" },
    cafe: { tag: "foodie", icon: "☕" },
    bar: { tag: "nightlife", icon: "🍸" },
    nightclub: { tag: "nightlife", icon: "🎉" },
    place_of_worship: { tag: "spiritual", icon: "🕌" },
    theatre: { tag: "art", icon: "🎭" },
    cinema: { tag: "art", icon: "🎬" },
    marketplace: { tag: "shopping", icon: "🛍️" },
    // Historic
    monument: { tag: "history", icon: "🗿" },
    memorial: { tag: "history", icon: "🏛️" },
    castle: { tag: "history", icon: "🏰" },
    palace: { tag: "history", icon: "👑" },
    fort: { tag: "history", icon: "🏯" },
    ruins: { tag: "history", icon: "🏚️" },
    temple: { tag: "spiritual", icon: "🛕" },
    church: { tag: "spiritual", icon: "⛪" },
    mosque: { tag: "spiritual", icon: "🕌" },
    archaeological_site: { tag: "history", icon: "🏺" },
    // Leisure
    park: { tag: "nature", icon: "🌿" },
    garden: { tag: "nature", icon: "🌸" },
    nature_reserve: { tag: "nature", icon: "🌲" },
    beach: { tag: "beach", icon: "🏖️" },
    beach_resort: { tag: "beach", icon: "🏖️" },
    stadium: { tag: "adventure", icon: "🏟️" },
    sports_centre: { tag: "adventure", icon: "⚽" },
    // Shop
    mall: { tag: "shopping", icon: "🏬" },
    department_store: { tag: "shopping", icon: "🛒" },
  };

  const allOsmTypes = [
    tags?.tourism, tags?.amenity, tags?.historic, 
    tags?.leisure, tags?.shop, tags?.natural
  ].filter(Boolean);

  for (const osmType of allOsmTypes) {
    if (tagMap[osmType]) {
      if (!result.tags.includes(tagMap[osmType].tag)) {
        result.tags.push(tagMap[osmType].tag);
      }
      result.icon = tagMap[osmType].icon;
    }
  }

  // Add religion-based icon
  if (tags?.religion === "christian") result.icon = "⛪";
  if (tags?.religion === "muslim") result.icon = "🕌";
  if (tags?.religion === "hindu") result.icon = "🛕";
  if (tags?.religion === "buddhist") result.icon = "☸️";
  if (tags?.religion === "jewish") result.icon = "🕍";

  // Default tags based on tourism type
  if (result.tags.length === 0) {
    if (tags?.tourism) result.tags.push("adventure");
    else if (tags?.amenity) result.tags.push("foodie");
    else result.tags.push("adventure");
  }

  return result;
}

// ── Generate description for a place ──
function generateDescription(name, tags, osmTags) {
  const type = osmTags?.tourism || osmTags?.amenity || osmTags?.historic || osmTags?.leisure || "place";
  const typeNames = {
    museum: "museum", restaurant: "restaurant", cafe: "café", bar: "bar",
    park: "park", garden: "garden", monument: "monument", castle: "castle",
    church: "church", mosque: "mosque", temple: "temple", palace: "palace",
    theatre: "theatre", attraction: "attraction", viewpoint: "scenic viewpoint",
    zoo: "zoo", aquarium: "aquarium", marketplace: "market", mall: "shopping mall",
  };
  const typeName = typeNames[type] || type;
  
  const wiki = osmTags?.wikipedia || osmTags?.wikidata ? " A notable landmark." : "";
  const website = osmTags?.website ? " Check their website for details." : "";
  
  return `A popular ${typeName} worth visiting.${wiki}${website}`;
}

// ── Generate itinerary using real places database + OSM + Bytez AI ──
exports.generateItinerary = async (req, res) => {
  try {
    const { destination, preferences, days } = req.body;
    if (!destination || !preferences?.length || !days) {
      return res.status(400).json({ message: "Missing destination, preferences, or days" });
    }

    const numDays = Math.min(Math.max(1, parseInt(days)), 14);
    const cityKey = lookupCity(destination);

    let itinerary;
    
    // PRIORITY 1: Check our curated database first
    if (cityKey && PLACES_DB[cityKey]) {
      console.log(`Using curated database for: ${cityKey}`);
      itinerary = buildItineraryFromDB(cityKey, destination, preferences, numDays);
      
      // Try to enhance descriptions with Bytez AI
      try {
        itinerary = await enhanceWithAI(itinerary, destination, preferences);
      } catch (aiErr) {
        console.log("AI enhancement skipped:", aiErr.message);
      }
    } else {
      // PRIORITY 2: Use OpenStreetMap for ANY destination in the world
      console.log(`Geocoding destination: ${destination}`);
      const geoData = await geocodeDestination(destination);
      
      if (!geoData) {
        return res.status(400).json({ 
          message: `Could not find "${destination}". Please check the spelling or try a more specific location (e.g., "Paris, France" instead of just "Paris").` 
        });
      }

      console.log(`Found: ${geoData.displayName} at ${geoData.lat}, ${geoData.lng}`);
      
      // Fetch real POIs from OpenStreetMap
      const osmPlaces = await fetchRealPOIs(geoData.lat, geoData.lng, preferences);
      
      if (osmPlaces.length >= 5) {
        console.log(`Found ${osmPlaces.length} POIs from OpenStreetMap`);
        itinerary = buildItineraryFromOSM(osmPlaces, destination, preferences, numDays, geoData);
        
        // Try to enhance with AI
        try {
          itinerary = await enhanceWithAI(itinerary, destination, preferences);
        } catch (aiErr) {
          console.log("AI enhancement skipped:", aiErr.message);
        }
      } else {
        // PRIORITY 3: Fall back to pure AI generation
        console.log(`Few OSM results (${osmPlaces.length}), trying AI generation...`);
        try {
          itinerary = await generateWithBytezAI(destination, preferences, numDays);
        } catch (aiErr) {
          console.error("Bytez AI generation failed:", aiErr.message);
          
          // Even if AI fails, try to make something from the limited OSM data
          if (osmPlaces.length > 0) {
            itinerary = buildItineraryFromOSM(osmPlaces, destination, preferences, numDays, geoData);
          } else {
            return res.status(400).json({ 
              message: `Limited data available for "${destination}". This might be a remote or less-documented area. Try a nearby major city or tourist destination.` 
            });
          }
        }
      }
    }

    res.json({ itinerary });
  } catch (err) {
    console.error("Generate error:", err);
    res.status(500).json({ message: "Failed to generate itinerary", error: err.message });
  }
};

// ── Build itinerary from OpenStreetMap POIs ──
function buildItineraryFromOSM(places, destination, preferences, numDays, geoData) {
  const activitiesPerDay = 5;
  const totalNeeded = numDays * activitiesPerDay;
  
  // Score places by preference match
  const scored = places.map(place => {
    const matchCount = place.tags.filter(t => preferences.includes(t)).length;
    return { ...place, score: matchCount };
  });
  scored.sort((a, b) => b.score - a.score);

  // Select places
  let selectedPlaces = scored.slice(0, totalNeeded);
  
  // If not enough, cycle through
  while (selectedPlaces.length < totalNeeded && places.length > 0) {
    selectedPlaces.push(places[selectedPlaces.length % places.length]);
  }

  const timeSlots = [
    { time: "9:00 AM", prefix: "Morning" },
    { time: "11:00 AM", prefix: "Late Morning" },
    { time: "1:30 PM", prefix: "Afternoon" },
    { time: "4:00 PM", prefix: "Late Afternoon" },
    { time: "7:30 PM", prefix: "Evening" },
  ];

  const dayTitles = [
    "Discovering", "Exploring", "Hidden Gems of", "The Best of", "Adventures in",
    "Wandering", "Heart of", "Essence of", "Treasures of", "Secrets of",
    "Icons of", "Soul of", "Magic of", "Spirit of",
  ];

  const itinerary = [];
  for (let d = 0; d < numDays; d++) {
    const dayPlaces = selectedPlaces.slice(d * activitiesPerDay, (d + 1) * activitiesPerDay);
    
    // Determine theme
    const tagCounts = {};
    dayPlaces.forEach(p => p.tags.forEach(t => {
      if (preferences.includes(t)) tagCounts[t] = (tagCounts[t] || 0) + 1;
    }));
    const topPref = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || preferences[0];
    const theme = PREF_INFO[topPref]?.theme || "Exploration";
    const title = `${dayTitles[d % dayTitles.length]} ${destination}`;

    const activities = dayPlaces.map((place, i) => ({
      time: timeSlots[i % timeSlots.length].time,
      icon: place.icon,
      title: place.name,
      place: place.name,
      description: place.desc,
      tip: place.tip,
      lat: place.lat,
      lng: place.lng,
    }));

    itinerary.push({
      day: d + 1,
      title,
      theme,
      activities,
    });
  }

  return itinerary;
}

// ── Build itinerary from real places database ──
function buildItineraryFromDB(cityKey, destination, preferences, numDays) {
  const cityData = PLACES_DB[cityKey];
  const allPlaces = cityData.places;

  // Score places by how many user preferences they match
  const scored = allPlaces.map(place => {
    const matchCount = place.tags.filter(t => preferences.includes(t)).length;
    return { ...place, score: matchCount };
  });

  // Sort: preference-matching places first, then others
  scored.sort((a, b) => b.score - a.score);

  // Pick places: aim for 4-5 per day
  const activitiesPerDay = 5;
  const totalNeeded = numDays * activitiesPerDay;
  
  // Take matching places first, then fill with others
  const matching = scored.filter(p => p.score > 0);
  const others = scored.filter(p => p.score === 0);
  let selectedPlaces = [...matching, ...others].slice(0, totalNeeded);

  // If we don't have enough, cycle through what we have
  while (selectedPlaces.length < totalNeeded) {
    selectedPlaces.push(selectedPlaces[selectedPlaces.length % allPlaces.length]);
  }

  // Time slots for activities
  const timeSlots = [
    { time: "8:30 AM", prefix: "Morning Start" },
    { time: "10:30 AM", prefix: "Mid-Morning" },
    { time: "1:00 PM", prefix: "Afternoon" },
    { time: "3:30 PM", prefix: "Late Afternoon" },
    { time: "7:00 PM", prefix: "Evening" },
  ];

  // Day title templates per preference
  const dayTitles = [
    "Discover the Heart of", "Hidden Gems of", "Icons of", "Local Favorites in",
    "The Best of", "Unforgettable", "Amazing", "Exploring", "Deep Dive into",
    "Wonders of", "The Soul of", "Classic", "Vibrant", "Timeless",
  ];

  const itinerary = [];
  for (let d = 0; d < numDays; d++) {
    const dayPlaces = selectedPlaces.slice(d * activitiesPerDay, (d + 1) * activitiesPerDay);
    
    // Pick theme based on most common preference in this day's places
    const tagCounts = {};
    dayPlaces.forEach(p => p.tags.forEach(t => {
      if (preferences.includes(t)) tagCounts[t] = (tagCounts[t] || 0) + 1;
    }));
    const topPref = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || preferences[0];
    const theme = PREF_INFO[topPref]?.theme || "Exploration";
    const title = `${dayTitles[d % dayTitles.length]} ${destination}`;

    const activities = dayPlaces.map((place, i) => ({
      time: timeSlots[i % timeSlots.length].time,
      icon: place.icon,
      title: place.name,
      place: `${place.name}, ${destination}`,
      description: place.desc,
      tip: place.tip,
      lat: place.lat,
      lng: place.lng,
    }));

    itinerary.push({
      day: d + 1,
      title,
      theme,
      activities,
    });
  }

  return itinerary;
}

// ── Enhance itinerary day/title descriptions with Bytez AI ──
async function enhanceWithAI(itinerary, destination, preferences) {
  try {
    const client = new Bytez(BYTEZ_API_KEY);
    const model = client.model("Qwen/Qwen2.5-3B-Instruct");
    const prefLabels = preferences.map(p => PREF_INFO[p]?.label || p).join(", ");
    
    // Generate better day titles using Bytez v3 API (no load() needed)
    const prompt = `You are a travel expert. Generate creative, catchy day titles for a ${itinerary.length}-day trip to ${destination} with preferences: ${prefLabels}.

For each day, I'll give you the places. Respond with ONLY a JSON array of objects with "title" and "theme" fields.

${itinerary.map((day, i) => `Day ${i + 1}: ${day.activities.map(a => a.title).join(", ")}`).join("\n")}

Return ONLY valid JSON array like: [{"title":"Catchy Title","theme":"Short Theme"}]`;

    const result = await model.run(prompt, { max_new_tokens: 500 });
    
    const output = result?.output;
    if (output) {
      const text = typeof output === "string" ? output : JSON.stringify(output);
      const jsonMatch = text.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        const titles = JSON.parse(jsonMatch[0]);
        titles.forEach((t, i) => {
          if (itinerary[i]) {
            if (t.title) itinerary[i].title = t.title;
            if (t.theme) itinerary[i].theme = t.theme;
          }
        });
      }
    }
  } catch (err) {
    console.log("AI title enhancement failed (non-critical):", err.message);
  }
  return itinerary;
}

// ── Full AI generation for unknown cities ──
async function generateWithBytezAI(destination, preferences, numDays) {
  const client = new Bytez(BYTEZ_API_KEY);
  const model = client.model("Qwen/Qwen2.5-3B-Instruct");
  const prefLabels = preferences.map(p => PREF_INFO[p]?.label || p).join(", ");

  const prompt = `You are a world-class travel planner. Create a ${numDays}-day itinerary for ${destination}.
Preferences: ${prefLabels}.

Return ONLY a valid JSON object (no extra text) in this format:
{
  "itinerary": [
    {
      "day": 1,
      "title": "Catchy Day Title",
      "theme": "Theme",
      "activities": [
        {
          "time": "9:00 AM",
          "icon": "emoji",
          "title": "Real Place Name",
          "place": "Real Place Name, ${destination}",
          "description": "2-3 sentence description",
          "tip": "Insider tip",
          "lat": 0.0,
          "lng": 0.0
        }
      ]
    }
  ]
}

CRITICAL: Use only REAL, FAMOUS places that actually exist in ${destination} with accurate GPS coordinates. Include 4-5 activities per day.`;

  const result = await model.run(prompt, { max_new_tokens: 4000 });
  
  if (result?.error) throw new Error(`Bytez AI error: ${result.error}`);
  
  const output = result?.output;
  if (!output) throw new Error("No response from Bytez AI");
  
  const text = typeof output === "string" ? output : JSON.stringify(output);
  const jsonMatch = text.match(/\{[\s\S]*"itinerary"[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI did not return valid itinerary JSON");
  
  const parsed = JSON.parse(jsonMatch[0]);
  if (!parsed.itinerary?.length) throw new Error("Empty itinerary from AI");
  
  return parsed.itinerary;
}

exports.createTrip = async (req, res) => {
  try {
    const { destination, preferences, days, itinerary } = req.body;
    if (!destination || !days || !itinerary) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const trip = await Trip.create({
      user: req.userId,
      destination,
      preferences: preferences || [],
      days,
      itinerary,
    });
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: "Error saving trip", error: err.message });
  }
};

exports.getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: "Error fetching trips", error: err.message });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: "Trip deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting trip", error: err.message });
  }
};
