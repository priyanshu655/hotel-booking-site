import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  FiMail, FiLock, FiUser, FiEye, FiEyeOff,
  FiArrowRight, FiMapPin, FiStar, FiCheck, FiShield, FiZap
} from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = "http://localhost:8080/api/auth";

/* ─────────────────────────────────────────────
   PLANE INTRO COMPONENT
───────────────────────────────────────────── */
function PlaneIntro({ onDone }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const [phase, setPhase] = useState("flying"); // flying | text | done

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");

    const W = canvas.width  = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    /* ── Flight path: cubic bezier points ── */
    const p0 = { x: -120,  y: H * 0.25 };          // enter left-top
    const p1 = { x: W * 0.25, y: H * 0.10 };       // arc up
    const p2 = { x: W * 0.65, y: H * 0.78 };       // swoop down
    const p3 = { x: W + 140,  y: H * 0.58 };       // exit right

    const cubicBezier = (t, p0, p1, p2, p3) => ({
      x: (1-t)**3*p0.x + 3*(1-t)**2*t*p1.x + 3*(1-t)*t**2*p2.x + t**3*p3.x,
      y: (1-t)**3*p0.y + 3*(1-t)**2*t*p1.y + 3*(1-t)*t**2*p2.y + t**3*p3.y,
    });
    const cubicBezierTangent = (t, p0, p1, p2, p3) => ({
      x: 3*(1-t)**2*(p1.x-p0.x) + 6*(1-t)*t*(p2.x-p1.x) + 3*t**2*(p3.x-p2.x),
      y: 3*(1-t)**2*(p1.y-p0.y) + 6*(1-t)*t*(p2.y-p1.y) + 3*t**2*(p3.y-p2.y),
    });

    /* Trail points captured during flight */
    const trail = [];

    let t = 0;
    const FLIGHT_DURATION = 2200; // ms
    let startTime = null;
    let done = false;

    /* ── Draw plane SVG path ── */
    const drawPlane = (cx, cy, angle) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.scale(1.4, 1.4);

      // Body
      ctx.beginPath();
      ctx.moveTo(30, 0);
      ctx.lineTo(-20, -10);
      ctx.lineTo(-28, 0);
      ctx.lineTo(-20, 10);
      ctx.closePath();
      ctx.fillStyle = "#FF385C";
      ctx.fill();

      // Wing top
      ctx.beginPath();
      ctx.moveTo(0, -2);
      ctx.lineTo(-10, -22);
      ctx.lineTo(-20, -20);
      ctx.lineTo(-12, -2);
      ctx.closePath();
      ctx.fillStyle = "#D70466";
      ctx.fill();

      // Wing bottom
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.lineTo(-10, 22);
      ctx.lineTo(-20, 20);
      ctx.lineTo(-12, 2);
      ctx.closePath();
      ctx.fillStyle = "#D70466";
      ctx.fill();

      // Tail
      ctx.beginPath();
      ctx.moveTo(-20, -2);
      ctx.lineTo(-28, -14);
      ctx.lineTo(-30, -12);
      ctx.lineTo(-22, 0);
      ctx.closePath();
      ctx.fillStyle = "#FF385C";
      ctx.fill();

      ctx.restore();
    };

    /* ── Draw dotted trail ── */
    const drawTrail = (progress) => {
      if (trail.length < 2) return;
      const maxPoints = trail.length;
      for (let i = 1; i < maxPoints; i++) {
        const alpha = (i / maxPoints) * 0.45;
        const size  = 1.5 + (i / maxPoints) * 2.5;
        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,56,92,${alpha})`;
        ctx.fill();
      }
    };

    /* ── Animate flight ── */
    const animateFlight = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      t = Math.min(elapsed / FLIGHT_DURATION, 1);

      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "#FBF9F6";
      ctx.fillRect(0, 0, W, H);

      // Dot grid
      ctx.fillStyle = "rgba(180,170,160,0.35)";
      for (let gx = 0; gx < W; gx += 26) {
        for (let gy = 0; gy < H; gy += 26) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const pos = cubicBezier(t, p0, p1, p2, p3);
      const tan = cubicBezierTangent(t, p0, p1, p2, p3);
      const angle = Math.atan2(tan.y, tan.x);

      trail.push({ x: pos.x, y: pos.y });
      // keep last 90 points
      if (trail.length > 90) trail.shift();

      drawTrail(t);
      drawPlane(pos.x, pos.y, angle);

      if (t < 1) {
        animRef.current = requestAnimationFrame(animateFlight);
      } else {
        // Flight done — draw long persistent trail and show text
        setPhase("text");
        drawTrail(1);
        done = true;
      }
    };

    animRef.current = requestAnimationFrame(animateFlight);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  /* After text phase, trigger auth page */
  useEffect(() => {
    if (phase === "text") {
      const t = setTimeout(() => {
        setPhase("done");
        setTimeout(onDone, 700);
      }, 1600);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  return (
    <motion.div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "#FBF9F6",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      animate={phase === "done" ? { opacity: 0, scale: 1.04 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* PLANORA text reveal after flight */}
      <AnimatePresence>
        {phase === "text" && (
          <motion.div
            style={{
              position: "relative", zIndex: 10,
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 16,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Letter-by-letter reveal */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {"planora".split("").map((ch, i) => (
                <motion.span
                  key={i}
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "clamp(52px, 10vw, 96px)",
                    fontWeight: 800,
                    color: i === 0 ? "#FF385C" : "#1C1917",
                    letterSpacing: "-3px",
                    lineHeight: 1,
                    display: "inline-block",
                  }}
                  initial={{ opacity: 0, y: 30, rotate: -8 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{
                    delay: i * 0.07,
                    duration: 0.45,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  {ch}
                </motion.span>
              ))}
            </div>

            {/* Tagline */}
            <motion.p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 15, fontWeight: 500,
                color: "#78716C", letterSpacing: "0.5px",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
            >
              your perfect stay awaits ✦
            </motion.p>

            {/* Coral underline sweep */}
            <motion.div
              style={{
                height: 3, borderRadius: 2,
                background: "linear-gradient(90deg, #FF385C, #D70466)",
                originX: 0,
              }}
              initial={{ scaleX: 0, width: "80%" }}
              animate={{ scaleX: 1, width: "80%" }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            />

            {/* Mini plane icon flying away */}
            <motion.div
              style={{ fontSize: 28, marginTop: 8 }}
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 80, opacity: [0, 1, 1, 0] }}
              transition={{ delay: 0.2, duration: 1.0, ease: "easeInOut" }}
            >
              ✈️
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   AUTH PAGE
───────────────────────────────────────────── */
function AuthPage() {
  const [isLogin, setIsLogin]           = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [role, setRole]                 = useState("user");
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const switchMode = () => {
    setIsLogin(v => !v);
    setForm({ username: "", email: "", password: "" });
    setRole("user");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await axios.post(`${API_BASE}/login`, { email: form.email, password: form.password });
        localStorage.setItem("token", res.data.token);
        if (res.data.user) localStorage.setItem("planora_user", JSON.stringify(res.data.user));
        toast.success("Welcome back!");
        navigate("/");
      } else {
        if (!form.username || !form.email || !form.password) {
          toast.error("Please fill in all fields"); setLoading(false); return;
        }
        await axios.post(`${API_BASE}/signup`, { username: form.username, email: form.email, password: form.password, role });
        toast.success("Account created! Please sign in.");
        setIsLogin(true);
        setForm({ username: "", email: "", password: "" });
        setRole("user");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      className="shell"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="shell-bg" />

      {[
        { cls: "bg-img-tl", src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300&q=60" },
        { cls: "bg-img-tr", src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&q=60" },
        { cls: "bg-img-bl", src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&q=60" },
        { cls: "bg-img-br", src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&q=60" },
      ].map(({ cls, src }) => (
        <div key={cls} className={`bg-img ${cls}`}><img src={src} alt="" /></div>
      ))}

      <nav className="nav">
        <Link to="/" className="nav-brand">
          <div className="nav-pip" />
          <span className="nav-name">planora</span>
        </Link>
        <div className="nav-right">
          <a href="#" className="nav-link">Explore</a>
          <button className="nav-pill" onClick={switchMode}>
            {isLogin ? "Create account" : "Sign in"}
          </button>
        </div>
      </nav>

      <div className="stage">
        {/* LEFT */}
        <motion.div className="side" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
          <div className="side-heading">Why Planora</div>
          {[
            { icon: <FiCheck size={13} strokeWidth={3} />, text: "No booking fees, ever" },
            { icon: <FiZap size={13} />, text: "Instant confirmation" },
            { icon: <FiShield size={13} />, text: "Free cancellation" },
          ].map(({ icon, text }, i) => (
            <motion.div key={i} className="perk"
              initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}>
              <div className="perk-icon">{icon}</div>
              <span className="perk-text">{text}</span>
            </motion.div>
          ))}
          <motion.div className="mini-review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.48 }}>
            <div className="mini-review-stars">
              {[...Array(5)].map((_, s) => <FiStar key={s} size={11} fill="var(--coral)" color="var(--coral)" />)}
            </div>
            <div className="mini-review-text">"Found the perfect Bali villa in under 2 minutes."</div>
            <div className="mini-review-author">
              <div className="mini-review-av">P</div>
              <div>
                <div className="mini-review-name">Priya S.</div>
                <div className="mini-review-loc">🇮🇳 Mumbai</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* FORM */}
        <motion.div className="form-card"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <div className="form-eyebrow">
            <div className="form-eyebrow-badge"><FiMapPin size={9} /> 2,400+ hotels worldwide</div>
          </div>
          <div className="mode-tabs">
            <button className={`mode-tab ${isLogin ? "active" : ""}`} onClick={() => { if (!isLogin) switchMode(); }}>Sign in</button>
            <button className={`mode-tab ${!isLogin ? "active" : ""}`} onClick={() => { if (isLogin) switchMode(); }}>Create account</button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={isLogin ? "l" : "s"}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <h2 className="form-heading">
                {isLogin ? <>Welcome <em>back</em></> : <>Join <em>Planora</em></>}
              </h2>
              <p className="form-sub">
                {isLogin ? "Sign in to access your bookings." : "Start discovering amazing stays today."}
              </p>
              <form onSubmit={handleSubmit}>
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div className="role-row"
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 14 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.2 }} style={{ overflow: "hidden" }}>
                      <button type="button" className={`role-btn ${role === "user" ? "active" : ""}`} onClick={() => setRole("user")}>🌍 Traveller</button>
                      <button type="button" className={`role-btn ${role === "seller" ? "active" : ""}`} onClick={() => setRole("seller")}>🏨 Host / Seller</button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="fields">
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} style={{ overflow: "hidden" }}>
                        <label className="field-label">Username</label>
                        <div className="field-wrap">
                          <span className="field-icon"><FiUser size={13} /></span>
                          <input className="field-input" type="text" name="username"
                            placeholder="johndoe" value={form.username} onChange={handleChange} autoComplete="username" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div>
                    <label className="field-label">Email</label>
                    <div className="field-wrap">
                      <span className="field-icon"><FiMail size={13} /></span>
                      <input className="field-input" type="email" name="email"
                        placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Password</label>
                    <div className="field-wrap">
                      <span className="field-icon"><FiLock size={13} /></span>
                      <input className="field-input" name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={isLogin ? "Your password" : "Min. 8 characters"}
                        value={form.password} onChange={handleChange} required
                        
                        style={{ paddingRight: 40 }} />
                      <button type="button" className="field-eye" onClick={() => setShowPassword(v => !v)}>
                        {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
                {isLogin && (
                  <div className="extras">
                    <label className="remember"><input type="checkbox" /> Remember me</label>
                    <a href="#" className="forgot">Forgot password?</a>
                  </div>
                )}
                <motion.button type="submit" className="submit-btn" disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.015 }} whileTap={{ scale: loading ? 1 : 0.984 }}>
                  {loading ? <span className="spinner" /> : <>{isLogin ? "Sign in" : "Create account"} <FiArrowRight size={14} /></>}
                </motion.button>
              </form>
              <div className="switch-row">
                {isLogin ? "No account?" : "Already a member?"}
                <button className="switch-btn" onClick={switchMode}>
                  {isLogin ? "Sign up free →" : "Sign in →"}
                </button>
              </div>
              <p className="terms">By continuing you agree to our <a href="#">Terms</a> and <a href="#">Privacy</a>.</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* RIGHT */}
        <motion.div className="side" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
          <div className="side-heading">By the numbers</div>
          {[
            { icon: "🏨", val: "2,400+", label: "Handpicked hotels" },
            { icon: "🌍", val: "190+",   label: "Countries" },
            { icon: "⭐", val: "98%",    label: "Guest satisfaction" },
          ].map(({ icon, val, label }, i) => (
            <motion.div key={i} className="stat-card"
              initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}>
              <div className="stat-icon">{icon}</div>
              <div>
                <div className="stat-val">{val}</div>
                <div className="stat-label">{label}</div>
              </div>
            </motion.div>
          ))}
          <motion.div className="perk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <div className="perk-icon"><FiMapPin size={13} /></div>
            <span className="perk-text">Verified listings only</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   ROOT — orchestrates intro → auth
───────────────────────────────────────────── */
export default function App() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Outfit:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --coral:        #FF385C;
          --coral-dark:   #D70466;
          --coral-soft:   #fff1f3;
          --coral-border: rgba(255,56,92,0.18);
          --bg:           #FBF9F6;
          --bg2:          #F2EDE8;
          --white:        #FFFFFF;
          --text:         #1C1917;
          --text-2:       #44403C;
          --text-3:       #78716C;
          --text-4:       #A8A29E;
          --border:       #E7E2DC;
          --font:         'Outfit', sans-serif;
          --serif:        'Cormorant Garamond', serif;
        }

        html, body { height: 100%; margin: 0; font-family: var(--font); background: var(--bg); -webkit-font-smoothing: antialiased; overflow: hidden; }

        /* AUTH SHELL */
        .shell {
          height: 100vh; display: flex; flex-direction: column;
          position: relative; overflow: hidden;
        }
        .shell-bg {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            radial-gradient(ellipse 55% 60% at 50% 50%, rgba(255,56,92,0.06) 0%, transparent 70%),
            radial-gradient(circle, #D8D3CC 1px, transparent 1px);
          background-size: 100% 100%, 26px 26px;
        }
        .bg-img { position: absolute; z-index: 0; border-radius: 18px; overflow: hidden; opacity: 0.13; pointer-events: none; }
        .bg-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .bg-img-tl { width: 200px; height: 140px; top: 60px; left: 24px; transform: rotate(-4deg); }
        .bg-img-tr { width: 170px; height: 120px; top: 80px; right: 28px; transform: rotate(3deg); }
        .bg-img-bl { width: 160px; height: 110px; bottom: 40px; left: 36px; transform: rotate(3deg); }
        .bg-img-br { width: 190px; height: 130px; bottom: 50px; right: 24px; transform: rotate(-3deg); }

        .nav { position: relative; z-index: 20; display: flex; align-items: center; justify-content: space-between; padding: 18px 40px; flex-shrink: 0; }
        .nav-brand { display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .nav-pip { width: 9px; height: 9px; border-radius: 50%; background: var(--coral); box-shadow: 0 0 0 3px rgba(255,56,92,0.18); }
        .nav-name { font-size: 16px; font-weight: 800; color: var(--text); letter-spacing: -0.4px; }
        .nav-right { display: flex; align-items: center; gap: 14px; }
        .nav-link { font-size: 13px; color: var(--text-3); font-weight: 500; text-decoration: none; }
        .nav-pill { font-family: var(--font); font-size: 12px; font-weight: 700; color: var(--coral); background: var(--coral-soft); border: 1px solid var(--coral-border); border-radius: 40px; padding: 7px 18px; cursor: pointer; transition: background .18s, box-shadow .18s; }
        .nav-pill:hover { background: #ffe4e9; box-shadow: 0 3px 12px rgba(255,56,92,0.2); }

        .stage { position: relative; z-index: 10; flex: 1; display: flex; align-items: center; justify-content: center; gap: 28px; padding: 0 40px 24px; min-height: 0; }

        .side { width: 210px; flex-shrink: 0; display: flex; flex-direction: column; gap: 12px; }
        .side-heading { font-size: 10px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: var(--coral); margin-bottom: 4px; }

        .perk { display: flex; align-items: center; gap: 10px; background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 11px 14px; box-shadow: 0 1px 8px rgba(0,0,0,0.04); }
        .perk-icon { width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0; background: var(--coral-soft); border: 1px solid var(--coral-border); display: flex; align-items: center; justify-content: center; color: var(--coral); }
        .perk-text { font-size: 12px; font-weight: 600; color: var(--text-2); line-height: 1.35; }

        .stat-card { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 12px 14px; box-shadow: 0 1px 8px rgba(0,0,0,0.04); display: flex; align-items: center; gap: 12px; }
        .stat-icon { width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0; background: var(--coral-soft); border: 1px solid var(--coral-border); display: flex; align-items: center; justify-content: center; font-size: 15px; }
        .stat-val { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--text); letter-spacing: -0.5px; line-height: 1; }
        .stat-label { font-size: 11px; color: var(--text-4); font-weight: 500; margin-top: 1px; }

        .mini-review { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 12px 14px; box-shadow: 0 1px 8px rgba(0,0,0,0.04); }
        .mini-review-stars { display: flex; gap: 2px; margin-bottom: 6px; }
        .mini-review-text { font-size: 12px; color: var(--text-2); line-height: 1.45; font-style: italic; }
        .mini-review-author { margin-top: 8px; display: flex; align-items: center; gap: 7px; }
        .mini-review-av { width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, var(--coral), var(--coral-dark)); color: white; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .mini-review-name { font-size: 11px; font-weight: 700; color: var(--text-3); }
        .mini-review-loc  { font-size: 10px; color: var(--text-4); }

        .form-card { width: 100%; max-width: 400px; flex-shrink: 0; background: var(--white); border: 1px solid var(--border); border-radius: 28px; padding: 30px 30px 24px; box-shadow: 0 12px 50px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.04); position: relative; }
        .form-card::before { content: ''; position: absolute; top: 0; left: 28px; right: 28px; height: 3px; border-radius: 0 0 3px 3px; background: linear-gradient(90deg, var(--coral) 0%, var(--coral-dark) 100%); }

        .form-eyebrow { display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 16px; }
        .form-eyebrow-badge { display: inline-flex; align-items: center; gap: 5px; background: var(--coral-soft); border: 1px solid var(--coral-border); border-radius: 40px; padding: 4px 12px; font-size: 11px; font-weight: 600; color: var(--coral); }

        .mode-tabs { display: flex; background: var(--bg2); border: 1px solid var(--border); border-radius: 13px; padding: 3px; margin-bottom: 20px; }
        .mode-tab { flex: 1; padding: 9px 10px; border: none; border-radius: 10px; font-family: var(--font); font-size: 13px; font-weight: 700; cursor: pointer; background: none; color: var(--text-3); transition: all .2s; }
        .mode-tab.active { background: var(--white); color: var(--text); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }

        .form-heading { font-family: var(--serif); font-size: 28px; font-weight: 700; color: var(--text); letter-spacing: -0.5px; line-height: 1.1; margin-bottom: 3px; }
        .form-heading em { font-style: italic; color: var(--coral); }
        .form-sub { font-size: 12.5px; color: var(--text-3); margin-bottom: 18px; line-height: 1.5; }

        .role-row { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
        .role-btn { border: 1.5px solid var(--border); border-radius: 11px; padding: 9px 8px; background: var(--bg2); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; font-family: var(--font); font-size: 12px; font-weight: 700; color: var(--text-3); transition: all .2s; }
        .role-btn:hover { border-color: var(--coral-border); background: var(--coral-soft); }
        .role-btn.active { border-color: var(--coral); background: var(--coral-soft); color: var(--coral); box-shadow: 0 0 0 3px rgba(255,56,92,0.09); }

        .fields { display: flex; flex-direction: column; gap: 10px; }
        .field-label { display: block; font-size: 10px; font-weight: 800; letter-spacing: 0.6px; text-transform: uppercase; color: var(--text-3); margin-bottom: 5px; }
        .field-wrap { position: relative; }
        .field-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-4); pointer-events: none; display: flex; transition: color .18s; }
        .field-wrap:focus-within .field-icon { color: var(--coral); }
        .field-input { width: 100%; padding: 11px 12px 11px 38px; background: var(--bg2); border: 1.5px solid var(--border); border-radius: 11px; font-family: var(--font); font-size: 13.5px; color: var(--text); outline: none; transition: border-color .2s, background .2s, box-shadow .2s; }
        .field-input::placeholder { color: var(--text-4); }
        .field-input:focus { background: var(--white); border-color: var(--coral); box-shadow: 0 0 0 3px rgba(255,56,92,0.10); }
        .field-eye { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-4); padding: 0; display: flex; transition: color .15s; }
        .field-eye:hover { color: var(--text-3); }

        .extras { display: flex; align-items: center; justify-content: space-between; margin: 6px 0 2px; }
        .remember { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-3); cursor: pointer; }
        .remember input { accent-color: var(--coral); }
        .forgot { font-size: 12px; font-weight: 600; color: var(--coral); text-decoration: none; }
        .forgot:hover { text-decoration: underline; }

        .submit-btn { width: 100%; padding: 13px 20px; border: none; border-radius: 13px; font-family: var(--font); font-size: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, var(--coral) 0%, var(--coral-dark) 100%); color: white; box-shadow: 0 5px 20px rgba(255,56,92,0.32); transition: filter .2s, box-shadow .2s, transform .12s; margin-top: 14px; }
        .submit-btn:hover:not(:disabled) { filter: brightness(1.07); box-shadow: 0 8px 28px rgba(255,56,92,0.42); }
        .submit-btn:active:not(:disabled) { transform: scale(0.984); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .spinner { width: 17px; height: 17px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin .65s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .switch-row { display: flex; align-items: center; justify-content: center; gap: 5px; margin-top: 14px; font-size: 12.5px; color: var(--text-3); }
        .switch-btn { font-family: var(--font); font-size: 12.5px; font-weight: 800; color: var(--coral); background: none; border: none; cursor: pointer; padding: 0; text-decoration: underline; text-underline-offset: 2px; }

        .terms { text-align: center; font-size: 10.5px; color: var(--text-4); margin-top: 10px; line-height: 1.6; }
        .terms a { color: var(--text-3); text-decoration: underline; }

        @media (max-width: 900px) {
          html, body { overflow: auto; }
          .shell { height: auto; min-height: 100vh; overflow: visible; }
          .stage { flex-direction: column; padding: 24px 20px 40px; gap: 20px; }
          .side { display: none; }
          .bg-img { display: none; }
          .form-card { max-width: 440px; }
        }
        @media (max-width: 480px) {
          .nav { padding: 14px 20px; }
          .form-card { padding: 24px 20px 20px; border-radius: 22px; }
          .form-heading { font-size: 24px; }
        }
      `}</style>

      <Toaster position="top-center" toastOptions={{ style: { fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 600, borderRadius: "12px", border: "1px solid #E7E2DC", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" } }} />

      <AnimatePresence>
        {!showAuth && <PlaneIntro key="intro" onDone={() => setShowAuth(true)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showAuth && <AuthPage key="auth" />}
      </AnimatePresence>
    </>
  );
}