import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin, FiCalendar, FiUsers, FiArrowLeft,
  FiX, FiPackage, FiClock, FiCheckCircle, FiArrowRight,
} from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const API = "https://hotel-booking-site-gle5.onrender.com/api";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const STATUS = {
  confirmed: { label: "Confirmed", bg: "#e8f5e9", color: "#2e7d32", Icon: FiCheckCircle },
  cancelled: { label: "Cancelled", bg: "#fce4e4", color: "#c0392b", Icon: FiX },
  pending:   { label: "Pending",   bg: "#fff3e0", color: "#bf360c", Icon: FiClock },
};

const tabs = [
  { key: "all",       label: "All trips" },
  { key: "confirmed", label: "Confirmed" },
  { key: "pending",   label: "Pending" },
  { key: "cancelled", label: "Cancelled" },
];

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/auth"); return; }
    fetchBookings();
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API}/bookings/my`, { headers: { Authorization: `Bearer ${token}` } });
      setBookings(res.data);
    } catch { toast.error("Failed to load bookings"); }
    finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await axios.patch(`${API}/bookings/${id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Booking cancelled");
      fetchBookings();
    } catch { toast.error("Failed to cancel booking"); }
  };

  const formatDate = d => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const getNights = b => {
    const diff = new Date(b.checkOut) - new Date(b.checkIn);
    return Math.max(1, Math.ceil(diff / 86400000));
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --coral: #FF385C; --coral-dark: #D70466;
          --coral-soft: #fff1f3; --coral-border: rgba(255,56,92,0.22);
          --bg: #FFFFFF; --bg-soft: #F7F7F7;
          --text: #222222; --text-2: #484848; --text-3: #717171; --text-4: #B0B0B0;
          --border: #DDDDDD; --border-light: #EBEBEB;
          --shadow: 0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
          --shadow-lg: 0 8px 28px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06);
          --radius: 16px; --radius-sm: 10px;
          --font: 'Plus Jakarta Sans', sans-serif;
        }
        html { scroll-behavior: smooth; }
        body { font-family: var(--font); background: var(--bg-soft); color: var(--text); -webkit-font-smoothing: antialiased; }

        /* NAV */
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
          max-width: 860px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; height: 72px;
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
        .nav-brand { display: flex; align-items: center; gap: 7px; text-decoration: none; }
        .nav-brand-mark {
          width: 32px; height: 32px; border-radius: 9px;
          background: var(--coral); color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 800;
        }
        .nav-brand-name { font-size: 17px; font-weight: 800; letter-spacing: -0.4px; color: var(--text); }

        /* PAGE */
        .page { max-width: 860px; margin: 0 auto; padding: 44px 32px 96px; }

        /* HERO */
        .page-hero {
          background: linear-gradient(135deg, #fff5f6 0%, #ffffff 60%);
          border: 1px solid var(--border-light); border-radius: var(--radius);
          padding: 32px 32px 28px; margin-bottom: 28px;
          position: relative; overflow: hidden;
        }
        .page-hero::after {
          content: ''; position: absolute; top: -50px; right: -50px;
          width: 180px; height: 180px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,56,92,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .page-hero-tag {
          display: inline-flex; align-items: center; gap: 5px;
          background: var(--coral-soft); border: 1px solid var(--coral-border);
          color: var(--coral); font-size: 11px; font-weight: 700;
          letter-spacing: 0.5px; text-transform: uppercase;
          padding: 4px 12px; border-radius: 40px; margin-bottom: 14px;
        }
        .page-hero h1 {
          font-size: 28px; font-weight: 800; letter-spacing: -0.8px;
          color: var(--text); margin-bottom: 5px; line-height: 1.15;
        }
        .page-hero p { font-size: 14px; color: var(--text-3); }
        .hero-stats { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }
        .hero-stat {
          display: flex; align-items: center; gap: 10px;
          background: var(--bg); border: 1px solid var(--border-light);
          border-radius: 12px; padding: 12px 16px;
          font-size: 12px; font-weight: 700; color: var(--text-2);
          flex-shrink: 0; transition: box-shadow .2s, transform .2s;
        }
        .hero-stat:hover { box-shadow: var(--shadow); transform: translateY(-2px); }
        .stat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

        /* FILTER TABS */
        .filter-tabs {
          display: flex; border-bottom: 1px solid var(--border-light);
          margin-bottom: 24px; overflow-x: auto; scrollbar-width: none;
        }
        .filter-tabs::-webkit-scrollbar { display: none; }
        .ftab {
          display: flex; align-items: center; gap: 7px;
          padding: 12px 20px; font-size: 13px; font-weight: 700;
          border: none; background: none; cursor: pointer;
          border-bottom: 2.5px solid transparent;
          color: var(--text-3); white-space: nowrap;
          font-family: var(--font); transition: color .18s, border-color .18s;
        }
        .ftab:hover { color: var(--text); }
        .ftab.active { color: var(--text); border-bottom-color: var(--text); }
        .ftab-count {
          background: var(--bg-soft); color: var(--text-4);
          font-size: 11px; padding: 2px 8px; border-radius: 20px;
        }
        .ftab.active .ftab-count { background: var(--coral-soft); color: var(--coral); }

        /* SKELETON */
        .sk-list { display: flex; flex-direction: column; gap: 16px; }
        .sk-card {
          background: var(--bg); border: 1px solid var(--border-light);
          border-radius: var(--radius); overflow: hidden;
          display: grid; grid-template-columns: 160px 1fr; height: 140px;
        }
        .sk-img {
          background: linear-gradient(90deg, #efefef 25%, #f9f9f9 50%, #efefef 75%);
          background-size: 200%; animation: sk 1.5s infinite;
        }
        .sk-body { padding: 20px; display: flex; flex-direction: column; gap: 10px; justify-content: center; }
        .sk-line {
          height: 13px; border-radius: 6px;
          background: linear-gradient(90deg, #efefef 25%, #f9f9f9 50%, #efefef 75%);
          background-size: 200%; animation: sk 1.5s infinite;
        }
        @keyframes sk { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* EMPTY */
        .empty-wrap {
          background: var(--bg); border: 1px solid var(--border-light);
          border-radius: var(--radius); padding: 80px 32px; text-align: center;
        }
        .empty-icon {
          width: 60px; height: 60px; border-radius: 18px;
          background: var(--bg-soft); border: 1px solid var(--border-light);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px; color: var(--text-4);
        }
        .empty-wrap h3 { font-size: 18px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
        .empty-wrap p { font-size: 14px; color: var(--text-3); margin-bottom: 24px; line-height: 1.6; }
        .explore-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #FF385C, #D70466);
          color: white; text-decoration: none;
          font-size: 14px; font-weight: 800;
          padding: 12px 24px; border-radius: var(--radius-sm);
          box-shadow: 0 4px 16px rgba(255,56,92,0.3);
          transition: filter .2s, box-shadow .2s;
        }
        .explore-btn:hover { filter: brightness(1.07); box-shadow: 0 6px 24px rgba(255,56,92,0.4); }

        /* BOOKING CARD */
        .booking-list { display: flex; flex-direction: column; gap: 16px; }
        .bcard {
          background: var(--bg); border: 1px solid var(--border-light);
          border-radius: var(--radius); overflow: hidden;
          display: grid; grid-template-columns: 180px 1fr;
          box-shadow: var(--shadow); transition: box-shadow .2s;
        }
        .bcard:hover { box-shadow: var(--shadow-lg); }
        .bcard.cancelled { opacity: 0.68; }

        .bcard-img { position: relative; overflow: hidden; min-height: 160px; }
        .bcard-img img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform .55s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .bcard:hover .bcard-img img { transform: scale(1.05); }
        .nights-badge {
          position: absolute; bottom: 10px; left: 10px;
          background: rgba(0,0,0,0.55); backdrop-filter: blur(8px);
          color: white; font-size: 11px; font-weight: 700;
          padding: 3px 9px; border-radius: 20px; letter-spacing: 0.2px;
        }

        .bcard-body {
          padding: 20px 24px;
          display: flex; flex-direction: column;
        }
        .bcard-top {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 12px; margin-bottom: 5px;
        }
        .bcard-name {
          font-size: 16px; font-weight: 800; color: var(--text);
          letter-spacing: -0.3px; line-height: 1.25; text-decoration: none;
          transition: color .15s;
        }
        .bcard-name:hover { color: var(--coral); }
        .status-pill {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 700; padding: 4px 10px;
          border-radius: 20px; flex-shrink: 0;
        }
        .bcard-loc {
          display: flex; align-items: center; gap: 4px;
          font-size: 13px; color: var(--text-3); margin-bottom: 14px;
        }
        .bcard-meta {
          display: flex; align-items: center; gap: 14px;
          flex-wrap: wrap; margin-bottom: 16px;
        }
        .meta-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 13px; color: var(--text-2); font-weight: 500;
        }
        .meta-item svg { color: var(--text-4); }
        .meta-sep { color: var(--text-4); font-size: 12px; }

        .bcard-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 14px; border-top: 1px solid var(--border-light);
          margin-top: auto;
        }
        .bcard-price-amount { font-size: 18px; font-weight: 800; color: var(--text); letter-spacing: -0.4px; }
        .bcard-price-label  { font-size: 11px; color: var(--text-4); margin-top: 1px; }
        .bcard-actions { display: flex; align-items: center; gap: 8px; }

        .view-btn {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 700; color: var(--text-2);
          text-decoration: none; padding: 7px 14px;
          border: 1px solid var(--border); border-radius: 24px;
          transition: box-shadow .18s, color .18s;
        }
        .view-btn:hover { box-shadow: var(--shadow-lg); color: var(--text); }

        .cancel-btn {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 700;
          color: var(--coral); background: var(--coral-soft);
          border: 1px solid var(--coral-border); border-radius: 24px;
          padding: 7px 14px; cursor: pointer; font-family: var(--font);
          transition: background .18s, box-shadow .18s;
        }
        .cancel-btn:hover { background: #ffe0e5; box-shadow: 0 2px 10px rgba(255,56,92,0.15); }

        @keyframes spin { to { transform: rotate(360deg); } }
        .load-ring {
          width: 36px; height: 36px;
          border: 3px solid var(--border-light); border-top-color: var(--coral);
          border-radius: 50%; animation: spin .7s linear infinite;
          margin: 80px auto; display: block;
        }

        @media (max-width: 680px) {
          .nav-inner { padding: 0 16px; }
          .page { padding: 28px 16px 72px; }
          .page-hero { padding: 24px 20px 20px; }
          .bcard { grid-template-columns: 100px 1fr; }
          .bcard-body { padding: 14px 16px; }
          .bcard-name { font-size: 14px; }
          .bcard-meta { gap: 8px; }
        }
      `}</style>

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

      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", minHeight: "100vh", background: "#F7F7F7" }}>

        {/* ── NAV ── */}
        <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
          <div className="nav-inner">
            <div className="nav-left">
              <button className="nav-back" onClick={() => navigate("/")}>
                <FiArrowLeft size={13} /> Back
              </button>
            </div>
            <Link to="/" className="nav-brand">
              <div className="nav-brand-mark">P</div>
              <span className="nav-brand-name">planora</span>
            </Link>
          </div>
        </nav>

        <div className="page">

          {/* ── HERO ── */}
          <motion.div
            className="page-hero"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="page-hero-tag"><FiCalendar size={10} /> Your Trips</div>
            <h1>My Bookings</h1>
            <p>Track and manage all your hotel reservations in one place</p>
          </motion.div>

          {/* ── FILTER TABS ── */}
          {!loading && bookings.length > 0 && (
            <div className="filter-tabs">
              {tabs.map(tab => {
                const count = tab.key === "all"
                  ? bookings.length
                  : bookings.filter(b => b.status === tab.key).length;
                return (
                  <button
                    key={tab.key}
                    className={`ftab ${filter === tab.key ? "active" : ""}`}
                    onClick={() => setFilter(tab.key)}
                  >
                    {tab.label}
                    <span className="ftab-count">{count}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── CONTENT ── */}
          {loading ? (
            <div className="sk-list">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="sk-card">
                  <div className="sk-img" style={{ animationDelay: `${i * 0.1}s` }} />
                  <div className="sk-body">
                    <div className="sk-line" style={{ width: "55%" }} />
                    <div className="sk-line" style={{ width: "35%" }} />
                    <div className="sk-line" style={{ width: "70%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <motion.div className="empty-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="empty-icon"><FiPackage size={24} /></div>
              <h3>No trips yet</h3>
              <p>You haven't booked any stays yet.<br />Start exploring to find your perfect getaway.</p>
              <Link to="/" className="explore-btn">
                Explore Hotels <FiArrowRight size={14} />
              </Link>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={filter}
                className="booking-list"
                variants={stagger}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                {filtered.length === 0 ? (
                  <motion.div className="empty-wrap" variants={fadeUp}>
                    <div className="empty-icon"><FiPackage size={24} /></div>
                    <h3>No {STATUS[filter]?.label.toLowerCase()} trips</h3>
                    <p>You don't have any {filter} bookings right now.</p>
                  </motion.div>
                ) : filtered.map(b => {
                  const st = STATUS[b.status] || STATUS.pending;
                  const n  = getNights(b);
                  return (
                    <motion.div key={b._id} className={`bcard ${b.status}`} variants={fadeUp}>
                      <div className="bcard-img">
                        <img
                          src={b.hotel?.images?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=70"}
                          alt={b.hotel?.name}
                          loading="lazy"
                        />
                        <div className="nights-badge">{n} night{n > 1 ? "s" : ""}</div>
                      </div>

                      <div className="bcard-body">
                        <div className="bcard-top">
                          <Link to={`/hotel/${b.hotel?._id}`} className="bcard-name">
                            {b.hotel?.name || "Hotel"}
                          </Link>
                          <div
                            className="status-pill"
                            style={{ background: st.bg, color: st.color }}
                          >
                            <st.Icon size={11} /> {st.label}
                          </div>
                        </div>

                        <p className="bcard-loc"><FiMapPin size={11} /> {b.hotel?.location}</p>

                        <div className="bcard-meta">
                          <div className="meta-item"><FiCalendar size={12} /> {formatDate(b.checkIn)}</div>
                          <span className="meta-sep">→</span>
                          <div className="meta-item">{formatDate(b.checkOut)}</div>
                          <span className="meta-sep">·</span>
                          <div className="meta-item"><FiUsers size={12} /> {b.guests} guest{b.guests > 1 ? "s" : ""}</div>
                          <span className="meta-sep">·</span>
                          <div className="meta-item" style={{ textTransform: "capitalize" }}>{b.paymentMethod?.replace("_", " ") || "Not specified"}</div>
                        </div>

                        <div className="bcard-footer">
                          <div>
                            <div className="bcard-price-amount">₹{b.totalPrice?.toLocaleString()}</div>
                            <div className="bcard-price-label">total · {n} night{n > 1 ? "s" : ""}</div>
                          </div>
                          <div className="bcard-actions">
                            <Link to={`/hotel/${b.hotel?._id}`} className="view-btn">
                              View <FiArrowRight size={12} />
                            </Link>
                            {b.status === "confirmed" && (
                              <button className="cancel-btn" onClick={() => handleCancel(b._id)}>
                                <FiX size={12} /> Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </>
  );
}