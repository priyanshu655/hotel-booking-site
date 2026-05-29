const API =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8080/api" : "https://hotel-booking-site-gle5.onrender.com/api");

if (!API) {
  console.error("❌ API URL not found. Check environment variables.");
}

export { API };