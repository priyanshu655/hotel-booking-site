import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home, Calendar, MapPin, LogOut, User, Trash2,
  ArrowRight, Compass, Bookmark, Sparkles, Globe,
  Mountain, Waves, UtensilsCrossed, Palette, TreePine,
  ShoppingBag, Music, Church, Clock, ChevronDown,
  Plus, Minus, RotateCcw, Save, Navigation, Search, Menu
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API } from "../config";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ACCENT = "#FF385C";
const MARKER_COLORS = ["#FF385C", "#E00B41", "#D70466", "#FF5A5F", "#C13584", "#FD1D1D"];

function createNumberedIcon(index, color) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:32px;height:32px;border-radius:50%;
      background:${color};color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-weight:700;font-size:14px;
      font-family:'Syne', sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border: 2px solid #ffffff;
    ">${index + 1}</div>`,
    iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -16],
  });
}

const PREFERENCES = [
  { id: "foodie",    icon: UtensilsCrossed, label: "Foodie"       },
  { id: "history",   icon: Compass,         label: "History"      },
  { id: "adventure", icon: Mountain,        label: "Adventure"    },
  { id: "nature",    icon: TreePine,        label: "Nature"       },
  { id: "art",       icon: Palette,         label: "Art & Culture"},
  { id: "beach",     icon: Waves,           label: "Beach"        },
  { id: "nightlife", icon: Music,           label: "Nightlife"    },
  { id: "spiritual", icon: Church,          label: "Spiritual"    },
  { id: "shopping",  icon: ShoppingBag,     label: "Shopping"     },
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&q=80",
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1600&q=80",
  "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=1600&q=80",
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1600&q=80",
];

