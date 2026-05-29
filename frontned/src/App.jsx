import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import HotelDetail from "./pages/HotelDetail";
import MyBookings from "./pages/MyBookings";
import AddHotel from "./pages/AddHotel";
import TripPlanner from "./pages/TripPlanner";
import SellerDashboard from "./pages/SellerDashboard";
import PaymentDemo from "./pages/PaymentDemo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/hotel/:id" element={<HotelDetail />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/add-hotel" element={<AddHotel />} />
        <Route path="/trip-planner" element={<TripPlanner />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/payment-demo" element={<PaymentDemo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
