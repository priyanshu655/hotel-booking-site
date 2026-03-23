import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin, FiStar, FiArrowLeft, FiCalendar, FiUsers, FiCheck,
  FiWifi, FiCoffee, FiDroplet, FiWind, FiTv, FiShield,
  FiHeart, FiShare2, FiChevronLeft, FiChevronRight,
} from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const API = "http://localhost:8080/api";

const amenityIcons = {
  wifi:      { icon: FiWifi,    label: "WiFi" },
  pool:      { icon: FiDroplet, label: "Pool" },
  breakfast: { icon: FiCoffee,  label: "Breakfast" },
  ac:        { icon: FiWind,    label: "AC" },
  tv:        { icon: FiTv,      label: "TV" },
  security:  { icon: FiShield,  label: "Security" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function HotelDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const token    = localStorage.getItem("token");

  const [hotel, setHotel]                 = useState(null);
  const [loading, setLoading]             = useState(true);
  const [activeImg, setActiveImg]         = useState(0);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [saved, setSaved]                 = useState(false);
  const [scrolled, setScrolled]           = useState(false);

  const [bookingForm, setBookingForm] = useState({ checkIn: "", checkOut: "", guests: 1, rooms: 1, paymentMethod: "credit_card" });
  const paymentMethods = [
    { value: "credit_card", label: "Credit Card" },
    { value: "debit_card", label: "Debit Card" },
    { value: "upi", label: "UPI" },
    { value: "net_banking", label: "Net Banking" },
    { value: "wallet", label: "Wallet" },
  ];

  useEffect(() => {
    fetchHotel();
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, [id]);

  const fetchHotel = async () => {
    try {
      const res = await axios.get(`${API}/hotels/${id}`);
      setHotel(res.data);
    } catch {
      toast.error("Hotel not found");
      navigate("/");
    } finally { setLoading(false); }
  };

  const calculateNights = () => {
    if (!bookingForm.checkIn || !bookingForm.checkOut) return 0;
    const diff = new Date(bookingForm.checkOut) - new Date(bookingForm.checkIn);
    return Math.max(0, Math.ceil(diff / 86400000));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!token) { toast.error("Please sign in to book"); navigate("/auth"); return; }
    const nights = calculateNights();
    if (nights <= 0) { toast.error("Check-out must be after check-in"); return; }
    setBookingLoading(true);
    try {
      await axios.post(`${API}/bookings`, {
        hotelId: id,
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
        guests: bookingForm.guests,
        roomsNeeded: bookingForm.rooms,
        paymentMethod: bookingForm.paymentMethod,
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Booking confirmed!");
      setBookingForm({ checkIn: "", checkOut: "", guests: 1, rooms: 1, paymentMethod: "credit_card" });
      fetchHotel();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally { setBookingLoading(false); }
  };

  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #fff; margin: 0; }
        .load-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 16px; color: #717171; font-family: 'Plus Jakarta Sans', sans-serif; }
        .load-ring { width: 36px; height: 36px; border: 3px solid #EBEBEB; border-top-color: #FF385C; border-radius: 50%; animation: spin .7s linear infinite; }
        .load-txt { font-size: 14px; font-weight: 600; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div className="load-screen">
        <div className="load-ring" />
        <span className="load-txt">Loading hotel...</span>
      </div>
    </>
  );

  if (!hotel) return null;

  const nights    = calculateNights();
  const numRooms  = Number(bookingForm.rooms) || 1;
  const totalPrice = nights * (hotel.pricePerNight || 0) * numRooms;
  const images    = hotel.images?.length > 0
    ? hotel.images
    : [{ url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80" }];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --coral:        #FF385C;
          --coral-dark:   #D70466;
          --coral-soft:   #fff1f3;
          --coral-border: rgba(255,56,92,0.22);
          --bg:           #FFFFFF;
          --bg-soft:      #F7F7F7;
          --text:         #222222;
          --text-2:       #484848;
          --text-3:       #717171;
          --text-4:       #B0B0B0;
          --border:       #DDDDDD;
          --border-light: #EBEBEB;
          --shadow:       0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
          --shadow-lg:    0 8px 28px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06);
          --radius:       16px;
          --radius-sm:    10px;
          --font:         'Plus Jakarta Sans', sans-serif;
        }

        html { scroll-behavior: smooth; }
        body { font-family: var(--font); background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; }

        /* ── NAV ── */
        .nav {
          position: sticky; top: 0; z-index: 300;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(24px) saturate(1.8);
          -webkit-backdrop-filter: blur(24px) saturate(1.8);
          border-bottom: 1px solid transparent;
          transition: border-color .3s, box-shadow .3s;
        }
        .nav.scrolled { border-color: var(--border-light); box-shadow: 0 1px 0 var(--border-light), 0 4px 16px rgba(0,0,0,0.06); }
        .nav-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; height: 72px; gap: 16px;
        }
        .nav-left { display: flex; align-items: center; gap: 14px; }
        .nav-back {
          display: flex; align-items: center; gap: 7px;
          font-size: 13px; font-weight: 600; color: var(--text-3);
          background: none; border: 1px solid var(--border);
          border-radius: 24px; padding: 7px 14px; cursor: pointer;
          font-family: var(--font); transition: box-shadow .18s, color .18s;
        }
        .nav-back:hover { box-shadow: var(--shadow-lg); color: var(--text); }
        .nav-brand { display: flex; align-items: center; gap: 6px; text-decoration: none; }
        .nav-brand-mark {
          width: 32px; height: 32px; border-radius: 9px;
          background: var(--coral); color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 800;
        }
        .nav-brand-name { font-size: 17px; font-weight: 800; letter-spacing: -0.4px; color: var(--text); }
        .nav-actions { display: flex; align-items: center; gap: 8px; }
        .nav-action-btn {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: var(--text-2);
          background: none; border: 1px solid var(--border);
          border-radius: 24px; padding: 7px 14px; cursor: pointer;
          font-family: var(--font); transition: box-shadow .18s, color .18s;
        }
        .nav-action-btn:hover { box-shadow: var(--shadow-lg); color: var(--text); }
        .nav-action-btn.saved { color: var(--coral); border-color: var(--coral-border); background: var(--coral-soft); }

        /* ── PAGE ── */
        .page { max-width: 1200px; margin: 0 auto; padding: 32px 32px 96px; }

        /* ── HOTEL HEADER ── */
        .hotel-header { margin-bottom: 24px; }
        .hotel-header-top {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 16px; margin-bottom: 10px;
        }
        .hotel-title {
          font-size: clamp(24px, 3vw, 34px); font-weight: 800;
          letter-spacing: -0.8px; color: var(--text); line-height: 1.15;
        }
        .hotel-meta-row {
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
        }
        .hm-rating {
          display: flex; align-items: center; gap: 4px;
          font-size: 14px; font-weight: 700; color: var(--text);
        }
        .hm-rating svg { color: var(--coral); }
        .hm-dot { color: var(--text-4); }
        .hm-loc {
          display: flex; align-items: center; gap: 4px;
          font-size: 14px; color: var(--text-3); font-weight: 500;
          text-decoration: underline; text-underline-offset: 2px; cursor: pointer;
        }
        .hm-badge {
          font-size: 12px; font-weight: 700;
          padding: 3px 10px; border-radius: 20px;
          text-transform: capitalize;
        }
        .hm-badge-cat { background: var(--bg-soft); color: var(--text-2); border: 1px solid var(--border-light); }
        .hm-badge-feat { background: var(--coral-soft); color: var(--coral); border: 1px solid var(--coral-border); }

        /* ── GALLERY ── */
        .gallery {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 280px 280px;
          gap: 8px; border-radius: var(--radius);
          overflow: hidden; margin-bottom: 40px;
          position: relative;
        }
        .gallery-main {
          grid-row: span 2; position: relative; overflow: hidden;
          background: var(--bg-soft);
        }
        .gallery-main img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform .5s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .gallery-main:hover img { transform: scale(1.03); }
        .gallery-side {
          position: relative; overflow: hidden; background: var(--bg-soft); cursor: pointer;
        }
        .gallery-side img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform .5s cubic-bezier(0.25,0.46,0.45,0.94);
          opacity: 0.92;
        }
        .gallery-side:hover img { transform: scale(1.04); opacity: 1; }
        .gallery-side.dim img { opacity: 0.7; }
        .gallery-more {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.45); backdrop-filter: blur(2px);
          font-size: 15px; font-weight: 800; color: white; pointer-events: none;
        }

        /* Gallery nav arrows (mobile) */
        .gallery-nav {
          position: absolute; bottom: 16px; right: 16px; z-index: 2;
          display: flex; gap: 8px;
        }
        .gnav-btn {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.9); backdrop-filter: blur(8px);
          border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: var(--text); transition: background .18s;
        }
        .gnav-btn:hover { background: white; }

        /* ── BODY GRID ── */
        .body-grid {
          display: grid; grid-template-columns: 1fr 380px; gap: 64px; align-items: start;
        }

        /* ── INFO ── */
        .info {}

        .info-section { padding: 28px 0; border-bottom: 1px solid var(--border-light); }
        .info-section:first-child { padding-top: 0; }
        .info-section:last-child { border-bottom: none; }

        .info-section-title {
          font-size: 18px; font-weight: 800; color: var(--text);
          letter-spacing: -0.3px; margin-bottom: 14px;
        }
        .info-section-body {
          font-size: 15px; color: var(--text-2); line-height: 1.7; font-weight: 400;
        }

        /* Stats row */
        .stats-row { display: flex; gap: 24px; flex-wrap: wrap; margin-top: 4px; }
        .stat-item { display: flex; flex-direction: column; gap: 4px; }
        .stat-num { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
        .stat-lbl { font-size: 12px; color: var(--text-3); font-weight: 500; }

        /* Availability */
        .avail-bar {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 18px;
          border-radius: var(--radius-sm); margin-top: 16px;
          font-size: 14px; font-weight: 600;
        }
        .avail-bar.ok { background: #e8f5e9; color: #2e7d32; }
        .avail-bar.low { background: #fff3e0; color: #bf360c; }
        .avail-bar.sold { background: #fce4e4; color: var(--coral-dark); }
        .avail-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

        /* Amenities */
        .amenities-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px;
        }
        .amenity-chip {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 16px;
          background: var(--bg-soft); border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          font-size: 13px; font-weight: 600; color: var(--text-2);
        }
        .amenity-chip svg { color: var(--text-3); flex-shrink: 0; }

        /* ── BOOKING CARD ── */
        .booking-card {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 28px;
          box-shadow: var(--shadow-lg);
          position: sticky; top: 90px;
        }

        .bc-price-row {
          display: flex; align-items: baseline; gap: 6px; margin-bottom: 24px;
        }
        .bc-price {
          font-size: 26px; font-weight: 800; letter-spacing: -0.6px; color: var(--text);
        }
        .bc-per { font-size: 15px; color: var(--text-3); font-weight: 400; }

        /* Date inputs grid */
        .bc-dates {
          border: 1.5px solid var(--border); border-radius: var(--radius-sm);
          overflow: hidden; margin-bottom: 10px;
        }
        .bc-dates-row { display: grid; grid-template-columns: 1fr 1fr; }
        .bc-dates-row + .bc-dates-row { border-top: 1.5px solid var(--border); }
        .bc-date-field {
          display: flex; flex-direction: column; gap: 3px;
          padding: 12px 14px; position: relative;
        }
        .bc-date-field:first-child { border-right: 1.5px solid var(--border); }
        .bc-date-field:focus-within { background: var(--bg-soft); }
        .bc-date-lbl {
          font-size: 10px; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.5px; color: var(--text);
        }
        .bc-date-input {
          border: none; outline: none; background: none;
          font-family: var(--font); font-size: 13px; color: var(--text-2);
          font-weight: 500; cursor: pointer; width: 100%;
        }
        .bc-date-input::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.6; }

        .bc-guests-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
        .bc-guests-field {
          display: flex; flex-direction: column; gap: 6px;
        }
        .bc-guests-lbl {
          font-size: 11px; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.4px; color: var(--text-2);
          display: flex; align-items: center; gap: 5px;
        }
        .bc-guests-input {
          padding: 10px 14px; background: var(--bg-soft);
          border: 1.5px solid var(--border-light); border-radius: var(--radius-sm);
          font-family: var(--font); font-size: 14px; color: var(--text); outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .bc-guests-input:focus { border-color: var(--coral); box-shadow: 0 0 0 3px rgba(255,56,92,0.1); }

        /* Payment Method */
        .bc-payment-row { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .bc-payment-lbl {
          font-size: 11px; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.4px; color: var(--text-2);
        }
        .bc-payment-select {
          padding: 10px 14px; background: var(--bg-soft);
          border: 1.5px solid var(--border-light); border-radius: var(--radius-sm);
          font-family: var(--font); font-size: 14px; color: var(--text); outline: none;
          cursor: pointer; transition: border-color .2s, box-shadow .2s;
        }
        .bc-payment-select:focus { border-color: var(--coral); box-shadow: 0 0 0 3px rgba(255,56,92,0.1); }
        .bc-payment-select option { background: var(--bg); color: var(--text); padding: 8px; }

        /* Price summary */
        .bc-summary {
          padding: 16px 0; border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
          display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;
        }
        .bc-sum-row {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 14px; color: var(--text-2);
        }
        .bc-sum-row span:last-child { font-weight: 600; }
        .bc-sum-row.total {
          font-size: 16px; font-weight: 800; color: var(--text);
          padding-top: 10px; border-top: 1px solid var(--border-light);
        }

        /* Book button */
        .book-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #FF385C, #D70466);
          color: white; border: none; border-radius: var(--radius-sm);
          font-family: var(--font); font-size: 16px; font-weight: 800;
          cursor: pointer; letter-spacing: -0.2px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 16px rgba(255,56,92,0.3);
          transition: filter .2s, box-shadow .2s, transform .15s;
        }
        .book-btn:hover:not(:disabled) { filter: brightness(1.07); box-shadow: 0 6px 24px rgba(255,56,92,0.4); }
        .book-btn:active:not(:disabled) { transform: scale(0.99); }
        .book-btn:disabled { background: var(--bg-soft); color: var(--text-4); box-shadow: none; cursor: not-allowed; }
        .book-btn.soldout { background: var(--bg-soft); color: var(--text-4); box-shadow: none; }

        .bc-note { font-size: 12px; color: var(--text-4); text-align: center; margin-top: 12px; }

        /* Spinner */
        .spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: white; border-radius: 50%;
          animation: spin .65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── MAP ── */
        .map-wrapper {
          width: 100%; height: 340px;
          border-radius: var(--radius-sm); overflow: hidden;
          border: 1px solid var(--border-light);
          position: relative;
        }
        .map-wrapper iframe {
          width: 100%; height: 100%; border: none; display: block;
        }
        .map-open-link {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 12px; font-size: 13px; font-weight: 600;
          color: var(--coral); text-decoration: none;
        }
        .map-open-link:hover { text-decoration: underline; }

        @media (max-width: 900px) {
          .body-grid { grid-template-columns: 1fr; gap: 0; }
          .booking-card { position: static; margin-top: 32px; }
          .gallery { grid-template-columns: 1fr; grid-template-rows: 280px; }
          .gallery-main { grid-row: span 1; }
          .gallery-side { display: none; }
          .nav-inner { padding: 0 16px; }
          .page { padding: 24px 16px 72px; }
          .map-wrapper { height: 260px; }
        }
      `}</style>

      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", minHeight: "100vh", background: "#fff" }}>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "13px", fontWeight: 600,
              borderRadius: "12px", border: "1px solid #EBEBEB",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            },
          }}
        />

        {/* ── NAV ── */}
        <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
          <div className="nav-inner">
            <div className="nav-left">
              <button className="nav-back" onClick={() => navigate(-1)}>
                <FiArrowLeft size={13} /> Back
              </button>
              <Link to="/" className="nav-brand">
                <div className="nav-brand-mark">P</div>
                <span className="nav-brand-name">planora</span>
              </Link>
            </div>
            <div className="nav-actions">
              <button className="nav-action-btn" onClick={() => { navigator.share?.({ title: hotel.name, url: window.location.href }); }}>
                <FiShare2 size={13} /> Share
              </button>
              <button
                className={`nav-action-btn ${saved ? "saved" : ""}`}
                onClick={() => setSaved(v => !v)}
              >
                <FiHeart size={13} /> {saved ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </nav>

        <div className="page">

          {/* ── HOTEL HEADER ── */}
          <motion.div
            className="hotel-header"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="hotel-header-top">
              <h1 className="hotel-title">{hotel.name}</h1>
            </div>
            <div className="hotel-meta-row">
              <div className="hm-rating">
                <FiStar size={14} />
                {hotel.rating?.toFixed(1) || "New"}
              </div>
              <span className="hm-dot">·</span>
              <span className="hm-loc"><FiMapPin size={12} /> {hotel.location}</span>
              <span className="hm-dot">·</span>
              <span className="hm-badge hm-badge-cat">{hotel.category}</span>
              {hotel.featured && <span className="hm-badge hm-badge-feat">Guest favourite</span>}
            </div>
          </motion.div>

          {/* ── GALLERY ── */}
          <motion.div
            className="gallery"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {/* Main image */}
            <div className="gallery-main">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={images[activeImg]?.url}
                  alt={hotel.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>
            </div>

            {/* Side images */}
            {images.slice(1, 5).map((img, i) => (
              <div
                key={i}
                className={`gallery-side ${i >= 3 ? "dim" : ""}`}
                onClick={() => setActiveImg(i + 1)}
              >
                <img src={img.url} alt="" />
                {i === 3 && images.length > 5 && (
                  <div className="gallery-more">+{images.length - 4} photos</div>
                )}
              </div>
            ))}

            {/* Navigation */}
            {images.length > 1 && (
              <div className="gallery-nav">
                <button className="gnav-btn" onClick={() => setActiveImg(i => Math.max(0, i - 1))}>
                  <FiChevronLeft size={14} />
                </button>
                <button className="gnav-btn" onClick={() => setActiveImg(i => Math.min(images.length - 1, i + 1))}>
                  <FiChevronRight size={14} />
                </button>
              </div>
            )}
          </motion.div>

          {/* ── BODY ── */}
          <div className="body-grid">

            {/* LEFT — info */}
            <motion.div
              className="info"
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
              initial="hidden"
              animate="show"
            >
              {/* Stats */}
              <motion.div className="info-section" variants={fadeUp}>
                <div className="stats-row">
                  <div className="stat-item">
                    <span className="stat-num">{hotel.rooms}</span>
                    <span className="stat-lbl">Total rooms</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-num">{hotel.availableRooms ?? hotel.rooms}</span>
                    <span className="stat-lbl">Available</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-num">{hotel.rating?.toFixed(1) || "—"}</span>
                    <span className="stat-lbl">Rating</span>
                  </div>
                </div>

                {(() => {
                  const r = hotel.availableRooms ?? hotel.rooms;
                  if (r === 0) return <div className="avail-bar sold"><span className="avail-dot" /> Fully booked — no rooms available</div>;
                  if (r <= 3)  return <div className="avail-bar low"><span className="avail-dot" /> Only {r} room{r > 1 ? "s" : ""} left</div>;
                  return <div className="avail-bar ok"><span className="avail-dot" /> {r} rooms available</div>;
                })()}
              </motion.div>

              {/* About */}
              <motion.div className="info-section" variants={fadeUp}>
                <h2 className="info-section-title">About this property</h2>
                <p className="info-section-body">{hotel.description}</p>
              </motion.div>

              {/* Amenities */}
              {hotel.amenities?.length > 0 && (
                <motion.div className="info-section" variants={fadeUp}>
                  <h2 className="info-section-title">What this place offers</h2>
                  <div className="amenities-grid">
                    {hotel.amenities.map(am => {
                      const entry = amenityIcons[am.toLowerCase()];
                      const Icon  = entry?.icon || FiCheck;
                      return (
                        <div className="amenity-chip" key={am}>
                          <Icon size={16} /> {am}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Location Map */}
              <motion.div className="info-section" variants={fadeUp}>
                <h2 className="info-section-title">Where you'll be</h2>
                <p className="info-section-body" style={{ marginBottom: "14px" }}>
                  <FiMapPin size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />
                  {hotel.location}
                </p>
                <div className="map-wrapper">
                  <iframe
                    title="Hotel location map"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(hotel.location)}&output=embed&z=14`}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  className="map-open-link"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiMapPin size={13} /> View on Google Maps
                </a>
              </motion.div>

            </motion.div>

            {/* RIGHT — booking card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="booking-card">
                <div className="bc-price-row">
                  <span className="bc-price">₹{hotel.pricePerNight?.toLocaleString()}</span>
                  <span className="bc-per">/ night</span>
                </div>

                <form onSubmit={handleBooking}>
                  {/* Dates */}
                  <div className="bc-dates">
                    <div className="bc-dates-row">
                      <div className="bc-date-field">
                        <span className="bc-date-lbl">Check-in</span>
                        <input
                          className="bc-date-input"
                          type="date"
                          value={bookingForm.checkIn}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={e => setBookingForm({ ...bookingForm, checkIn: e.target.value })}
                          required
                        />
                      </div>
                      <div className="bc-date-field">
                        <span className="bc-date-lbl">Check-out</span>
                        <input
                          className="bc-date-input"
                          type="date"
                          value={bookingForm.checkOut}
                          min={bookingForm.checkIn || new Date().toISOString().split("T")[0]}
                          onChange={e => setBookingForm({ ...bookingForm, checkOut: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guests + Rooms */}
                  <div className="bc-guests-row">
                    <div className="bc-guests-field">
                      <label className="bc-guests-lbl"><FiUsers size={11} /> Guests</label>
                      <input
                        className="bc-guests-input"
                        type="number" min="1" max="10"
                        value={bookingForm.guests}
                        onChange={e => setBookingForm({ ...bookingForm, guests: e.target.value })}
                        required
                      />
                    </div>
                    <div className="bc-guests-field">
                      <label className="bc-guests-lbl"><FiCalendar size={11} /> Rooms</label>
                      <input
                        className="bc-guests-input"
                        type="number" min="1" max={hotel.availableRooms || 1}
                        value={bookingForm.rooms}
                        onChange={e => setBookingForm({ ...bookingForm, rooms: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bc-payment-row">
                    <label className="bc-payment-lbl">Payment Method</label>
                    <select
                      className="bc-payment-select"
                      value={bookingForm.paymentMethod}
                      onChange={e => setBookingForm({ ...bookingForm, paymentMethod: e.target.value })}
                      required
                    >
                      {paymentMethods.map(method => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price summary */}
                  <AnimatePresence>
                    {nights > 0 && (
                      <motion.div
                        className="bc-summary"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="bc-sum-row">
                          <span>₹{hotel.pricePerNight?.toLocaleString()} × {nights} night{nights > 1 ? "s" : ""}</span>
                          <span>₹{(nights * hotel.pricePerNight).toLocaleString()}</span>
                        </div>
                        {numRooms > 1 && (
                          <div className="bc-sum-row">
                            <span>× {numRooms} rooms</span>
                            <span>₹{totalPrice.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="bc-sum-row total">
                          <span>Total</span>
                          <span>₹{totalPrice.toLocaleString()}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    className={`book-btn ${hotel.availableRooms === 0 ? "soldout" : ""}`}
                    disabled={bookingLoading || hotel.availableRooms === 0}
                    whileHover={{ scale: (bookingLoading || hotel.availableRooms === 0) ? 1 : 1.01 }}
                    whileTap={{ scale: (bookingLoading || hotel.availableRooms === 0) ? 1 : 0.985 }}
                  >
                    {bookingLoading
                      ? <span className="spinner" />
                      : hotel.availableRooms === 0
                        ? "Fully Booked"
                        : "Reserve"
                    }
                  </motion.button>
                </form>

                <p className="bc-note">You won't be charged yet</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
}