function MapFitter({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 1) {
      map.setView([positions[0].lat, positions[0].lng], 14);
    } else if (positions.length > 1) {
      map.fitBounds(
        L.latLngBounds(positions.map(p => [p.lat, p.lng])),
        { padding: [60, 60], maxZoom: 14 }
      );
    }
  }, [positions, map]);
  return null;
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --brand: #FF385C;
    --brand-dark: #D70466;
    --brand-light: rgba(255, 56, 92, 0.08);
    --bg: #FFFFFF;
    --bg-alt: #F7F7F7;
    --text-main: #111111;
    --text-muted: #717171;
    --text-light: #B0B0B0;
    --border: #E8E8E8;
    --border-hover: #111111;
    --shadow-sm: 0 2px 4px rgba(0,0,0,0.06);
    --shadow-md: 0 8px 24px rgba(0,0,0,0.10);
    --shadow-lg: 0 20px 48px rgba(0,0,0,0.14);
    --nav-blur: blur(20px);
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 24px;
    --radius-pill: 999px;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --ease: cubic-bezier(0.2, 0, 0, 1);
    --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  html { scroll-behavior: smooth; }
  body { font-family: var(--font-body); background: var(--bg); color: var(--text-main); -webkit-font-smoothing: antialiased; min-height: 100vh; }
  button { font-family: var(--font-body); }
  a { text-decoration: none; color: inherit; }
  h1, h2, h3 { font-family: var(--font-display); color: var(--text-main); font-weight: 700; letter-spacing: -0.02em; }
  p { color: var(--text-muted); line-height: 1.6; font-family: var(--font-body); }


  /* ═══════════════════════════════════════
     REDESIGNED NAVBAR — Floating Island
  ═══════════════════════════════════════ */
  .ab-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 500;
    height: 80px;
    display: flex;
    align-items: center;
    padding: 0 32px;
    /* Transparent by default, transitions on scroll */
    background: transparent;
    transition: background 0.4s var(--ease), backdrop-filter 0.4s var(--ease);
  }
  .ab-nav.scrolled {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: var(--nav-blur);
    -webkit-backdrop-filter: var(--nav-blur);
    border-bottom: 1px solid rgba(0,0,0,0.06);
  }

  .ab-nav-inner {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 16px;
  }

  /* Brand — left */
  .ab-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 20px;
    letter-spacing: -0.5px;
    color: var(--text-main);
    transition: opacity 0.2s;
    text-decoration: none;
  }
  .ab-brand:hover { opacity: 0.7; }
  .ab-brand-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--brand);
    display: inline-block;
    margin-left: 2px;
  }

  /* Center nav pill */
  .ab-nav-pill {
    display: flex;
    align-items: center;
    background: var(--text-main);
    border-radius: var(--radius-pill);
    padding: 5px;
    gap: 2px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.18);
  }
  .ab-nav-pill-btn {
    position: relative;
    padding: 8px 20px;
    border-radius: var(--radius-pill);
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.65);
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: color 0.2s var(--ease), background 0.2s var(--ease);
    white-space: nowrap;
  }
  .ab-nav-pill-btn:hover {
    color: rgba(255,255,255,1);
  }
  .ab-nav-pill-btn.active {
    background: white;
    color: var(--text-main);
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }
  .ab-nav-pill-btn.active:hover { color: var(--text-main); }

  /* Right side user area */
  .ab-nav-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
  }

  .ab-nav-plan-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 18px;
    border-radius: var(--radius-pill);
    border: 1.5px solid rgba(0,0,0,0.12);
    background: white;
    color: var(--text-main);
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s var(--ease));
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .ab-nav-plan-btn:hover {
    border-color: var(--text-main);
    box-shadow: 0 4px 16px rgba(0,0,0,0.10);
    transform: translateY(-1px);
  }

  .ab-user-chip {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px 12px 5px 5px;
    border-radius: var(--radius-pill);
    background: white;
    border: 1.5px solid var(--border);
    cursor: pointer;
    transition: all 0.2s var(--ease);
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .ab-user-chip:hover {
    border-color: var(--text-main);
    box-shadow: 0 4px 16px rgba(0,0,0,0.10);
    transform: translateY(-1px);
  }
  .ab-avatar {
    width: 30px; height: 30px;
    border-radius: 50%;
    background: var(--text-main);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0;
  }
  .ab-chip-label {
    font-family: var(--font-display);
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
  }

  /* Vertical divider in pill */
  .ab-pill-sep {
    width: 1px;
    height: 20px;
    background: rgba(255,255,255,0.15);
    margin: 0 2px;
  }

  /* Mobile hamburger */
  .ab-mobile-menu-btn {
    display: none;
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 1.5px solid var(--border);
    background: white;
    align-items: center; justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }


  /* ═══════════════════════════════════════
     BUTTONS
  ═══════════════════════════════════════ */
  .ab-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    border-radius: var(--radius-sm);
    font-family: var(--font-display);
    font-weight: 600; font-size: 14px;
    cursor: pointer; transition: transform 0.1s, box-shadow 0.2s, background 0.2s; border: none; padding: 13px 22px;
    letter-spacing: 0.01em;
  }
  .ab-btn:active { transform: scale(0.98); }
  .ab-btn-primary { background: var(--text-main); color: white; }
  .ab-btn-primary:hover { background: #333; box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
  .ab-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
  .ab-btn-outline { background: transparent; border: 1.5px solid var(--border); color: var(--text-main); }
  .ab-btn-outline:hover { border-color: var(--text-main); }
  .ab-btn-ghost { background: transparent; color: var(--text-main); text-decoration: underline; padding: 8px; }
  .ab-btn-ghost:hover { color: var(--text-muted); }

  /* ═══════════════════════════════════════
     LAYOUT
  ═══════════════════════════════════════ */
  .ab-main { padding-top: 80px; min-height: 100vh; background: var(--bg); }

  /* HERO */
  .ab-hero {
    position: relative; height: calc(100vh - 80px); min-height: 600px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 40px; overflow: hidden;
  }
  .ab-hero-bg {
    position: absolute; inset: 0; z-index: 0;
    background-size: cover; background-position: center;
    transition: background-image 1s ease-in-out;
  }
  .ab-hero-bg::after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.3); }
  .ab-hero-content {
    position: relative; z-index: 1; text-align: center; width: 100%; max-width: 800px;
    display: flex; flex-direction: column; align-items: center; gap: 32px;
  }
  .ab-hero-title {
    font-family: var(--font-display);
    font-size: clamp(40px, 6vw, 64px); color: white; font-weight: 800; line-height: 1.1;
    text-shadow: 0 2px 12px rgba(0,0,0,0.2);
  }
  .ab-search-pill {
    background: white; border-radius: 40px; padding: 12px 12px 12px 32px;
    display: flex; align-items: center; gap: 24px; box-shadow: var(--shadow-lg);
    cursor: pointer; transition: transform 0.2s var(--ease); max-width: 600px; width: 100%;
  }
  .ab-search-pill:hover { transform: scale(1.02); }
  .ab-search-text { flex: 1; text-align: left; }
  .ab-search-label { font-family: var(--font-display); font-size: 11px; font-weight: 700; color: var(--text-main); margin-bottom: 2px; letter-spacing: 0.05em; text-transform: uppercase; }
  .ab-search-val { font-size: 14px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ab-search-btn {
    width: 48px; height: 48px; border-radius: 50%; background: var(--brand); color: white;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  /* WIZARD MODAL */
  .ab-overlay {
    position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center; padding: 20px;
    animation: fadeIn 0.2s ease;
  }
  .ab-modal {
    width: 100%; max-width: 560px; background: var(--bg); border-radius: var(--radius-md);
    position: relative; box-shadow: var(--shadow-lg); overflow: hidden;
    display: flex; flex-direction: column; max-height: 90vh;
    animation: slideUp 0.3s var(--ease);
  }
  .ab-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; height: 64px; border-bottom: 1px solid var(--border);
  }
  .ab-modal-title { font-family: var(--font-display); font-weight: 700; font-size: 13px; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-muted); }
  .ab-modal-close {
    width: 32px; height: 32px; border-radius: 50%; border: none; background: transparent;
    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s;
    font-size: 18px; color: var(--text-muted);
  }
  .ab-modal-close:hover { background: var(--bg-alt); }
  .ab-modal-body { padding: 32px 24px; overflow-y: auto; flex: 1; }
  .ab-modal-footer {
    padding: 16px 24px; border-top: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center; background: var(--bg);
  }
  .ab-step-title { font-size: 26px; margin-bottom: 8px; }
  .ab-step-sub { font-size: 15px; color: var(--text-muted); margin-bottom: 24px; }
  .ab-input {
    width: 100%; padding: 18px; border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    font-size: 16px; outline: none; transition: border-color 0.2s; font-family: var(--font-body); color: var(--text-main);
    background: var(--bg);
  }
  .ab-input:focus { border-color: var(--border-hover); }
  .ab-input::placeholder { color: var(--text-muted); }
  .ab-suggestions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
  .ab-pill {
    padding: 8px 16px; border-radius: 30px; border: 1.5px solid var(--border);
    background: var(--bg); font-size: 14px; cursor: pointer; transition: border-color 0.2s; color: var(--text-main);
    font-family: var(--font-body);
  }
  .ab-pill:hover { border-color: var(--text-main); }
  .ab-grid-prefs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .ab-pref-card {
    border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 20px 10px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    cursor: pointer; transition: all 0.2s; background: var(--bg);
  }
  .ab-pref-card:hover { border-color: var(--border-hover); }
  .ab-pref-card.selected { border-color: var(--text-main); border-width: 2px; padding: 19px 9px; background: var(--bg-alt); }
  .ab-pref-icon { color: var(--text-main); }
  .ab-pref-label { font-size: 13px; font-weight: 500; text-align: center; font-family: var(--font-body); }
  .ab-counter { display: flex; align-items: center; justify-content: center; gap: 24px; margin: 32px 0; }
  .ab-counter-btn {
    width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid var(--border);
    background: var(--bg); display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-muted); transition: all 0.2s;
  }
  .ab-counter-btn:hover:not(:disabled) { border-color: var(--text-main); color: var(--text-main); }
  .ab-counter-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .ab-counter-val { font-family: var(--font-display); font-size: 48px; font-weight: 700; width: 60px; text-align: center; }

  /* LOADING */
  .ab-loading-screen {
    position: fixed; inset: 0; background: var(--bg); z-index: 2000;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px;
  }
  .ab-spinner {
    width: 40px; height: 40px; border: 3px solid var(--border);
    border-top-color: var(--brand); border-radius: 50%; animation: spin 0.8s linear infinite;
  }

  /* RESULT PAGE */
  .ab-result-container { max-width: 1200px; margin: 0 auto; padding: 40px 24px; }
  .ab-result-header { margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; }
  .ab-result-title { font-size: clamp(32px, 4vw, 48px); font-weight: 800; margin-bottom: 8px; }
  .ab-result-meta { font-size: 16px; color: var(--text-muted); display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .ab-result-actions { display: flex; gap: 12px; }
  .ab-view-tabs { display: flex; gap: 16px; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
  .ab-tab {
    padding: 12px 0; font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--text-muted);
    background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; transition: color 0.2s; letter-spacing: 0.02em;
  }
  .ab-tab:hover { color: var(--text-main); }
  .ab-tab.active { color: var(--text-main); border-bottom-color: var(--text-main); }
  .ab-day-list { display: flex; flex-direction: column; gap: 24px; padding-bottom: 60px; }
  .ab-day-card { border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--bg); overflow: hidden; }
  .ab-day-header {
    padding: 24px; display: flex; justify-content: space-between; align-items: center;
    cursor: pointer; transition: background 0.2s;
  }
  .ab-day-header:hover { background: var(--bg-alt); }
  .ab-day-title-area { display: flex; flex-direction: column; gap: 4px; }
  .ab-day-num { font-family: var(--font-display); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); }
  .ab-day-name { font-family: var(--font-display); font-size: 20px; font-weight: 700; }
  .ab-day-content { padding: 0 24px 24px; border-top: 1px solid var(--border); display: none; }
  .ab-day-content.open { display: block; }
  .ab-timeline { margin-top: 24px; position: relative; }
  .ab-timeline::before { content: ''; position: absolute; left: 11px; top: 8px; bottom: 0; width: 1px; background: var(--border); }
  .ab-activity { display: flex; gap: 20px; margin-bottom: 24px; position: relative; }
  .ab-activity:last-child { margin-bottom: 0; }
  .ab-activity-dot {
    width: 24px; height: 24px; border-radius: 50%; background: var(--bg); border: 2px solid var(--brand);
    position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;
  }
  .ab-activity-dot::after { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--brand); }
  .ab-activity-body { flex: 1; }
  .ab-activity-time { font-family: var(--font-display); font-size: 12px; font-weight: 700; color: var(--brand); margin-bottom: 4px; letter-spacing: 0.04em; }
  .ab-activity-title { font-family: var(--font-display); font-size: 16px; font-weight: 600; margin-bottom: 4px; }
  .ab-activity-place { font-size: 14px; color: var(--text-muted); margin-bottom: 8px; display: flex; align-items: center; gap: 4px; }
  .ab-activity-desc { font-size: 15px; color: var(--text-main); line-height: 1.5; margin-bottom: 12px; }
  .ab-activity-tip { background: var(--bg-alt); padding: 12px 16px; border-radius: var(--radius-sm); font-size: 14px; color: var(--text-main); display: flex; gap: 8px; align-items: flex-start; }

  /* MAP */
  .ab-map-layout { display: flex; flex-direction: column; gap: 16px; height: calc(100vh - 280px); min-height: 500px; }
  .ab-map-controls { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; }
  .ab-map-controls::-webkit-scrollbar { display: none; }
  .ab-map-day-btn {
    padding: 8px 16px; border-radius: 30px; border: 1px solid var(--border); background: var(--bg);
    font-family: var(--font-display); font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; color: var(--text-main);
  }
  .ab-map-day-btn.active { background: var(--text-main); color: white; border-color: var(--text-main); }
  .ab-map-wrapper { flex: 1; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border); position: relative; }
  .leaflet-popup-content-wrapper { border-radius: 12px !important; box-shadow: var(--shadow-md) !important; padding: 0 !important; }
  .leaflet-popup-content { margin: 16px !important; font-family: var(--font-body) !important; }

  /* SAVED TRIPS */
  .ab-saved-container { max-width: 1200px; margin: 0 auto; padding: 40px 24px; }
  .ab-grid-saved { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-top: 32px; }
  .ab-saved-card {
    border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border); background: var(--bg);
    cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
  }
  .ab-saved-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
  .ab-saved-img-placeholder { height: 160px; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); display: flex; align-items: center; justify-content: center; color: var(--text-light); }
  .ab-saved-body { padding: 20px; }
  .ab-saved-dest { font-family: var(--font-display); font-size: 18px; font-weight: 700; margin-bottom: 8px; }
  .ab-saved-info { font-size: 14px; color: var(--text-muted); margin-bottom: 16px; }
  .ab-saved-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 16px; margin-top: 16px; }

  /* UTILS */
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fade-up { animation: slideUp 0.4s var(--ease) both; }

  @media (max-width: 768px) {
    .ab-nav { padding: 0 20px; }
    .ab-nav-pill { display: none; }
    .ab-nav-plan-btn { display: none; }
    .ab-mobile-menu-btn { display: flex !important; }
    .ab-hero-title { font-size: 32px; }
    .ab-search-pill { flex-direction: column; align-items: flex-start; padding: 16px; border-radius: 20px; gap: 16px; }
    .ab-search-btn { width: 100%; border-radius: var(--radius-sm); gap: 8px; }
    .ab-modal { height: 100%; max-height: 100vh; border-radius: 0; }
    .ab-grid-prefs { grid-template-columns: repeat(2, 1fr); }
    .ab-result-container, .ab-saved-container { padding: 24px 16px; }
    .ab-result-header { flex-direction: column; align-items: flex-start; }
    .ab-result-actions { width: 100%; }
    .ab-result-actions button { flex: 1; justify-content: center; }
  }
