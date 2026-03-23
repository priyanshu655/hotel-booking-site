// Get API URL from environment or default to localhost
const API = process.env.REACT_APP_API_URL || process.env.VITE_API_URL || "http://localhost:8080/api";

export { API };
