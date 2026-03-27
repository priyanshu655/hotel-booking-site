import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  FiSearch, FiMapPin, FiStar, FiSliders, FiHeart,
  FiLogOut, FiUser, FiCalendar, FiPlus, FiChevronDown, FiArrowRight, FiGrid, FiX,
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

const bgImages = [
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=80",
  "https://images.unsplash.com/photo-1455587734955-081b22074882?w=1600&q=80",
];

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
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}>
      {children}
    </motion.div>
  );
};

/* ══════════════════════════════════════
   iPhone-style draggable floating ball
══════════════════════════════════════ */
const TouchBall = ({ token, user, onLogout }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: window.innerWidth - 68, y: window.innerHeight - 160 });
  const dragging = useRef(false);
  const startRef = useRef({});
  const ballRef  = useRef(null);

  const onTouchStart = (e) => {
    dragging.current = false;
    startRef.current = {
      ox: e.touches[0].clientX - pos.x,
      oy: e.touches[0].clientY - pos.y,
      sx: e.touches[0].clientX,
      sy: e.touches[0].clientY,
    };
  };
  const onTouchMove = (e) => {
    e.preventDefault();
    const dx = Math.abs(e.touches[0].clientX - startRef.current.sx);
    const dy = Math.abs(e.touches[0].clientY - startRef.current.sy);
    if (dx > 6 || dy > 6) dragging.current = true;
    const nx = e.touches[0].clientX - startRef.current.ox;
    const ny = e.touches[0].clientY - startRef.current.oy;
    setPos({
      x: Math.max(4, Math.min(nx, window.innerWidth  - 56)),
      y: Math.max(4, Math.min(ny, window.innerHeight - 56)),
    });
  };
  const onTouchEnd = () => {
    if (!dragging.current) {
      setOpen(o => !o);
    } else {
      setPos(p => ({
        x: p.x + 28 < window.innerWidth / 2 ? 8 : window.innerWidth - 60,
        y: p.y,
      }));
    }
  };

  useEffect(() => {
    if (!open) return;
    const fn = (e) => {
      if (ballRef.current && !ballRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("touchstart", fn, { passive: true });
    document.addEventListener("mousedown", fn);
    return () => {
      document.removeEventListener("touchstart", fn);
      document.removeEventListener("mousedown", fn);
    };
  }, [open]);

  const menuItems = [
    ...(!token ? [{ icon: <FiUser size={15}/>, label: "Sign In", to: "/auth" }] : []),
    ...(token ? [
      { icon: <FiCalendar size={15}/>, label: "My Bookings", to: "/bookings" },
      { icon: <FiMapPin size={15}/>,   label: "Trip Planner", to: "/trip-planner" },
    ] : []),
    ...(token && (user?.role === "seller" || user?.role === "admin") ? [
      { icon: <FiPlus size={15}/>, label: "List Hotel",  to: "/add-hotel" },
      { icon: <FiGrid size={15}/>, label: "Dashboard",   to: "/seller-dashboard" },
    ] : []),
    ...(token ? [{ icon: <FiLogOut size={15}/>, label: "Logout", danger: true, action: onLogout }] : []),
  ];

  const snapLeft = pos.x + 28 < window.innerWidth / 2;

  return (
    <div
      ref={ballRef}
      style={{ position: "fixed", left: pos.x, top: pos.y, zIndex: 9999, touchAction: "none", userSelect: "none" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 12 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit  ={{ opacity: 0, scale: 0.8,   y: 12 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            style={{
              position: "absolute",
              bottom: 62,
              [snapLeft ? "left" : "right"]: 0,
              width: 220,
              background: "rgba(13,13,20,0.94)",
              backdropFilter: "blur(28px) saturate(2)",
              borderRadius: 22,
              padding: "8px 6px 10px",
              boxShadow: "0 24px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,0.07)",
            }}
          >
            <div style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "8px 12px 12px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              marginBottom: 6,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: "#FF385C", display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: 14, color: "white", fontFamily: "Georgia, serif",
              }}>P</div>
              <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>planora</span>
              {token && user?.username && (
                <span style={{ marginLeft: "auto", fontSize: 10.5, color: "rgba(255,255,255,0.38)", fontWeight: 500, maxWidth: 70, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.username}
                </span>
              )}
            </div>

            {menuItems.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: snapLeft ? -12 : 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {item.to ? (
                  <Link to={item.to} onClick={() => setOpen(false)} style={{
                    display: "flex", alignItems: "center", gap: 11,
                    padding: "11px 14px", borderRadius: 13,
                    color: item.danger ? "#FF385C" : "rgba(255,255,255,0.85)",
                    fontSize: 13.5, fontWeight: 600, textDecoration: "none",
                    transition: "background 0.15s",
                  }}
                    onTouchStart={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                    onTouchEnd={e => e.currentTarget.style.background = "transparent"}
                  >
                    {item.icon}{item.label}
                  </Link>
                ) : (
                  <button onClick={() => { setOpen(false); item.action?.(); }} style={{
                    display: "flex", alignItems: "center", gap: 11, width: "100%",
                    padding: "11px 14px", borderRadius: 13, border: "none", background: "none",
                    color: item.danger ? "#FF385C" : "rgba(255,255,255,0.85)",
                    fontSize: 13.5, fontWeight: 600, cursor: "pointer", textAlign: "left",
                  }}>
                    {item.icon}{item.label}
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ scale: open ? 0.9 : 1 }}
        style={{
          width: 52, height: 52, borderRadius: "50%",
          background: open ? "rgba(13,13,20,0.96)" : "rgba(255,255,255,0.16)",
          backdropFilter: "blur(22px) saturate(2)",
          border: `1.5px solid ${open ? "rgba(255,56,92,0.55)" : "rgba(255,255,255,0.32)"}`,
          boxShadow: open
            ? "0 0 0 5px rgba(255,56,92,0.12), 0 8px 28px rgba(0,0,0,0.35)"
            : "0 6px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 4.5, cursor: "pointer",
          transition: "background 0.25s, border 0.25s, box-shadow 0.25s",
        }}
      >
        {open ? (
          <FiX size={19} color="white" />
        ) : (
          <>
            <span style={{ display: "block", width: 19, height: 1.8, background: "rgba(255,255,255,0.9)", borderRadius: 2 }} />
            <span style={{ display: "block", width: 13, height: 1.8, background: "rgba(255,255,255,0.9)", borderRadius: 2 }} />
            <span style={{ display: "block", width: 19, height: 1.8, background: "rgba(255,255,255,0.9)", borderRadius: 2 }} />
          </>
        )}
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════
   Main Page
══════════════════════════════════════ */
export default function HomePage() {
  const [hotels, setHotels]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [checkIn, setCheckIn]           = useState("");
  const [checkOut, setCheckOut]         = useState("");
  const [activeCategory, setActiveCat]  = useState("all");
  const [sort, setSort]                 = useState("newest");
  const [showSort, setShowSort]         = useState(false);
  const [scrolled, setScrolled]         = useState(false);
  const [bgIdx, setBgIdx]               = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMobile, setIsMobile]         = useState(() => window.innerWidth <= 768);
  const [favorites, setFavorites]       = useState(() => {
    try { return JSON.parse(localStorage.getItem("planora_favs")) || []; } catch { return []; }
  });
  const [filteredHotels, setFilteredHotels] = useState([]);

  const sortRef  = useRef(null);
  const navigate = useNavigate();
  const token    = localStorage.getItem("token");
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("planora_user")); } catch { return null; }
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setBgIdx(i => (i + 1) % bgImages.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { fetchHotels(); }, [activeCategory]);

  useEffect(() => {
    if (token && !user) {
      axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => { if (r.data) { setUser(r.data); localStorage.setItem("planora_user", JSON.stringify(r.data)); } })
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

  /* ── filter + sort runs whenever hotels list, search query, or sort changes ── */
  useEffect(() => {
    let results = [...hotels];

    // client-side search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      results = results.filter(h =>
        h.name?.toLowerCase().includes(q) ||
        h.city?.toLowerCase().includes(q) ||
        h.location?.toLowerCase().includes(q)
      );
    }

    // client-side sort
    switch (sort) {
      case "price_asc":
        results.sort((a, b) => (a.pricePerNight ?? a.price ?? 0) - (b.pricePerNight ?? b.price ?? 0));
        break;
      case "price_desc":
        results.sort((a, b) => (b.pricePerNight ?? b.price ?? 0) - (a.pricePerNight ?? a.price ?? 0));
        break;
      case "rating":
        results.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "newest":
      default:
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredHotels(results);
  }, [search, sort, hotels]);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeCategory !== "all") params.category = activeCategory;
      if (checkIn)  params.checkIn  = checkIn;
      if (checkOut) params.checkOut = checkOut;
      const res = await axios.get(`${API}/hotels`, { params });
      setHotels(res.data);
    } catch {
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  /* FIX: handleSearch no longer calls undefined setSearchQuery.
     The form submit just prevents default; live filtering is driven by
     the useEffect above that watches `search`. */
  const handleSearch = (e) => {
    e.preventDefault();
    // filtering happens reactively via useEffect — nothing extra needed
  };

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
        body {
          font-family: var(--font); background: var(--bg); color: var(--slate);
          -webkit-font-smoothing: antialiased; overflow-x: hidden;
        }
        * { font-family: var(--font); }
        a { text-decoration: none; color: inherit; }

        /* ════ NAVBAR ════ */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 500;
          padding: 0 32px; height: 68px;
          display: flex; align-items: center; justify-content: space-between;
          transition: background .4s, box-shadow .4s;
        }
        .nav.solid {
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(24px) saturate(1.6);
          box-shadow: 0 1px 0 var(--border), 0 4px 20px rgba(0,0,0,0.06);
        }
        .nav.transparent { background: transparent; }

        .brand { display: flex; align-items: center; gap: 10px; }
        .brand-mark {
          width: 36px; height: 36px; border-radius: 11px;
          background: var(--coral); color: white;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-size: 19px; font-weight: 800;
          box-shadow: 0 4px 14px rgba(255,56,92,.4); flex-shrink: 0;
        }
        .brand-name {
          font-family: var(--font-display); font-size: 21px; font-weight: 700;
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
          width: 30px; height: 30px; border-radius: 50%;
          background: var(--slate); color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700;
        }
        .nav-signin {
          display: flex; align-items: center; gap: 8px;
          border: 1.5px solid rgba(0,0,0,.13); border-radius: 100px;
          padding: 10px 20px; font-size: 13.5px; font-weight: 700; color: var(--slate);
          background: var(--surface); transition: box-shadow .2s;
        }
        .nav-signin:hover { box-shadow: 0 4px 20px rgba(0,0,0,.12); }
        .nav.transparent .nav-signin {
          background: rgba(255,255,255,.14); border-color: rgba(255,255,255,.35);
          color: white; backdrop-filter: blur(12px);
        }

        /* ════ HERO ════ */
        .hero {
          position: relative; height: 100svh; min-height: 580px;
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
          background: linear-gradient(to bottom, rgba(5,10,20,.28) 0%, rgba(5,10,20,.5) 45%, rgba(5,10,20,.75) 100%);
        }
        .hero-grain {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: .45;
        }
        .hero-content {
          position: relative; z-index: 2;
          display: flex; flex-direction: column; align-items: center;
          width: 100%; padding: 0 20px; text-align: center; gap: 0;
        }
        .hero-dest-strip {
          display: flex; gap: 8px; margin-bottom: 32px; flex-wrap: wrap; justify-content: center;
        }
        .dest-chip {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,.14); backdrop-filter: blur(14px) saturate(1.4);
          border: 1px solid rgba(255,255,255,.22); border-radius: 100px;
          padding: 7px 14px; font-size: 12.5px; font-weight: 600; color: white;
          cursor: pointer; transition: background .2s, transform .2s;
        }
        .dest-chip:hover { background: rgba(255,255,255,.22); transform: translateY(-2px); }
        .dest-chip .dot { width: 6px; height: 6px; border-radius: 50%; background: #34D399; flex-shrink: 0; }

        /* ── SEARCH SHELL ── */
        .search-shell {
          background: var(--surface); border-radius: 20px;
          box-shadow: 0 24px 60px rgba(0,0,0,.22), 0 4px 16px rgba(0,0,0,.1);
          width: 100%; max-width: 780px;
          border: 1.5px solid rgba(255,255,255,.8);
          transition: box-shadow .3s, transform .3s; overflow: hidden;
        }
        .search-shell.focused {
          box-shadow: 0 32px 72px rgba(0,0,0,.28), 0 0 0 3px rgba(255,56,92,.2);
          transform: translateY(-3px);
        }
        .search-shell form {
          display: flex; align-items: stretch; width: 100%;
        }
        /* FIX: search-bar-field — the main text input segment */
        .search-bar-field {
          flex: 2; padding: 18px 20px 16px;
          border-right: 1px solid rgba(0,0,0,.07);
          display: flex; align-items: center; gap: 10px;
          transition: background .15s; cursor: text; min-width: 0;
        }
        .search-bar-field:hover { background: rgba(0,0,0,.02); }
        .search-bar-field input {
          border: none; outline: none; background: none; flex: 1;
          font-family: var(--font); font-size: 14px; font-weight: 500; color: var(--slate);
        }
        .search-bar-field input::placeholder { color: var(--muted); font-weight: 400; }
        .search-bar-icon { color: var(--muted); flex-shrink: 0; }

        .seg {
          flex: 1; padding: 18px 20px 16px;
          border-right: 1px solid rgba(0,0,0,.07);
          display: flex; flex-direction: column; gap: 4px;
          transition: background .15s; cursor: text; min-width: 0;
        }
        .seg:last-of-type { border-right: none; }
        .seg:hover { background: rgba(0,0,0,.02); }
        .seg-label { font-size: 10px; font-weight: 800; color: var(--slate); letter-spacing: .5px; text-transform: uppercase; }
        .seg-input {
          border: none; outline: none; background: none;
          font-family: var(--font); font-size: 14px; font-weight: 500; color: var(--slate); width: 100%;
        }
        .seg-input::placeholder { color: var(--muted); font-weight: 400; }
        .search-btn {
          margin: 10px; padding: 0 22px; flex-shrink: 0;
          background: linear-gradient(135deg, #FF385C 0%, #D70466 100%);
          border: none; border-radius: 12px; color: white; cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font); font-size: 14px; font-weight: 700;
          box-shadow: 0 4px 16px rgba(255,56,92,.45);
          transition: transform .2s, filter .2s;
        }
        .search-btn:hover { transform: scale(1.04); filter: brightness(1.06); }

        .hero-scroll-cue {
          position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
          z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: rgba(255,255,255,.55); font-size: 10px; font-weight: 600;
          letter-spacing: .6px; text-transform: uppercase;
        }
        .scroll-line {
          width: 1px; height: 36px;
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
          position: sticky; top: 68px; z-index: 300;
        }
        .mood-inner {
          max-width: 1340px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center;
        }
        .mood-scroll { display: flex; flex: 1; overflow-x: auto; scrollbar-width: none; }
        .mood-scroll::-webkit-scrollbar { display: none; }
        .mood-tab {
          display: flex; flex-direction: column; align-items: center; gap: 5px;
          padding: 14px 22px 12px; border: none; background: none;
          border-bottom: 2.5px solid transparent; cursor: pointer;
          font-family: var(--font); color: var(--muted); white-space: nowrap; flex-shrink: 0;
          transition: color .18s, border-color .18s;
        }
        .mood-tab:hover { color: var(--slate-2); border-bottom-color: rgba(0,0,0,.15); }
        .mood-tab.active { color: var(--slate); border-bottom-color: var(--slate); }
        .mood-emoji { font-size: 20px; line-height: 1; }
        .mood-label { font-size: 10.5px; font-weight: 700; letter-spacing: .3px; }

        .sort-wrap { position: relative; flex-shrink: 0; padding: 10px 0; }
        .sort-btn {
          display: flex; align-items: center; gap: 6px;
          border: 1.5px solid var(--border); border-radius: 10px;
          padding: 8px 14px; font-family: var(--font); font-size: 13px;
          font-weight: 600; color: var(--slate-2); background: var(--surface);
          cursor: pointer; transition: box-shadow .18s;
        }
        .sort-btn:hover { box-shadow: 0 2px 10px rgba(0,0,0,.09); }
        .sort-menu {
          position: absolute; right: 0; top: calc(100% + 6px);
          background: var(--surface); border: 1px solid rgba(0,0,0,.08);
          border-radius: 16px; box-shadow: 0 12px 40px rgba(0,0,0,.14);
          min-width: 195px; padding: 6px; z-index: 100;
        }
        .sort-opt {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; text-align: left; padding: 10px 13px; border: none;
          background: none; font-family: var(--font); font-size: 13.5px;
          color: var(--slate-2); cursor: pointer; border-radius: 10px; transition: background .15s;
        }
        .sort-opt:hover { background: var(--bg); color: var(--slate); }
        .sort-opt.active { color: var(--coral); font-weight: 700; }
        .sort-tick {
          width: 20px; height: 20px; border-radius: 50%;
          background: var(--coral); display: flex; align-items: center; justify-content: center;
        }
        .sort-tick-icon { width: 11px; height: 11px; stroke: white; stroke-width: 2.5; fill: none; }

        /* ════ SECTION ════ */
        .section { max-width: 1340px; margin: 0 auto; padding: 48px 24px 80px; }
        .section-top {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 32px; gap: 16px;
        }
        .section-heading {
          font-family: var(--font-display); font-size: clamp(24px, 3.5vw, 36px);
          font-weight: 700; letter-spacing: -0.5px; color: var(--slate); line-height: 1.15;
        }
        .section-heading em { font-style: italic; color: var(--coral); }
        .section-count { font-size: 13px; color: var(--muted); font-weight: 500; white-space: nowrap; }

        /* ════ CARD GRID ════ */
        .hotel-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; align-items: start; }

        /* ── CARD ── */
        /* FIX: hcard wraps both the image and the fav button together */
        .hcard {
          position: relative; display: flex; flex-direction: column;
          text-decoration: none; color: inherit;
        }
        .hcard-img {
          position: relative; aspect-ratio: 3/2;
          border-radius: 16px; overflow: hidden; background: #E5E7EB; flex-shrink: 0;
        }
        .hcard-img img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform .65s cubic-bezier(.25,.46,.45,.94);
        }
        .hcard:hover .hcard-img img { transform: scale(1.06); }
        .hcard-overlay {
          position: absolute; inset: 0; border-radius: 16px;
          background: linear-gradient(to top, rgba(0,0,0,.65) 0%, rgba(0,0,0,.12) 45%, transparent 70%);
          opacity: 0; transition: opacity .3s;
        }
        .hcard:hover .hcard-overlay { opacity: 1; }
        .hcard-quick {
          position: absolute; bottom: 14px; left: 50%;
          transform: translateX(-50%) translateY(10px);
          display: flex; align-items: center; gap: 6px; white-space: nowrap;
          background: white; color: var(--slate); border-radius: 100px;
          padding: 9px 18px; font-size: 12.5px; font-weight: 700;
          box-shadow: 0 6px 20px rgba(0,0,0,.18);
          opacity: 0; transition: opacity .25s, transform .25s; pointer-events: none;
        }
        .hcard:hover .hcard-quick { opacity: 1; transform: translateX(-50%) translateY(0); pointer-events: auto; }

        .badge-cat {
          position: absolute; top: 12px; left: 12px; z-index: 2;
          background: rgba(255,255,255,.93); backdrop-filter: blur(10px);
          color: var(--slate); font-size: 10px; font-weight: 800;
          padding: 4px 10px; border-radius: 100px; text-transform: uppercase; letter-spacing: .5px;
        }
        /* FIX: badge-fav is now inside .hcard-img so it overlays the image correctly */
        .badge-fav {
          position: absolute; top: 12px; right: 12px; z-index: 3;
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(255,255,255,.85); backdrop-filter: blur(10px);
          border: none; cursor: pointer; padding: 0;
          display: flex; align-items: center; justify-content: center;
          color: rgba(0,0,0,.35); transition: transform .2s, background .2s, color .2s;
          box-shadow: 0 2px 8px rgba(0,0,0,.1);
        }
        .badge-fav:hover  { transform: scale(1.12); background: white; color: var(--coral); }
        .badge-fav.active { color: var(--coral); background: white; }
        .badge-fav.active svg { fill: var(--coral); }

        .hcard-body { padding: 13px 2px 2px; display: flex; flex-direction: column; flex: 1; }
        .hcard-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 5px; }
        .hcard-name { font-size: 14px; font-weight: 700; color: var(--slate); letter-spacing: -0.1px; line-height: 1.4; flex: 1; min-width: 0; }
        .hcard-rating {
          display: flex; align-items: center; gap: 4px;
          background: #FFF7ED; border: 1px solid #FED7AA;
          border-radius: 8px; padding: 3px 8px;
          font-size: 12px; font-weight: 700; color: #92400E; flex-shrink: 0;
        }
        .hcard-loc {
          display: flex; align-items: center; gap: 4px;
          font-size: 12.5px; color: var(--muted); font-weight: 500; margin-bottom: 12px;
        }
        .hcard-foot {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 10px; border-top: 1px solid rgba(0,0,0,.06); margin-top: auto; gap: 8px;
        }
        .hcard-price { font-size: 13.5px; color: var(--slate); line-height: 1; }
        .hcard-price b { font-weight: 800; font-size: 15px; }
        .hcard-price span { color: var(--muted); font-size: 12px; font-weight: 400; }
        .avail-pill { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; white-space: nowrap; flex-shrink: 0; }
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

        /* ── no-results (search specific) ── */
        .no-results {
          grid-column: 1 / -1; text-align: center; padding: 60px 24px;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .no-results-icon { font-size: 40px; }
        .no-results h3 { font-size: 18px; font-weight: 700; color: var(--slate); }
        .no-results p  { font-size: 14px; color: var(--muted); }
        .no-results button {
          margin-top: 4px; padding: 10px 22px; border-radius: 100px;
          background: var(--coral); color: white; border: none;
          font-family: var(--font); font-size: 13.5px; font-weight: 700;
          cursor: pointer; transition: filter .2s;
        }
        .no-results button:hover { filter: brightness(1.08); }

        /* ════ RESPONSIVE ════ */
        @media (max-width: 1200px) {
          .hotel-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 900px) {
          .hotel-grid { grid-template-columns: repeat(2, 1fr); gap: 18px; }
          .section { padding: 32px 18px 72px; }
          .mood-inner { padding: 0 14px; }
          .mood-tab { padding: 13px 18px 11px; }
        }

        /* ── MOBILE ≤ 768px ── */
        @media (max-width: 768px) {
          .nav-links, .nav-user-pill, .nav-signin { display: none !important; }
          .nav { padding: 0 16px; height: 60px; }
          .mood-bar { top: 60px; }

          .hero-dest-strip { gap: 6px; margin-bottom: 22px; }
          .dest-chip { font-size: 12px; padding: 6px 12px; }
          .hero-content { padding: 0 16px; }

          /* search becomes vertical on mobile */
          .search-shell { border-radius: 16px; }
          .search-shell form { flex-direction: column; }
          .search-bar-field {
            border-right: none; border-bottom: 1px solid rgba(0,0,0,.07);
            padding: 14px 16px 12px;
          }
          .seg { border-right: none; border-bottom: 1px solid rgba(0,0,0,.07); padding: 14px 16px 12px; }
          .seg:last-of-type { border-bottom: none; }
          .search-btn { margin: 10px; border-radius: 12px; padding: 16px; justify-content: center; font-size: 15px; }

          .mood-inner { padding: 0 8px; }
          .mood-tab { padding: 11px 14px 9px; }
          .mood-label { font-size: 10px; }

          .hotel-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .section { padding: 22px 12px 100px; }
          .section-top { margin-bottom: 18px; }
          .section-heading { font-size: 20px; }
          .hcard-name { font-size: 12.5px; }
          .hcard-price b { font-size: 13px; }
          .hcard-loc { font-size: 11px; margin-bottom: 9px; }
          .hcard-body { padding: 10px 1px 2px; }
          .avail-pill { font-size: 10px; padding: 3px 7px; }
          .hcard-rating { font-size: 11px; padding: 2px 7px; }
          .hero-scroll-cue { display: none; }
        }

        @media (max-width: 380px) {
          .hotel-grid { grid-template-columns: 1fr; }
          .hero-dest-strip { display: none; }
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
            {token && <Link to="/bookings"        className="nav-link"><FiCalendar size={14}/> My Bookings</Link>}
            {token && <Link to="/trip-planner"    className="nav-link"><FiMapPin   size={14}/> Trip Planner</Link>}
            {token && (user?.role === "seller" || user?.role === "admin") && (
              <Link to="/add-hotel"         className="nav-link"><FiPlus size={14}/> List Hotel</Link>
            )}
            {token && (user?.role === "seller" || user?.role === "admin") && (
              <Link to="/seller-dashboard"  className="nav-link"><FiGrid size={14}/> Dashboard</Link>
            )}
          </div>

          {token ? (
            <button className="nav-user-pill" onClick={handleLogout}>
              <FiLogOut size={13}/>
              <div className="nav-avatar">{user?.username?.[0]?.toUpperCase() || <FiUser size={13}/>}</div>
            </button>
          ) : (
            <Link to="/auth" className="nav-signin"><FiUser size={14}/> Sign in</Link>
          )}
        </nav>

        {/* ════ TOUCH BALL (mobile only) ════ */}
        {isMobile && <TouchBall token={token} user={user} onLogout={handleLogout} />}

        {/* ════ HERO ════ */}
        <div className="hero">
          <div className="hero-bg">
            {bgImages.map((img, i) => (
              <div key={i} className={`hero-bg-img ${i === bgIdx ? "active" : "inactive"}`}
                style={{ backgroundImage: `url(${img})` }} />
            ))}
            <div className="hero-overlay" />
            <div className="hero-grain" />
          </div>

          <motion.div className="hero-content"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, ease: [0.25, 0.46, 0.45, 0.94] }}>

            <motion.div className="hero-dest-strip"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .2, duration: .5 }}>
              {["Maldives", "Paris", "Bali", "Tokyo", "Santorini"].map(d => (
                <button key={d} className="dest-chip" onClick={() => setSearch(d)}>
                  <span className="dot" />{d}
                </button>
              ))}
            </motion.div>

            {/* FIX: search form uses correct .search-bar-field class that now has CSS */}
            <motion.div className={`search-shell ${searchFocused ? "focused" : ""}`}
              initial={{ opacity: 0, y: 20, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: .3, duration: .55 }}>
              <form onSubmit={handleSearch}>
                <div className="search-bar-field" onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}>
                  <FiSearch size={18} className="search-bar-icon" />
                  <input
                    type="text"
                    placeholder="Search destinations or hotels…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
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
                  <FiSearch size={16}/> Search
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
                <button key={m.key} className={`mood-tab ${activeCategory === m.key ? "active" : ""}`}
                  onClick={() => setActiveCat(m.key)}>
                  <span className="mood-emoji">{m.emoji}</span>
                  <span className="mood-label">{m.label}</span>
                </button>
              ))}
            </div>
            <div className="sort-wrap" ref={sortRef}>
              <button className="sort-btn" onClick={() => setShowSort(s => !s)}>
                <FiSliders size={14}/> Sort
                <FiChevronDown size={12} style={{ transition: "transform .2s", transform: showSort ? "rotate(180deg)" : "none" }} />
              </button>
              <AnimatePresence>
                {showSort && (
                  <motion.div className="sort-menu"
                    initial={{ opacity: 0, y: -8, scale: .96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: .96 }}
                    transition={{ duration: .16 }}>
                    {sortOptions.map(opt => (
                      <button key={opt.key} className={`sort-opt ${sort === opt.key ? "active" : ""}`}
                        onClick={() => { setSort(opt.key); setShowSort(false); }}>
                        {opt.label}
                        {sort === opt.key && (
                          <div className="sort-tick">
                            <svg viewBox="0 0 12 12" className="sort-tick-icon"><polyline points="2,6 5,9 10,3"/></svg>
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
              {search.trim()
                ? <>Results for <em>"{search}"</em></>
                : activeCategory === "all"
                  ? <>Places people <em>love</em></>
                  : <>{moods.find(m => m.key === activeCategory)?.emoji} {moods.find(m => m.key === activeCategory)?.label} Stays</>
              }
            </h2>
            {!loading && (
              <span className="section-count">
                {filteredHotels.length} {filteredHotels.length === 1 ? "property" : "properties"}
              </span>
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
          ) : (
            <motion.div variants={stagger} initial="hidden" animate="show" className="hotel-grid">
              {filteredHotels.length === 0 ? (
                /* FIX: use filteredHotels for empty check, not raw hotels */
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>{search.trim() ? `No results for "${search}"` : "No stays found"}</h3>
                  <p>{search.trim() ? "Try a different name or city" : "Try a different category"}</p>
                  {search.trim() && (
                    <button onClick={() => setSearch("")}>Clear search</button>
                  )}
                </div>
              ) : (
                filteredHotels.map((hotel, i) => {
                  /* FIX: isFav was undefined — define it per card */
                  const isFav = favorites.includes(hotel._id);
                  return (
                    <motion.div variants={fadeUp} key={hotel._id}>
                      <TiltCard>
                        {/* FIX: hcard is the Link itself so hover CSS selectors work */}
                        <Link to={`/hotel/${hotel._id}`} className="hcard">
                          <div className="hcard-img">
                            <img
                              src={hotel.images?.[0]?.url || fallbacks[i % fallbacks.length]}
                              alt={hotel.name}
                              loading="lazy"
                            />
                            <div className="hcard-overlay" />
                            <span className="badge-cat">{hotel.category}</span>
                            {/* FIX: badge-fav inside hcard-img so it overlays correctly */}
                            <button
                              className={`badge-fav ${isFav ? "active" : ""}`}
                              onClick={e => { e.preventDefault(); toggleFav(hotel._id); }}
                              aria-label="Save"
                            >
                              <FiHeart size={14}/>
                            </button>
                            <div className="hcard-quick">View details <FiArrowRight size={12}/></div>
                          </div>
                          <div className="hcard-body">
                            <div className="hcard-row">
                              <h3 className="hcard-name">{hotel.name}</h3>
                              <div className="hcard-rating">
                                <FiStar size={11} fill="currentColor"/>
                                {hotel.rating?.toFixed(1) || "New"}
                              </div>
                            </div>
                            <p className="hcard-loc"><FiMapPin size={11}/> {hotel.location || hotel.city}</p>
                            <div className="hcard-foot">
                              <div className="hcard-price">
                                <b>₹{(hotel.pricePerNight ?? hotel.price)?.toLocaleString()}</b>
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
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
        </div>

      </div>
    </>
  );
}