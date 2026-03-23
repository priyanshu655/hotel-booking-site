import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  FiSearch, FiMapPin, FiStar, FiSliders, FiHeart,
  FiLogOut, FiUser, FiCalendar, FiPlus, FiChevronDown, FiArrowRight, FiGrid,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../config";

/* ── moods ── */
const moods = [
  { key: "all",      emoji: "🌍", label: "All Stays" },
  { key: "luxury",   emoji: "✦",  label: "Luxury"    },
  { key: "resort",   emoji: "🌊", label: "Resort"    },
  { key: "boutique", emoji: "◆",  label: "Boutique"  },
  { key: "budget",   emoji: "◎",  label: "Budget"    },
  { key: "business", emoji: "◇",  label: "Business"  },
];

const sortOptions = [
  { key: "newest",     label: "Newest" },
  { key: "price_asc",  label: "Price: Low → High" },
  { key: "price_desc", label: "Price: High → Low" },
  { key: "rating",     label: "Top Rated" },
];

/* ── bg scenes (Unsplash stills) ── */
const bgImages = [
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=80",
  "https://images.unsplash.com/photo-1455587734955-081b22074882?w=1600&q=80",
];

/* ── fallback hotel images ── */
const fallbacks = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=75",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=75",
  "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=600&q=75",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=75",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=75",
  "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=75",
];

/* ── 3-D tilt card ── */
const TiltCard = ({ children }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-4, 4]);

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top)  / rect.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