`;

/* ─────────────────────────────────────────────
   WIZARD STEPS
───────────────────────────────────────────── */
function DestinationStep({ onNext, onCancel }) {
  const [dest, setDest] = useState("");
  const ref = useRef();
  useEffect(() => { setTimeout(() => ref.current?.focus(), 100); }, []);
  const suggestions = ["Paris", "Kyoto", "Bali", "New York", "Patagonia", "Marrakech"];
  return (
    <>
      <div className="ab-modal-header">
        <button className="ab-modal-close" onClick={onCancel}>✕</button>
        <div className="ab-modal-title">Step 1 of 3</div>
        <div style={{ width: 32 }} />
      </div>
      <div className="ab-modal-body">
        <h2 className="ab-step-title">Where to?</h2>
        <p className="ab-step-sub">Search destinations, regions, or cities.</p>
        <input ref={ref} className="ab-input" value={dest}
          onChange={e => setDest(e.target.value)}
          onKeyDown={e => e.key === "Enter" && dest.trim() && onNext(dest.trim())}
          placeholder="e.g. Tokyo, Goa, Iceland" />
        <div className="ab-suggestions">
          {suggestions.map(s => (
            <button key={s} className="ab-pill" onClick={() => { setDest(s); onNext(s); }}>{s}</button>
          ))}
        </div>
      </div>
      <div className="ab-modal-footer">
        <button className="ab-btn ab-btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="ab-btn ab-btn-primary" onClick={() => dest.trim() && onNext(dest.trim())} disabled={!dest.trim()}>Next</button>
      </div>
    </>
  );
}

function PreferencesStep({ destination, onNext, onBack }) {
  const [sel, setSel] = useState([]);
  const toggle = id => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  return (
    <>
      <div className="ab-modal-header">
        <button className="ab-modal-close" onClick={onBack}>←</button>
        <div className="ab-modal-title">Step 2 of 3</div>
        <div style={{ width: 32 }} />
      </div>
      <div className="ab-modal-body">
        <h2 className="ab-step-title">What's your vibe?</h2>
        <p className="ab-step-sub">Choose activities that excite you for {destination}.</p>
        <div className="ab-grid-prefs">
          {PREFERENCES.map((p) => {
            const Icon = p.icon;
            const active = sel.includes(p.id);
            return (
              <div key={p.id} className={`ab-pref-card ${active ? "selected" : ""}`} onClick={() => toggle(p.id)}>
                <div className="ab-pref-icon"><Icon size={24} strokeWidth={active ? 2 : 1.5} /></div>
                <div className="ab-pref-label">{p.label}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="ab-modal-footer">
        <button className="ab-btn ab-btn-ghost" onClick={onBack}>Back</button>
        <button className="ab-btn ab-btn-primary" onClick={() => sel.length && onNext(sel)} disabled={!sel.length}>Next</button>
      </div>
    </>
  );
}

function DaysStep({ destination, onBack, onSubmit }) {
  const [days, setDays] = useState(3);
  return (
    <>
      <div className="ab-modal-header">
        <button className="ab-modal-close" onClick={onBack}>←</button>
        <div className="ab-modal-title">Step 3 of 3</div>
        <div style={{ width: 32 }} />
      </div>
      <div className="ab-modal-body">
        <h2 className="ab-step-title">How long is your trip?</h2>
        <p className="ab-step-sub">Select the duration of your stay in {destination}.</p>
        <div className="ab-counter">
          <button className="ab-counter-btn" onClick={() => setDays(d => Math.max(1, d - 1))} disabled={days <= 1}><Minus size={20} /></button>
          <div className="ab-counter-val">{days}</div>
          <button className="ab-counter-btn" onClick={() => setDays(d => Math.min(14, d + 1))} disabled={days >= 14}><Plus size={20} /></button>
        </div>
        <p style={{ textAlign: 'center', fontSize: 16, color: 'var(--text-main)', fontWeight: 500 }}>{days === 1 ? "Day" : "Days"}</p>
      </div>
      <div className="ab-modal-footer">
        <button className="ab-btn ab-btn-ghost" onClick={onBack}>Back</button>
        <button className="ab-btn ab-btn-primary" onClick={() => onSubmit(days)}><Sparkles size={16} /> Generate Itinerary</button>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   RESULT COMPONENTS
───────────────────────────────────────────── */
function TripMap({ itinerary, destination, activeDay, setActiveDay }) {
  const positions = (itinerary[activeDay]?.activities || [])
    .filter(a => a.lat && a.lng)
    .map(a => ({ lat: a.lat, lng: a.lng, title: a.title, place: a.place, time: a.time }));
  const polyPts = positions.map(p => [p.lat, p.lng]);
  return (
    <div className="ab-map-layout fade-up">
      <div className="ab-map-controls">
        {itinerary.map((day, i) => (
          <button key={i} className={`ab-map-day-btn ${activeDay === i ? "active" : ""}`} onClick={() => setActiveDay(i)}>Day {i + 1}</button>
        ))}
      </div>
      <div className="ab-map-wrapper">
        <MapContainer
          center={positions.length > 0 ? [positions[0].lat, positions[0].lng] : [20, 0]}
          zoom={13}
          style={{ height: "100%", width: "100%", zIndex: 1 }}
          key={`${destination}-${activeDay}`}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          {positions.length > 0 && <MapFitter positions={positions} />}
          {positions.map((pos, i) => (
            <Marker key={i} position={[pos.lat, pos.lng]} icon={createNumberedIcon(i, MARKER_COLORS[i % MARKER_COLORS.length])}>
              <Popup>
                <div style={{ padding: '4px 0' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-main)", marginBottom: 4 }}>{pos.title}</div>
                  {pos.place && <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{pos.place}</div>}
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: "uppercase", color: "var(--brand)" }}>{pos.time}</div>
                </div>
              </Popup>
            </Marker>
          ))}
          {polyPts.length > 1 && <Polyline positions={polyPts} color="var(--brand)" weight={3} opacity={0.6} dashArray="8 8" />}
        </MapContainer>
        {positions.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <MapPin size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
            <p>No map coordinates for this day.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DayCard({ day, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="ab-day-card fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="ab-day-header" onClick={() => setOpen(!open)}>
        <div className="ab-day-title-area">
          <span className="ab-day-num">Day {index + 1}</span>
          <span className="ab-day-name">{day.title?.split(":")[0] || day.title}</span>
        </div>
        <ChevronDown size={20} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
      </div>
      <div className={`ab-day-content ${open ? 'open' : ''}`}>
        <p style={{ fontSize: 14, marginBottom: 16 }}>{day.activities?.length || 0} stops planned {day.theme && `· ${day.theme}`}</p>
        <div className="ab-timeline">
          {day.activities?.map((act, i) => (
            <div key={i} className="ab-activity">
              <div className="ab-activity-dot" />
              <div className="ab-activity-body">
                <div className="ab-activity-time">{act.time}</div>
                <div className="ab-activity-title">{act.title}</div>
                {act.place && <div className="ab-activity-place"><MapPin size={12} /> {act.place}</div>}
                <div className="ab-activity-desc">{act.description}</div>
                {act.tip && (
                  <div className="ab-activity-tip">
                    <Sparkles size={16} color="var(--brand)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{act.tip}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ItineraryResult({ destination, preferences, days, itinerary, onReset, onSave, saving }) {
  const [tab, setTab] = useState("itinerary");
  const [activeDay, setActiveDay] = useState(0);
  return (
    <div className="ab-result-container fade-up">
      <div className="ab-result-header">
        <div>
          <h1 className="ab-result-title">{destination}</h1>
          <div className="ab-result-meta">
            <span>{days} Days</span>
            <span>·</span>
            <span>{preferences.length} Preferences</span>
            <span>·</span>
            <span style={{ display: 'flex', gap: 4 }}>
              {preferences.map(p => {
                const P = PREFERENCES.find(x => x.id === p);
                return P ? <P.icon key={p} size={14} /> : null;
              })}
            </span>
          </div>
        </div>
        <div className="ab-result-actions">
          <button className="ab-btn ab-btn-outline" onClick={onReset}><Search size={16} /> New Search</button>
          <button className="ab-btn ab-btn-primary" onClick={onSave}><Save size={16} /> {saving ? "Saved!" : "Save Trip"}</button>
        </div>
      </div>
      <div className="ab-view-tabs">
        <button className={`ab-tab ${tab === "itinerary" ? "active" : ""}`} onClick={() => setTab("itinerary")}>Itinerary</button>
        <button className={`ab-tab ${tab === "map" ? "active" : ""}`} onClick={() => setTab("map")}>Map View</button>
      </div>
      {tab === "map" ? (
        <TripMap itinerary={itinerary} destination={destination} activeDay={activeDay} setActiveDay={setActiveDay} />
      ) : (
        <div className="ab-day-list">
          {itinerary.map((day, i) => <DayCard key={i} day={day} index={i} />)}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function TripPlanner() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user] = useState(() => { try { return JSON.parse(localStorage.getItem("planora_user")); } catch { return null; } });

  const [scrolled, setScrolled]       = useState(false);
  const [showWizard, setShowWizard]   = useState(false);
  const [step, setStep]               = useState(1);
  const [destination, setDestination] = useState("");
  const [preferences, setPreferences] = useState([]);
  const [days, setDays]               = useState(3);
  const [itinerary, setItinerary]     = useState([]);
  const [geocoding, setGeocoding]     = useState(false);
  const [savedTrips, setSavedTrips]   = useState([]);
  const [saving, setSaving]           = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [view, setView]               = useState("home");
  const [bgIdx, setBgIdx]             = useState(0);

  useEffect(() => { if (!token) navigate("/auth"); }, [token, navigate]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => { if (token) fetchSavedTrips(); }, [token]);
  useEffect(() => {
    const t = setInterval(() => setBgIdx(i => (i + 1) % HERO_IMAGES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const fetchSavedTrips = async () => {
    setLoadingSaved(true);
    try {
      const r = await axios.get(`${API}/trips/my`, { headers: { Authorization: `Bearer ${token}` } });
      setSavedTrips(r.data);
    } catch {}
    finally { setLoadingSaved(false); }
  };

  const resetTrip = () => { setStep(1); setDestination(""); setPreferences([]); setDays(3); setItinerary([]); setView("home"); };
  const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("planora_user"); navigate("/auth"); };

  const generateItinerary = async numDays => {
    setDays(numDays); setShowWizard(false); setGeocoding(true);
    toast.loading("Crafting your itinerary…", { id: "gen" });
    try {
      const r = await axios.post(`${API}/trips/generate`, { destination, preferences, days: numDays }, { headers: { Authorization: `Bearer ${token}` } });
      toast.dismiss("gen"); toast.success("Itinerary ready!");
      setItinerary(r.data.itinerary); setGeocoding(false); setView("result");
    } catch (err) {
      toast.dismiss("gen"); toast.error(err.response?.data?.message || "Failed to generate."); setGeocoding(false);
    }
  };

  const saveTrip = async () => {
    if (!token) return toast.error("Please log in first");
    setSaving(true);
    try {
      await axios.post(`${API}/trips`, { destination, preferences, days, itinerary }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Trip saved!"); fetchSavedTrips();
    } catch { toast.error("Failed to save trip"); }
    setTimeout(() => setSaving(false), 2200);
  };

  const deleteTrip = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API}/trips/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Deleted"); fetchSavedTrips();
    } catch { toast.error("Failed to delete"); }
  };

  const loadTrip = trip => {
    setDestination(trip.destination);
    setPreferences(trip.preferences || []);
    setDays(trip.days);
    setItinerary(trip.itinerary || []);
    setView("result");
  };

  return (
    <>
      <style>{STYLES}</style>
      <Toaster position="bottom-center" toastOptions={{
        style: { background: "#111", color: "#fff", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif" }
      }} />

      {/* ══════════════════════════════════════
          REDESIGNED NAVBAR
      ══════════════════════════════════════ */}
      <nav className={`ab-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="ab-nav-inner">

          {/* LEFT — Brand */}
          <Link to="/" className="ab-brand" onClick={resetTrip}>
            Planora<span className="ab-brand-dot" />
          </Link>

          {/* CENTER — Pill nav */}
          <div className="ab-nav-pill">
            <button
              className={`ab-nav-pill-btn ${(view === "home" || view === "result") ? "active" : ""}`}
              onClick={resetTrip}
            >
              Planner
            </button>
            <div className="ab-pill-sep" />
            <button
              className={`ab-nav-pill-btn ${view === "saved" ? "active" : ""}`}
              onClick={() => setView("saved")}
            >
              Saved
            </button>
            <div className="ab-pill-sep" />
            <button
              className="ab-nav-pill-btn"
              onClick={() => { setStep(1); setShowWizard(true); }}
            >
              Explore
            </button>
          </div>

          {/* RIGHT — CTA + User */}
          <div className="ab-nav-right">
            <button
              className="ab-nav-plan-btn"
              onClick={() => { setStep(1); setShowWizard(true); }}
            >
              <Sparkles size={14} color="var(--brand)" />
              Plan a trip
            </button>

            {token && (
              <div className="ab-user-chip" onClick={handleLogout} title="Logout">
                <div className="ab-avatar">
                  {user?.username?.[0]?.toUpperCase() || <User size={14} />}
                </div>
                <span className="ab-chip-label">
                  {user?.username || "Account"}
                </span>
              </div>
            )}

            {/* Mobile only */}
            <button className="ab-mobile-menu-btn" style={{ display: 'none' }}>
              <Menu size={18} />
            </button>
          </div>

        </div>
      </nav>

      <main className="ab-main">
        {geocoding && (
          <div className="ab-loading-screen">
            <div className="ab-spinner" />
            <h2 style={{ fontSize: 24 }}>Mapping your journey...</h2>
            <p>Finding the best spots for your trip.</p>
          </div>
        )}

        {view === "home" && !geocoding && (
          <div className="ab-hero">
            <div className="ab-hero-bg" style={{ backgroundImage: `url(${HERO_IMAGES[bgIdx]})` }} />
            <div className="ab-hero-content fade-up">
              <h1 className="ab-hero-title">Find your next adventure.</h1>
              <div className="ab-search-pill" onClick={() => { setStep(1); setShowWizard(true); }}>
                <div className="ab-search-text">
                  <div className="ab-search-label">Where</div>
                  <div className="ab-search-val">Search destinations</div>
                </div>
                <div className="ab-search-text" style={{ borderLeft: '1px solid var(--border)', paddingLeft: 24 }}>
                  <div className="ab-search-label">Duration</div>
                  <div className="ab-search-val">Add days</div>
                </div>
                <div className="ab-search-btn">
                  <Search size={20} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "result" && !geocoding && (
          <ItineraryResult destination={destination} preferences={preferences} days={days}
            itinerary={itinerary} onReset={resetTrip} onSave={saveTrip} saving={saving} />
        )}

        {view === "saved" && !geocoding && (
          <div className="ab-saved-container fade-up">
            <h1 className="ab-result-title">Your saved trips</h1>
            {loadingSaved ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                <div className="ab-spinner" />
              </div>
            ) : savedTrips.length === 0 ? (
              <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Compass size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                <h3>No trips saved yet</h3>
                <p style={{ marginTop: 8, marginBottom: 24 }}>Start planning to build your collection.</p>
                <button className="ab-btn ab-btn-primary" onClick={() => { resetTrip(); setShowWizard(true); }}>Start Planning</button>
              </div>
            ) : (
              <div className="ab-grid-saved">
                {savedTrips.map((trip, i) => (
                  <div key={trip._id} className="ab-saved-card" style={{ animationDelay: `${i * 0.05}s` }} onClick={() => loadTrip(trip)}>
                    <div className="ab-saved-img-placeholder"><MapPin size={32} opacity={0.3} /></div>
                    <div className="ab-saved-body">
                      <div className="ab-saved-dest">{trip.destination}</div>
                      <div className="ab-saved-info">{trip.days} Days planned</div>
                      <div className="ab-saved-footer">
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                          {trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : 'Recently saved'}
                        </span>
                        <button className="ab-btn-ghost" onClick={e => deleteTrip(trip._id, e)} style={{ padding: 0, textDecoration: 'none', color: 'var(--text-muted)' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {showWizard && (
        <div className="ab-overlay" onClick={e => e.target === e.currentTarget && setShowWizard(false)}>
          <div className="ab-modal">
            {step === 1 && <DestinationStep onCancel={() => setShowWizard(false)} onNext={d => { setDestination(d); setStep(2); }} />}
            {step === 2 && <PreferencesStep destination={destination} onBack={() => setStep(1)} onNext={p => { setPreferences(p); setStep(3); }} />}
            {step === 3 && <DaysStep destination={destination} onBack={() => setStep(2)} onSubmit={generateItinerary} />}
          </div>
        </div>
      )}
    </>
  );
}