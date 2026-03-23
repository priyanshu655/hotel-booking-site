import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin, FiDollarSign, FiStar, FiHome,
  FiArrowLeft, FiPlus, FiTrash2, FiCheck,
  FiGrid, FiToggleLeft, FiToggleRight, FiUpload, FiX, FiPackage,
} from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const API = "https://hotel-booking-site-gle5.onrender.com/api";

const categoryOptions = ["luxury", "budget", "boutique", "resort", "business"];
const amenityOptions = [
  "WiFi", "Pool", "Breakfast", "AC", "TV", "Security",
  "Parking", "Gym", "Spa", "Restaurant", "Bar", "Laundry",
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function AddHotel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [myHotels, setMyHotels] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState({
    name: "", location: "", description: "",
    pricePerNight: "", rating: "", rooms: "",
    category: "budget", featured: false,
  });
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (!token) { navigate("/auth"); return; }
    fetchUser();
    fetchMyHotels();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.role !== "admin" && res.data.role !== "seller") {
        toast.error("Only hosts can list hotels. Sign up as Hotel Host.");
        navigate("/");
        return;
      }
    } catch { navigate("/auth"); }
  };

  const fetchMyHotels = async () => {
    try {
      const res = await axios.get(`${API}/hotels/my`, { headers: { Authorization: `Bearer ${token}` } });
      setMyHotels(res.data);
    } catch { }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const toggleAmenity = (am) => {
    setSelectedAmenities(prev =>
      prev.includes(am) ? prev.filter(a => a !== am) : [...prev, am]
    );
  };

  const processFiles = (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith("image/")).slice(0, 5);
    setImages(valid);
    setPreviews(valid.map(f => URL.createObjectURL(f)));
  };

  const handleImageChange = (e) => processFiles(e.target.files);
  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const removePreview = (i) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.location || !form.description || !form.pricePerNight || !form.rooms) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.set("rating", form.rating || "0");
      fd.append("amenities", JSON.stringify(selectedAmenities));
      images.forEach(img => fd.append("images", img));
      await axios.post(`${API}/hotels`, fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      toast.success("Hotel listed successfully!");
      setForm({ name: "", location: "", description: "", pricePerNight: "", rating: "", rooms: "", category: "budget", featured: false });
      setSelectedAmenities([]); setImages([]); setPreviews([]);
      fetchMyHotels();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to list hotel");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this hotel listing?")) return;
    try {
      await axios.delete(`${API}/hotels/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Hotel removed");
      fetchMyHotels();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

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
          --shadow-sm:    0 1px 2px rgba(0,0,0,0.08);
          --shadow:       0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
          --shadow-lg:    0 8px 28px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06);
          --radius:       16px;
          --radius-sm:    10px;
          --radius-xs:    8px;
          --font:         'Plus Jakarta Sans', sans-serif;
        }

        html { scroll-behavior: smooth; }
        body { font-family: var(--font); background: var(--bg-soft); color: var(--text); -webkit-font-smoothing: antialiased; }

        /* ══ NAV ══ */
        .nav {
          position: sticky; top: 0; z-index: 300;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(24px) saturate(1.8);
          -webkit-backdrop-filter: blur(24px) saturate(1.8);
          border-bottom: 1px solid var(--border-light);
          box-shadow: 0 1px 0 var(--border-light);
        }
        .nav-inner {
          max-width: 1300px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; height: 72px; gap: 16px;
        }
        .nav-left { display: flex; align-items: center; gap: 16px; }
        .nav-back {
          display: flex; align-items: center; gap: 7px;
          font-size: 13px; font-weight: 600; color: var(--text-3);
          background: none; border: 1px solid var(--border);
          border-radius: 24px; padding: 7px 14px;
          cursor: pointer; font-family: var(--font);
          transition: box-shadow .18s, color .18s;
          text-decoration: none;
        }
        .nav-back:hover { box-shadow: var(--shadow-lg); color: var(--text); }
        .nav-brand {
          display: flex; align-items: center; gap: 6px; text-decoration: none;
        }
        .nav-brand-mark {
          width: 32px; height: 32px; border-radius: 9px;
          background: var(--coral); color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 800; flex-shrink: 0;
        }
        .nav-brand-name {
          font-size: 17px; font-weight: 800; letter-spacing: -0.4px; color: var(--text);
        }

        /* ══ PAGE LAYOUT ══ */
        .page {
          max-width: 780px; margin: 0 auto;
          padding: 48px 24px 96px;
        }

        /* PAGE HERO */
        .page-hero {
          background: linear-gradient(135deg, #fff5f6 0%, #ffffff 60%);
          border: 1px solid var(--border-light);
          border-radius: var(--radius);
          padding: 32px 32px 28px;
          margin-bottom: 28px;
          position: relative; overflow: hidden;
        }
        .page-hero::after {
          content: '';
          position: absolute; top: -40px; right: -40px;
          width: 160px; height: 160px; border-radius: 50%;
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
          color: var(--text); margin-bottom: 6px; line-height: 1.15;
        }
        .page-hero p { font-size: 14px; color: var(--text-3); font-weight: 400; }

        /* ══ TABS ══ */
        .tabs {
          display: flex; gap: 0;
          background: var(--bg); border: 1px solid var(--border);
          border-radius: var(--radius-sm); padding: 4px;
          width: fit-content; margin-bottom: 28px;
          box-shadow: var(--shadow-sm);
        }
        .tab-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 20px; font-size: 13px; font-weight: 700;
          border: none; background: none; cursor: pointer;
          border-radius: calc(var(--radius-sm) - 2px);
          color: var(--text-3); transition: all .2s;
          white-space: nowrap; font-family: var(--font);
        }
        .tab-btn:hover { color: var(--text); }
        .tab-btn.active {
          background: var(--coral); color: white;
          box-shadow: 0 2px 8px rgba(255,56,92,0.3);
        }
        .tab-count {
          background: rgba(255,255,255,0.25); color: white;
          font-size: 11px; padding: 1px 7px;
          border-radius: 20px; font-weight: 700;
        }
        .tab-btn:not(.active) .tab-count {
          background: var(--bg-soft); color: var(--text-3);
        }

        /* ══ FORM CARDS ══ */
        .form-stack { display: flex; flex-direction: column; gap: 16px; }

        .fcard {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: var(--radius); overflow: hidden;
          box-shadow: var(--shadow);
        }
        .fcard-head {
          padding: 18px 24px 0;
          display: flex; align-items: center; gap: 10px;
        }
        .fcard-head-icon {
          width: 32px; height: 32px; border-radius: var(--radius-xs);
          background: var(--coral-soft); border: 1px solid var(--coral-border);
          display: flex; align-items: center; justify-content: center;
          color: var(--coral); flex-shrink: 0;
        }
        .fcard-title {
          font-size: 14px; font-weight: 800; color: var(--text); letter-spacing: -0.2px;
        }
        .fcard-body { padding: 18px 24px 24px; }

        /* GRID */
        .fg { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .fg .s2 { grid-column: span 2; }

        /* FIELDS */
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field-label {
          font-size: 12px; font-weight: 700; color: var(--text-2);
          display: flex; align-items: center; gap: 5px;
          text-transform: uppercase; letter-spacing: 0.4px;
        }
        .req { color: var(--coral); }

        .finput, .fselect, .ftextarea {
          width: 100%; padding: 11px 14px;
          background: var(--bg-soft); border: 1.5px solid var(--border-light);
          border-radius: var(--radius-xs); font-family: var(--font);
          font-size: 14px; color: var(--text); outline: none;
          transition: border-color .2s, box-shadow .2s, background .2s;
          appearance: none;
        }
        .finput::placeholder, .ftextarea::placeholder { color: var(--text-4); }
        .finput:focus, .fselect:focus, .ftextarea:focus {
          border-color: var(--coral);
          box-shadow: 0 0 0 3px rgba(255,56,92,0.1);
          background: var(--bg);
        }
        .ftextarea { resize: vertical; min-height: 106px; line-height: 1.6; }
        .fselect { cursor: pointer; }

        /* TOGGLE */
        .toggle-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 16px;
          background: var(--bg-soft); border: 1.5px solid var(--border-light);
          border-radius: var(--radius-xs); cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .toggle-row:hover { border-color: var(--border); background: var(--bg); }
        .toggle-row.on { border-color: var(--coral-border); background: var(--coral-soft); }
        .toggle-label { font-size: 14px; font-weight: 700; color: var(--text); }
        .toggle-sub { font-size: 12px; color: var(--text-3); margin-top: 2px; }
        .toggle-track {
          width: 44px; height: 26px; border-radius: 13px;
          background: var(--border); flex-shrink: 0;
          position: relative; transition: background .25s;
        }
        .toggle-track.on { background: var(--coral); }
        .toggle-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 20px; height: 20px; border-radius: 50%;
          background: white; box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          transition: transform .25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .toggle-track.on .toggle-thumb { transform: translateX(18px); }

        /* AMENITIES */
        .amenity-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .amenity-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; font-size: 13px; font-weight: 600;
          border: 1.5px solid var(--border-light); border-radius: 40px;
          background: var(--bg-soft); cursor: pointer;
          transition: all .18s; color: var(--text-3);
          font-family: var(--font);
        }
        .amenity-pill:hover { border-color: var(--border); color: var(--text); background: var(--bg); }
        .amenity-pill.on {
          background: var(--coral-soft); border-color: var(--coral-border);
          color: var(--coral);
        }
        .amenity-check {
          width: 16px; height: 16px; border-radius: 50%;
          background: var(--coral); display: flex; align-items: center; justify-content: center;
          opacity: 0; transform: scale(0.5); transition: all .2s;
          flex-shrink: 0;
        }
        .amenity-check svg { width: 9px; height: 9px; stroke: white; stroke-width: 2.5; fill: none; }
        .amenity-pill.on .amenity-check { opacity: 1; transform: scale(1); }

        /* DROPZONE */
        .dropzone {
          border: 2px dashed var(--border);
          border-radius: var(--radius-xs);
          padding: 36px 24px; text-align: center;
          cursor: pointer; transition: all .2s;
          background: var(--bg-soft); position: relative;
        }
        .dropzone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
        .dropzone:hover, .dropzone.over {
          border-color: var(--coral); background: var(--coral-soft);
        }
        .dz-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: var(--bg); border: 1px solid var(--border-light);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 12px; color: var(--text-3);
        }
        .dropzone:hover .dz-icon, .dropzone.over .dz-icon {
          background: white; border-color: var(--coral-border); color: var(--coral);
        }
        .dz-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
        .dz-sub { font-size: 12px; color: var(--text-3); }

        .previews {
          display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-top: 14px;
        }
        .preview-item {
          position: relative; aspect-ratio: 1;
          border-radius: var(--radius-xs); overflow: hidden;
          border: 1.5px solid var(--border-light);
        }
        .preview-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .preview-rm {
          position: absolute; top: 5px; right: 5px;
          background: rgba(0,0,0,0.55); backdrop-filter: blur(4px);
          border: none; border-radius: 50%;
          width: 22px; height: 22px; color: white; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background .18s; padding: 0;
        }
        .preview-rm:hover { background: var(--coral); }

        /* SUBMIT BTN */
        .submit-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #FF385C, #D70466);
          color: white; border: none; border-radius: var(--radius-sm);
          font-family: var(--font); font-size: 15px; font-weight: 800;
          cursor: pointer; letter-spacing: -0.2px;
          transition: filter .2s, transform .15s, box-shadow .2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 16px rgba(255,56,92,0.3);
        }
        .submit-btn:hover:not(:disabled) {
          filter: brightness(1.06); box-shadow: 0 6px 24px rgba(255,56,92,0.4);
        }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white; border-radius: 50%;
          animation: spin .65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ══ MY HOTELS LIST ══ */
        .hotels-list { display: flex; flex-direction: column; gap: 12px; }

        .empty-card {
          background: var(--bg); border: 1px solid var(--border-light);
          border-radius: var(--radius); padding: 72px 24px;
          text-align: center;
        }
        .empty-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: var(--bg-soft); border: 1px solid var(--border-light);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px; color: var(--text-4);
        }
        .empty-card h3 { font-size: 16px; font-weight: 800; color: var(--text); margin-bottom: 6px; }
        .empty-card p { font-size: 13px; color: var(--text-3); }

        .hotel-row {
          background: var(--bg); border: 1px solid var(--border-light);
          border-radius: var(--radius); overflow: hidden;
          display: grid; grid-template-columns: 100px 1fr auto;
          box-shadow: var(--shadow); transition: box-shadow .2s;
        }
        .hotel-row:hover { box-shadow: var(--shadow-lg); }
        .hotel-row-img {
          width: 100px; object-fit: cover; display: block; min-height: 96px;
        }
        .hotel-row-body { padding: 16px 20px; }
        .hotel-row-name {
          font-size: 14px; font-weight: 800; color: var(--text);
          letter-spacing: -0.2px; margin-bottom: 4px;
        }
        .hotel-row-loc {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; color: var(--text-3); margin-bottom: 10px;
        }
        .hotel-row-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .hbadge {
          font-size: 11px; font-weight: 600;
          padding: 3px 10px; border-radius: 20px;
        }
        .hbadge-neutral { background: var(--bg-soft); color: var(--text-3); border: 1px solid var(--border-light); }
        .hbadge-green   { background: #e8f5e9; color: #2e7d32; }
        .hbadge-red     { background: #fce4e4; color: var(--coral-dark); }

        .hotel-row-del {
          padding: 0 22px; border: none; background: none; cursor: pointer;
          color: var(--text-4); transition: color .18s;
          display: flex; align-items: center; border-left: 1px solid var(--border-light);
        }
        .hotel-row-del:hover { color: var(--coral); background: var(--coral-soft); }

        @media (max-width: 640px) {
          .nav-inner { padding: 0 16px; }
          .page { padding: 28px 16px 72px; }
          .page-hero { padding: 24px 20px 20px; }
          .fg { grid-template-columns: 1fr; }
          .fg .s2 { grid-column: span 1; }
          .previews { grid-template-columns: repeat(3, 1fr); }
          .hotel-row { grid-template-columns: 80px 1fr auto; }
          .hotel-row-img { width: 80px; }
        }
      `}</style>

      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", minHeight: "100vh", background: "#F7F7F7" }}>
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

        {/* ══ NAV ══ */}
        <nav className="nav">
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

          {/* PAGE HERO */}
          <motion.div
            className="page-hero"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="page-hero-tag">
              <FiHome size={10} /> Hotel Manager
            </div>
            <h1>List your property</h1>
            <p>Add your hotel or manage your existing listings on Planora</p>
          </motion.div>

          {/* TABS */}
          <motion.div
            className="tabs"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <button className={`tab-btn ${showForm ? "active" : ""}`} onClick={() => setShowForm(true)}>
              <FiPlus size={13} /> List New Hotel
            </button>
            <button className={`tab-btn ${!showForm ? "active" : ""}`} onClick={() => setShowForm(false)}>
              <FiGrid size={13} /> My Hotels
              <span className="tab-count">{myHotels.length}</span>
            </button>
          </motion.div>

          {/* ── FORM / LIST ── */}
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.form
                key="form"
                className="form-stack"
                onSubmit={handleSubmit}
                variants={stagger}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
              >
                {/* BASIC INFO */}
                <motion.div className="fcard" variants={fadeUp}>
                  <div className="fcard-head">
                    <div className="fcard-head-icon"><FiHome size={15} /></div>
                    <span className="fcard-title">Basic Info</span>
                  </div>
                  <div className="fcard-body">
                    <div className="fg">
                      <div className="field s2">
                        <label className="field-label"><FiHome size={11} /> Hotel Name <span className="req">*</span></label>
                        <input className="finput" type="text" name="name" placeholder="e.g. The Grand Palace" value={form.name} onChange={handleChange} />
                      </div>
                      <div className="field s2">
                        <label className="field-label"><FiMapPin size={11} /> Location <span className="req">*</span></label>
                        <input className="finput" type="text" name="location" placeholder="e.g. Jaipur, Rajasthan" value={form.location} onChange={handleChange} />
                      </div>
                      <div className="field s2">
                        <label className="field-label">Description <span className="req">*</span></label>
                        <textarea className="ftextarea" name="description" placeholder="Describe your property — atmosphere, unique highlights, nearby attractions..." value={form.description} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* PRICING */}
                <motion.div className="fcard" variants={fadeUp}>
                  <div className="fcard-head">
                    <div className="fcard-head-icon"><FiDollarSign size={15} /></div>
                    <span className="fcard-title">Pricing &amp; Details</span>
                  </div>
                  <div className="fcard-body">
                    <div className="fg">
                      <div className="field">
                        <label className="field-label"><FiDollarSign size={11} /> Price / Night (₹) <span className="req">*</span></label>
                        <input className="finput" type="number" name="pricePerNight" placeholder="2500" min="1" value={form.pricePerNight} onChange={handleChange} />
                      </div>
                      <div className="field">
                        <label className="field-label">Total Rooms <span className="req">*</span></label>
                        <input className="finput" type="number" name="rooms" placeholder="10" min="1" value={form.rooms} onChange={handleChange} />
                      </div>
                      <div className="field">
                        <label className="field-label"><FiStar size={11} /> Rating (0–5)</label>
                        <input className="finput" type="number" name="rating" placeholder="4.5" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} />
                      </div>
                      <div className="field">
                        <label className="field-label">Category</label>
                        <select className="fselect" name="category" value={form.category} onChange={handleChange}>
                          {categoryOptions.map(c => (
                            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      <div className="field s2">
                        <div
                          className={`toggle-row ${form.featured ? "on" : ""}`}
                          onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                        >
                          <div>
                            <div className="toggle-label">Featured listing</div>
                            <div className="toggle-sub">Appear in highlighted sections on the homepage</div>
                          </div>
                          <div className={`toggle-track ${form.featured ? "on" : ""}`}>
                            <div className="toggle-thumb" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* AMENITIES */}
                <motion.div className="fcard" variants={fadeUp}>
                  <div className="fcard-head">
                    <div className="fcard-head-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    </div>
                    <span className="fcard-title">Amenities</span>
                  </div>
                  <div className="fcard-body">
                    <div className="amenity-grid">
                      {amenityOptions.map(am => (
                        <button
                          key={am} type="button"
                          className={`amenity-pill ${selectedAmenities.includes(am) ? "on" : ""}`}
                          onClick={() => toggleAmenity(am)}
                        >
                          <div className="amenity-check">
                            <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" /></svg>
                          </div>
                          {am}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* PHOTOS */}
                <motion.div className="fcard" variants={fadeUp}>
                  <div className="fcard-head">
                    <div className="fcard-head-icon"><FiUpload size={15} /></div>
                    <span className="fcard-title">Photos</span>
                  </div>
                  <div className="fcard-body">
                    <div
                      className={`dropzone ${dragOver ? "over" : ""}`}
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                    >
                      <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                      <div className="dz-icon"><FiUpload size={18} /></div>
                      <div className="dz-title">Drag photos here or click to browse</div>
                      <div className="dz-sub">JPEG, PNG, WebP — up to 5 images</div>
                    </div>
                    {previews.length > 0 && (
                      <div className="previews">
                        {previews.map((p, i) => (
                          <div key={i} className="preview-item">
                            <img src={p} alt="" />
                            <button type="button" className="preview-rm" onClick={() => removePreview(i)}>
                              <FiX size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* SUBMIT */}
                <motion.button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                  variants={fadeUp}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.985 }}
                >
                  {loading
                    ? <span className="spinner" />
                    : <><FiCheck size={16} /> List Hotel</>
                  }
                </motion.button>
              </motion.form>

            ) : (
              <motion.div
                key="list"
                className="hotels-list"
                variants={stagger}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                {myHotels.length === 0 ? (
                  <motion.div className="empty-card" variants={fadeUp}>
                    <div className="empty-icon"><FiPackage size={22} /></div>
                    <h3>No listings yet</h3>
                    <p>Switch to "List New Hotel" to add your first property</p>
                  </motion.div>
                ) : (
                  myHotels.map(h => (
                    <motion.div key={h._id} className="hotel-row" variants={fadeUp}>
                      <img
                        className="hotel-row-img"
                        src={h.images?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=60"}
                        alt={h.name}
                      />
                      <div className="hotel-row-body">
                        <div className="hotel-row-name">{h.name}</div>
                        <div className="hotel-row-loc"><FiMapPin size={11} /> {h.location}</div>
                        <div className="hotel-row-meta">
                          <span className="hbadge hbadge-neutral">₹{h.pricePerNight?.toLocaleString()} / night</span>
                          <span className="hbadge hbadge-neutral">{h.availableRooms}/{h.rooms} rooms</span>
                          <span className={`hbadge ${h.availableRooms > 0 ? "hbadge-green" : "hbadge-red"}`}>
                            {h.availableRooms > 0 ? "Available" : "Fully Booked"}
                          </span>
                        </div>
                      </div>
                      <button className="hotel-row-del" onClick={() => handleDelete(h._id)} title="Remove listing">
                        <FiTrash2 size={16} />
                      </button>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}