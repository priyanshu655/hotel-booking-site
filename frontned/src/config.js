const API = import.meta.env.VITE_API_URL;

if (!API) {
  console.error("❌ API URL not found. Check environment variables.");
}

export { API };