export default function HomePage() {
  const [hotels, setHotels]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [checkIn, setCheckIn]       = useState("");
  const [checkOut, setCheckOut]     = useState("");
  const [activeCategory, setActiveCat] = useState("all");
  const [sort, setSort]             = useState("newest");
  const [showSort, setShowSort]     = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [bgIdx, setBgIdx]           = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const [favorites, setFavorites]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("planora_favs")) || []; } catch { return []; }
  });

  const sortRef  = useRef(null);
  const navigate = useNavigate();
  const token    = localStorage.getItem("token");
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("planora_user")); } catch { return null; }
  });

  /* bg rotation */
  useEffect(() => {
    const t = setInterval(() => setBgIdx(i => (i + 1) % bgImages.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { fetchHotels(); }, [activeCategory, sort]);

  useEffect(() => {
    if (token && !user) {
      axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => {
          if (r.data) {
            setUser(r.data);
            localStorage.setItem("planora_user", JSON.stringify(r.data));
          }
        })
        .catch(err => console.error("Auth error:", err));
    }
  }, [token]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = e => { if (sortRef.current && !sortRef.current.contains(e.target)) setShowSort(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeCategory !== "all") params.category = activeCategory;
      if (sort !== "newest") params.sort = sort;
      if (search.trim()) params.search = search.trim();
      if (checkIn)  params.checkIn  = checkIn;
      if (checkOut) params.checkOut = checkOut;
      const res = await axios.get(`${API}/hotels`, { params });
      setHotels(res.data);
    } catch { setHotels([]); }
    finally  { setLoading(false); }
  };

  const handleSearch = e => { e.preventDefault(); fetchHotels(); };

  const toggleFav = id => {
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(next);
    localStorage.setItem("planora_favs", JSON.stringify(next));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("planora_user");
    setUser(null);
    navigate("/auth");
  };

  /* ── stagger variants ── */
  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } };
  const fadeUp  = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } } };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --coral:       #FF385C;
          --coral-dark:  #D70466;
          --coral-pale:  rgba(255,56,92,0.09);
          --sky:         #38BDF8;
          --sky-deep:    #0EA5E9;
          --slate:       #111827;
          --slate-2:     #374151;
          --muted:       #9CA3AF;
          --border:      rgba(0,0,0,0.09);
          --surface:     #FFFFFF;
          --bg:          #F9FAFB;
          --font-display:'Playfair Display', Georgia, serif;
          --font:        'Outfit', sans-serif;
        }

        html { scroll-behavior: smooth; }
        body { font-family: var(--font); background: var(--bg); color: var(--slate); -webkit-font-smoothing: antialiased; }
        * { font-family: var(--font); }
        a { text-decoration: none; color: inherit; }

        /* ════ NAVBAR ════ */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 500;
          padding: 0 32px; height: 72px;
          display: flex; align-items: center; justify-content: space-between;
          transition: background .4s, box-shadow .4s, backdrop-filter .4s;
        }
        .nav.solid {
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(24px) saturate(1.6);
          box-shadow: 0 1px 0 var(--border), 0 4px 20px rgba(0,0,0,0.06);
        }
        .nav.transparent { background: transparent; }

        .brand { display: flex; align-items: center; gap: 10px; }
        .brand-mark {
          width: 38px; height: 38px; border-radius: 12px;
          background: var(--coral); color: white;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-size: 20px; font-weight: 800;
          box-shadow: 0 4px 14px rgba(255,56,92,.4); flex-shrink: 0;
        }
        .brand-name {
          font-family: var(--font-display); font-size: 22px; font-weight: 700;
          letter-spacing: -0.3px; color: var(--slate);
        }
        .nav.transparent .brand-name { color: white; }
        .nav.transparent .brand-mark { box-shadow: 0 4px 14px rgba(0,0,0,.3); }

        .nav-links { display: flex; align-items: center; gap: 4px; }
        .nav-link {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 16px; border-radius: 100px;
          font-size: 13.5px; font-weight: 600; color: var(--slate-2);
          transition: background .18s, color .18s; border: none; background: none;
          cursor: pointer; white-space: nowrap;
        }
        .nav-link:hover { background: rgba(0,0,0,.05); color: var(--slate); }
        .nav.transparent .nav-link { color: rgba(255,255,255,.88); }
        .nav.transparent .nav-link:hover { background: rgba(255,255,255,.15); color: white; }

        .nav-user-pill {
          display: flex; align-items: center; gap: 10px;
          border: 1.5px solid rgba(0,0,0,.13); border-radius: 100px;
          padding: 5px 5px 5px 16px; background: var(--surface);
          cursor: pointer; font-size: 13.5px; font-weight: 600; color: var(--slate-2);
          transition: box-shadow .2s; flex-shrink: 0;
        }
        .nav-user-pill:hover { box-shadow: 0 4px 20px rgba(0,0,0,.12); }
        .nav.transparent .nav-user-pill {
          background: rgba(255,255,255,.14); border-color: rgba(255,255,255,.35);
          color: white; backdrop-filter: blur(12px);
        }
        .nav-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--slate); color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700;
        }
        .nav-signin {
          display: flex; align-items: center; gap: 8px;
          border: 1.5px solid rgba(0,0,0,.13); border-radius: 100px;
          padding: 10px 22px; font-size: 13.5px; font-weight: 700; color: var(--slate);
          background: var(--surface); transition: box-shadow .2s;
        }
        .nav-signin:hover { box-shadow: 0 4px 20px rgba(0,0,0,.12); }
        .nav.transparent .nav-signin {
          background: rgba(255,255,255,.14); border-color: rgba(255,255,255,.35);
          color: white; backdrop-filter: blur(12px);
        }

        /* ════ HERO ════ */
        .hero {
          position: relative; height: 100svh; min-height: 600px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .hero-bg { position: absolute; inset: 0; z-index: 0; }
        .hero-bg-img {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          transition: opacity 1.8s ease;
        }
        .hero-bg-img.active { opacity: 1; }
        .hero-bg-img.inactive { opacity: 0; }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(5,10,20,.28) 0%, rgba(5,10,20,.46) 40%, rgba(5,10,20,.72) 100%);
        }
        .hero-grain {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: .45;
        }
        .hero-content {
          position: relative; z-index: 2;
          display: flex; flex-direction: column; align-items: center; gap: 0;
          width: 100%; padding: 0 24px; text-align: center;
        }
        .hero-dest-strip {
          display: flex; gap: 10px; margin-bottom: 36px; flex-wrap: wrap; justify-content: center;
        }
        .dest-chip {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,.14); backdrop-filter: blur(14px) saturate(1.4);
          border: 1px solid rgba(255,255,255,.22); border-radius: 100px;
          padding: 7px 15px; font-size: 12.5px; font-weight: 600; color: white;
          cursor: pointer; transition: background .2s, transform .2s;
        }
        .dest-chip:hover { background: rgba(255,255,255,.22); transform: translateY(-2px); }
        .dest-chip .dot { width: 6px; height: 6px; border-radius: 50%; background: #34D399; }

        .search-shell {
          background: var(--surface); border-radius: 20px;
          box-shadow: 0 24px 60px rgba(0,0,0,.22), 0 4px 16px rgba(0,0,0,.1);
          display: flex; align-items: stretch; overflow: hidden;
          width: 100%; max-width: 760px;
          border: 1.5px solid rgba(255,255,255,.8);
          transition: box-shadow .3s, transform .3s;
        }
        .search-shell.focused {
          box-shadow: 0 32px 72px rgba(0,0,0,.28), 0 0 0 3px rgba(255,56,92,.2);
          transform: translateY(-3px);
        }
        .search-shell form { display: flex; width: 100%; }
        .seg {
          flex: 1; padding: 20px 22px 18px;
          border-right: 1px solid rgba(0,0,0,.07);
          display: flex; flex-direction: column; gap: 4px;
          transition: background .15s; cursor: text; min-width: 0;
        }
        .seg:last-of-type { border-right: none; }
        .seg:hover { background: rgba(0,0,0,.02); }
        .seg-label { font-size: 10.5px; font-weight: 800; color: var(--slate); letter-spacing: .5px; text-transform: uppercase; }
        .seg-input {
          border: none; outline: none; background: none; font-family: var(--font);
          font-size: 14px; font-weight: 500; color: var(--slate); width: 100%;
        }
        .seg-input::placeholder { color: var(--muted); font-weight: 400; }
        .search-btn {
          margin: 10px; padding: 0 24px; flex-shrink: 0;
          background: linear-gradient(135deg, #FF385C 0%, #D70466 100%);
          border: none; border-radius: 12px; color: white; cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font); font-size: 14px; font-weight: 700;
          box-shadow: 0 4px 16px rgba(255,56,92,.45);
          transition: transform .2s, filter .2s, box-shadow .2s;
        }
        .search-btn:hover {
          transform: scale(1.04); filter: brightness(1.06);
          box-shadow: 0 8px 24px rgba(255,56,92,.55);
        }
        .hero-scroll-cue {
          position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
          z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: rgba(255,255,255,.6); font-size: 11px; font-weight: 600;
          letter-spacing: .6px; text-transform: uppercase;
        }
        .scroll-line {
          width: 1px; height: 40px;
          background: linear-gradient(to bottom, rgba(255,255,255,.5), transparent);
          animation: scrollLine 2s ease-in-out infinite;
        }
        @keyframes scrollLine {
          0%   { transform: scaleY(0) translateY(0); opacity: 0; }
          30%  { opacity: 1; }
          100% { transform: scaleY(1) translateY(10px); opacity: 0; }
        }

        /* ════ MOOD BAR ════ */
        .mood-bar {
          background: var(--surface); border-bottom: 1px solid var(--border);
          position: sticky; top: 72px; z-index: 300;
        }
        .mood-inner {
          max-width: 1340px; margin: 0 auto; padding: 0 32px;
          display: flex; align-items: center; gap: 0;
        }
        .mood-scroll { display: flex; flex: 1; overflow-x: auto; scrollbar-width: none; gap: 0; }
        .mood-scroll::-webkit-scrollbar { display: none; }
        .mood-tab {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 16px 28px 14px; border: none; background: none;
          border-bottom: 2.5px solid transparent; cursor: pointer;
          font-family: var(--font); color: var(--muted); white-space: nowrap; flex-shrink: 0;
          transition: color .18s, border-color .18s;
        }
        .mood-tab:hover { color: var(--slate-2); border-bottom-color: rgba(0,0,0,.15); }
        .mood-tab.active { color: var(--slate); border-bottom-color: var(--slate); }
        .mood-emoji { font-size: 22px; line-height: 1; }
        .mood-label { font-size: 11px; font-weight: 700; letter-spacing: .3px; }

        .sort-wrap { position: relative; flex-shrink: 0; padding: 10px 0; }
        .sort-btn {
          display: flex; align-items: center; gap: 7px;
          border: 1.5px solid var(--border); border-radius: 10px;
          padding: 9px 16px; font-family: var(--font); font-size: 13px;
          font-weight: 600; color: var(--slate-2); background: var(--surface);
          cursor: pointer; transition: box-shadow .18s, border-color .18s;
        }
        .sort-btn:hover { box-shadow: 0 2px 10px rgba(0,0,0,.09); border-color: rgba(0,0,0,.2); }
        .sort-menu {
          position: absolute; right: 0; top: calc(100% + 6px);
          background: var(--surface); border: 1px solid rgba(0,0,0,.08);
          border-radius: 16px; box-shadow: 0 12px 40px rgba(0,0,0,.14);
          min-width: 200px; padding: 6px; z-index: 100;
        }
        .sort-opt {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; text-align: left; padding: 11px 14px; border: none;
          background: none; font-family: var(--font); font-size: 13.5px;
          color: var(--slate-2); cursor: pointer; border-radius: 10px;
          transition: background .15s;
        }
        .sort-opt:hover { background: var(--bg); color: var(--slate); }
        .sort-opt.active { color: var(--coral); font-weight: 700; }
        .sort-tick {
          width: 20px; height: 20px; border-radius: 50%;
          background: var(--coral); display: flex; align-items: center; justify-content: center;
        }
        .sort-tick-icon { width: 11px; height: 11px; stroke: white; stroke-width: 2.5; fill: none; }

        /* ════ GRID SECTION ════ */
        .section { max-width: 1340px; margin: 0 auto; padding: 52px 32px 80px; }
        .section-top {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 36px; gap: 16px;
        }
        .section-heading {
          font-family: var(--font-display); font-size: clamp(26px, 3.5vw, 38px);
          font-weight: 700; letter-spacing: -0.5px; color: var(--slate); line-height: 1.15;
        }
        .section-heading em { font-style: italic; color: var(--coral); }
        .section-count { font-size: 13px; color: var(--muted); font-weight: 500; white-space: nowrap; }

        /* ════ REDESIGNED CARD GRID ════ */
        .hotel-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          align-items: start;
        }

        /* Featured first card — wider, taller */
        .hotel-grid .hcard:first-child {
          grid-column: span 2;
          grid-row: span 2;
        }
        .hotel-grid .hcard:first-child .hcard-img {
          aspect-ratio: unset;
          height: 100%;
          min-height: 480px;
          border-radius: 22px;
        }
        .hotel-grid .hcard:first-child .hcard-name { font-size: 17px; }
        .hotel-grid .hcard:first-child .hcard-price b { font-size: 17px; }
        .hotel-grid .hcard:first-child .hcard-body { padding: 16px 4px 4px; }

        /* ── CARD ── */
        .hcard {
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .hcard-inner {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          height: 100%;
        }

        /* Image container */
        .hcard-img {
          position: relative;
          aspect-ratio: 3/2;
          border-radius: 16px;
          overflow: hidden;
          background: #E5E7EB;
          flex-shrink: 0;
        }
        .hcard-img img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform .65s cubic-bezier(.25,.46,.45,.94);
        }
        .hcard:hover .hcard-img img { transform: scale(1.06); }

        /* Gradient overlay on hover */
        .hcard-overlay {
          position: absolute; inset: 0; border-radius: 16px;
          background: linear-gradient(to top, rgba(0,0,0,.65) 0%, rgba(0,0,0,.15) 45%, transparent 70%);
          opacity: 0; transition: opacity .3s;
        }
        .hcard:hover .hcard-overlay { opacity: 1; }

        /* Quick view button */
        .hcard-quick {
          position: absolute; bottom: 14px; left: 50%;
          transform: translateX(-50%) translateY(10px);
          display: flex; align-items: center; gap: 6px; white-space: nowrap;
          background: white; color: var(--slate); border-radius: 100px;
          padding: 9px 18px; font-size: 12.5px; font-weight: 700;
          box-shadow: 0 6px 20px rgba(0,0,0,.18);
          opacity: 0; transition: opacity .25s, transform .25s;
          pointer-events: none;
        }
        .hcard:hover .hcard-quick {
          opacity: 1; transform: translateX(-50%) translateY(0);
          pointer-events: auto;
        }

        /* Category badge */
        .badge-cat {
          position: absolute; top: 12px; left: 12px; z-index: 2;
          background: rgba(255,255,255,.93); backdrop-filter: blur(10px);
          color: var(--slate); font-size: 10px; font-weight: 800;
          padding: 4px 10px; border-radius: 100px;
          text-transform: uppercase; letter-spacing: .5px;
        }

        /* Favorite button */
        .badge-fav {
          position: absolute; top: 12px; right: 12px; z-index: 3;
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(255,255,255,.85); backdrop-filter: blur(10px);
          border: none; cursor: pointer; padding: 0;
          display: flex; align-items: center; justify-content: center;
          color: rgba(0,0,0,.35); transition: transform .2s, background .2s, color .2s;
          box-shadow: 0 2px 8px rgba(0,0,0,.1);
        }
        .badge-fav:hover { transform: scale(1.12); background: white; color: var(--coral); }
        .badge-fav.active { color: var(--coral); background: white; }
        .badge-fav.active svg { fill: var(--coral); }

        /* Card body — clean info layout */
        .hcard-body {
          padding: 14px 2px 2px;
          display: flex;
          flex-direction: column;
          gap: 0;
          flex: 1;
        }

        /* Top row: name + rating */
        .hcard-row {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 8px;
          margin-bottom: 5px;
        }
        .hcard-name {
          font-size: 14px; font-weight: 700; color: var(--slate);
          letter-spacing: -0.1px; line-height: 1.4;
          flex: 1; min-width: 0;
        }

        /* Rating pill */
        .hcard-rating {
          display: flex; align-items: center; gap: 4px;
          background: #FFF7ED; border: 1px solid #FED7AA;
          border-radius: 8px; padding: 3px 8px;
          font-size: 12px; font-weight: 700; color: #92400E;
          flex-shrink: 0;
        }

        /* Location */
        .hcard-loc {
          display: flex; align-items: center; gap: 4px;
          font-size: 12.5px; color: var(--muted); font-weight: 500;
          margin-bottom: 12px;
        }

        /* Footer: price + availability */
        .hcard-foot {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid rgba(0,0,0,.06);
          margin-top: auto;
          gap: 8px;
        }
        .hcard-price { font-size: 13.5px; color: var(--slate); line-height: 1; }
        .hcard-price b { font-weight: 800; font-size: 15px; color: var(--slate); }
        .hcard-price span { color: var(--muted); font-size: 12px; font-weight: 400; }

        /* Availability pills */
        .avail-pill {
          font-size: 11px; font-weight: 700;
          padding: 4px 10px; border-radius: 100px;
          white-space: nowrap; flex-shrink: 0;
        }
        .avail-ok   { background: #DCFCE7; color: #15803D; }
        .avail-low  { background: #FEF9C3; color: #A16207; }
        .avail-sold { background: #FEE2E2; color: #B91C1C; }

        /* ── SKELETON ── */
        .sk { border-radius: 16px; overflow: hidden; }
        .sk-box {
          border-radius: 16px; margin-bottom: 14px; aspect-ratio: 3/2;
          background: linear-gradient(90deg, #F3F4F6 25%, #E9EAEC 50%, #F3F4F6 75%);
          background-size: 200%; animation: shimmer 1.6s infinite;
        }
        .sk-line {
          height: 12px; border-radius: 6px; margin-bottom: 9px;
          background: linear-gradient(90deg, #F3F4F6 25%, #E9EAEC 50%, #F3F4F6 75%);
          background-size: 200%; animation: shimmer 1.6s infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* ── EMPTY ── */
        .empty {
          grid-column: 1 / -1; text-align: center; padding: 80px 24px;
          display: flex; flex-direction: column; align-items: center; gap: 16px;
        }
        .empty-icon {
          width: 72px; height: 72px; border-radius: 22px;
          background: var(--bg); border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center; font-size: 32px;
        }
        .empty h3 { font-size: 20px; font-weight: 700; color: var(--slate); }
        .empty p  { font-size: 14px; color: var(--muted); }

        /* ════ RESPONSIVE ════ */
        @media (max-width: 1200px) {
          .hotel-grid { grid-template-columns: repeat(3, 1fr); }
          .hotel-grid .hcard:first-child { grid-column: span 2; }
        }
        @media (max-width: 900px) {
          .hotel-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .hotel-grid .hcard:first-child { grid-column: span 2; }
          .hotel-grid .hcard:first-child .hcard-img { min-height: 300px; }
          .nav { padding: 0 20px; }
          .section { padding: 36px 20px 64px; }
          .mood-inner { padding: 0 16px; }
        }
        @media (max-width: 580px) {
          .hotel-grid { grid-template-columns: 1fr; gap: 18px; }
          .hotel-grid .hcard:first-child { grid-column: 1; grid-row: 1; }
          .hotel-grid .hcard:first-child .hcard-img { height: auto; min-height: unset; aspect-ratio: 3/2; }
          .hero-dest-strip { display: none; }
          .search-shell form { flex-direction: column; }
          .seg { border-right: none; border-bottom: 1px solid rgba(0,0,0,.07); }
          .search-btn { margin: 10px; border-radius: 12px; padding: 14px; }
          .nav-links { display: none; }
        }
      `}</style>

      <div style={{ minHeight: "100vh" }}>

        {/* ════ NAVBAR ════ */}
        <nav className={`nav ${scrolled ? "solid" : "transparent"}`}>
          <Link to="/" className="brand">
            <div className="brand-mark">P</div>
            <span className="brand-name">planora</span>
          </Link>

          <div className="nav-links">
            {token && (
              <Link to="/bookings" className="nav-link">
                <FiCalendar size={14} /> My Bookings
              </Link>
            )}
            {token && (
              <Link to="/trip-planner" className="nav-link">
                <FiMapPin size={14} /> Trip Planner
              </Link>
            )}
            {token && (user?.role === "seller" || user?.role === "admin") && (
              <Link to="/add-hotel" className="nav-link">
                <FiPlus size={14} /> List Hotel
              </Link>
            )}
            {token && (user?.role === "seller" || user?.role === "admin") && (
              <Link to="/seller-dashboard" className="nav-link">
                <FiGrid size={14} /> Dashboard
              </Link>
            )}
          </div>

          {token ? (
            <button className="nav-user-pill" onClick={handleLogout}>
              <FiLogOut size={13} />
              <div className="nav-avatar">
                {user?.username?.[0]?.toUpperCase() || <FiUser size={13} />}
              </div>
            </button>
          ) : (
            <Link to="/auth" className="nav-signin">
              <FiUser size={14} /> Sign in
            </Link>
          )}
        </nav>

        {/* ════ HERO ════ */}
        <div className="hero">
          <div className="hero-bg">
            {bgImages.map((img, i) => (
              <div
                key={i}
                className={`hero-bg-img ${i === bgIdx ? "active" : "inactive"}`}
                style={{ backgroundImage: `url(${img})` }}
              />
            ))}
            <div className="hero-overlay" />
            <div className="hero-grain" />
          </div>

          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              className="hero-dest-strip"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .2, duration: .5 }}
            >
              {["Maldives", "Paris", "Bali", "Tokyo", "Santorini"].map(d => (
                <button
                  key={d}
                  className="dest-chip"
                  onClick={() => { setSearch(d); fetchHotels(); }}
                >
                  <span className="dot" />
                  {d}
                </button>
              ))}
            </motion.div>

            <motion.div
              className={`search-shell ${searchFocused ? "focused" : ""}`}
              initial={{ opacity: 0, y: 20, scale: .97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: .3, duration: .55 }}
            >
              <form onSubmit={handleSearch}>
                <div className="seg" onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}>
                  <label className="seg-label">Where to?</label>
                  <input className="seg-input" placeholder="Search destinations" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="seg" onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}>
                  <label className="seg-label">Check-in</label>
                  <input type="date" className="seg-input" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                </div>
                <div className="seg" onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}>
                  <label className="seg-label">Check-out</label>
                  <input type="date" className="seg-input" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                </div>
                <button type="submit" className="search-btn">
                  <FiSearch size={16} /> Search
                </button>
              </form>
            </motion.div>
          </motion.div>

          <div className="hero-scroll-cue">
            <div className="scroll-line" />
            Scroll
          </div>
        </div>

        {/* ════ MOOD BAR ════ */}
        <div className="mood-bar">
          <div className="mood-inner">
            <div className="mood-scroll">
              {moods.map(m => (
                <button
                  key={m.key}
                  className={`mood-tab ${activeCategory === m.key ? "active" : ""}`}
                  onClick={() => setActiveCat(m.key)}
                >
                  <span className="mood-emoji">{m.emoji}</span>
                  <span className="mood-label">{m.label}</span>
                </button>
              ))}
            </div>

            <div className="sort-wrap" ref={sortRef}>
              <button className="sort-btn" onClick={() => setShowSort(s => !s)}>
                <FiSliders size={14} />
                Sort
                <FiChevronDown size={12} style={{ transition: "transform .2s", transform: showSort ? "rotate(180deg)" : "none" }} />
              </button>
              <AnimatePresence>
                {showSort && (
                  <motion.div
                    className="sort-menu"
                    initial={{ opacity: 0, y: -8, scale: .96 }}
                    animate={{ opacity: 1, y: 0,  scale: 1  }}
                    exit   ={{ opacity: 0, y: -8, scale: .96 }}
                    transition={{ duration: .16 }}
                  >
                    {sortOptions.map(opt => (
                      <button
                        key={opt.key}
                        className={`sort-opt ${sort === opt.key ? "active" : ""}`}
                        onClick={() => { setSort(opt.key); setShowSort(false); }}
                      >
                        {opt.label}
                        {sort === opt.key && (
                          <div className="sort-tick">
                            <svg viewBox="0 0 12 12" className="sort-tick-icon">
                              <polyline points="2,6 5,9 10,3" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ════ HOTEL GRID ════ */}
        <div className="section">
          <div className="section-top">
            <h2 className="section-heading">
              {activeCategory === "all"
                ? <>Places people <em>love</em></>
                : <>{moods.find(m => m.key === activeCategory)?.emoji} {moods.find(m => m.key === activeCategory)?.label} Stays</>
              }
            </h2>
            {!loading && hotels.length > 0 && (
              <span className="section-count">{hotels.length} {hotels.length === 1 ? "property" : "properties"}</span>
            )}
          </div>

          {loading ? (
            <div className="hotel-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="sk" style={{ animationDelay: `${i * .06}s` }}>
                  <div className="sk-box" />
                  <div className="sk-line" style={{ width: "65%" }} />
                  <div className="sk-line" style={{ width: "42%" }} />
                </div>
              ))}
            </div>
          ) : hotels.length === 0 ? (
            <div className="hotel-grid">
              <motion.div className="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="empty-icon">🔍</div>
                <h3>No stays found</h3>
                <p>Try a different category or search term</p>
              </motion.div>
            </div>
          ) : (
            <motion.div className="hotel-grid" variants={stagger} initial="hidden" animate="show">
              {hotels.map((hotel, idx) => {
                const img = hotel.images?.[0]?.url || fallbacks[idx % fallbacks.length];
                const isFav = favorites.includes(hotel._id);
                return (
                  <motion.div key={hotel._id} className="hcard" variants={fadeUp}>
                    <TiltCard>
                      <Link to={`/hotel/${hotel._id}`} className="hcard-inner">
                        <div className="hcard-img">
                          <img src={img} alt={hotel.name} loading="lazy" />
                          <div className="hcard-overlay" />
                          <span className="badge-cat">{hotel.category}</span>
                          <div className="hcard-quick">
                            View details <FiArrowRight size={12} />
                          </div>
                        </div>

                        <div className="hcard-body">
                          <div className="hcard-row">
                            <h3 className="hcard-name">{hotel.name}</h3>
                            <div className="hcard-rating">
                              <FiStar size={11} fill="currentColor" />
                              {hotel.rating?.toFixed(1) || "New"}
                            </div>
                          </div>
                          <p className="hcard-loc">
                            <FiMapPin size={11} /> {hotel.location}
                          </p>
                          <div className="hcard-foot">
                            <div className="hcard-price">
                              <b>₹{hotel.pricePerNight?.toLocaleString()}</b>
                              <span> / night</span>
                            </div>
                            {hotel.availableRooms > 0 ? (
                              <span className={`avail-pill ${hotel.availableRooms <= 3 ? "avail-low" : "avail-ok"}`}>
                                {hotel.availableRooms <= 3 ? `Only ${hotel.availableRooms} left` : `${hotel.availableRooms} rooms`}
                              </span>
                            ) : (
                              <span className="avail-pill avail-sold">Sold out</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </TiltCard>

                    <button
                      className={`badge-fav ${isFav ? "active" : ""}`}
                      onClick={e => { e.preventDefault(); toggleFav(hotel._id); }}
                      aria-label="Save"
                    >
                      <FiHeart size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

      </div>
    </>
  );
}