import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  LogOut, LayoutDashboard, Building2, CalendarDays,
  DollarSign, Users, BedDouble, TrendingUp, Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./SellerDashboard.css";

/* ── palette (mirrors CSS vars) ── */
const PALETTE = ["#FF385C", "#38BDF8", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label, prefix = "", suffix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #E2E8F0",
      borderRadius: 12,
      padding: "12px 16px",
      boxShadow: "0 8px 24px rgba(15,23,42,.10)",
      fontSize: "0.82rem",
    }}>
      {label && <p style={{ color: "#64748B", fontWeight: 600, marginBottom: 8 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 700 }}>
          {p.name}: {prefix}{typeof p.value === "number" ? p.value.toLocaleString() : p.value}{suffix}
        </p>
      ))}
    </div>
  );
};

const SellerDashboard = () => {
  const [analyticsData, setAnalyticsData]   = useState(null);
  const [loading, setLoading]               = useState(true);
  const [activeTab, setActiveTab]           = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const user  = JSON.parse(localStorage.getItem("planora_user"));
        if (!token || !user) { navigate("/auth"); return; }
        if (user.role !== "seller" && user.role !== "admin") {
          toast.error("Seller access required!");
          navigate("/");
          return;
        }
        const res = await axios.get(
          "https://hotel-booking-site-gle5.onrender.com/api/hotels/analytics/dashboard",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAnalyticsData(res.data);
      } catch {
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("planora_user");
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="dashboard-loading">
      <div className="spinner" />
      <p>Loading your dashboard…</p>
    </div>
  );

  /* ── Error ── */
  if (!analyticsData) return (
    <div className="dashboard-error">
      <p>Failed to load analytics data</p>
      <button onClick={() => window.location.reload()}>Try again</button>
    </div>
  );

  const user = JSON.parse(localStorage.getItem("planora_user"));

  /* ── helpers ── */
  const occupancyClass = (rate) =>
    rate >= 70 ? "occupancy-high" : rate >= 40 ? "occupancy-mid" : "occupancy-low";

  const tabs = [
    { id: "overview", label: "Overview",       icon: <LayoutDashboard size={16} /> },
    { id: "hotels",   label: "My Hotels",      icon: <Building2 size={16} /> },
    { id: "bookings", label: "Bookings",        icon: <CalendarDays size={16} /> },
  ];

  const stats = [
    {
      cls: "revenue-card",
      icon: <DollarSign size={22} />,
      label: "Total Revenue",
      value: `$${analyticsData.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      cls: "bookings-card",
      icon: <Users size={22} />,
      label: "Total Bookings",
      value: analyticsData.totalBookings,
    },
    {
      cls: "rooms-card",
      icon: <BedDouble size={22} />,
      label: "Rooms Booked",
      value: analyticsData.totalRoomsBooked,
    },
    {
      cls: "hotels-card",
      icon: <TrendingUp size={22} />,
      label: "My Hotels",
      value: analyticsData.hotels.length,
    },
  ];

  /* ── shared chart axis style ── */
  const axisStyle = { fill: "#94A3B8", fontSize: 12, fontWeight: 500 };

  return (
    <div className="seller-dashboard">

      {/* ── HEADER ── */}
      <header className="dashboard-header">
        <div className="header-content">

          <div className="header-brand">
            <div className="brand-logo">
              <Sparkles size={18} />
            </div>
            <div>
              <h1 className="dashboard-title">Planora</h1>
              <p className="header-subtitle">Welcome back, {user.username}</p>
            </div>
          </div>

          <div className="header-right">
            <div className="header-badge">
              <span className="dot" />
              Seller Pro
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              Sign out
            </button>
          </div>

        </div>
      </header>

      {/* ── NAV ── */}
      <nav className="dashboard-nav">
        <div className="nav-inner">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`nav-tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main className="dashboard-main">

        {/* ═══════════ OVERVIEW ═══════════ */}
        {activeTab === "overview" && (
          <div className="dashboard-content">

            {/* Stats */}
            <section className="stats-section">
              <div className="section-header">
                <span className="section-title">Key Metrics</span>
                <span className="section-meta">All time</span>
              </div>
              <div className="stats-grid">
                {stats.map((s) => (
                  <div key={s.label} className={`stat-card ${s.cls}`}>
                    <div className="stat-icon">{s.icon}</div>
                    <p className="stat-label">{s.label}</p>
                    <p className="stat-value">{s.value}</p>
                    <span className="stat-trend">↑ Live</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Charts */}
            <div className="charts-container">

              {/* Monthly bookings */}
              <section className="chart-section">
                <p className="chart-title">Bookings by Month</p>
                <p className="chart-subtitle">Bookings & rooms over time</p>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={analyticsData.bookingsByMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="month" tick={axisStyle} />
                      <YAxis tick={axisStyle} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "0.78rem", fontWeight: 600 }} />
                      <Line type="monotone" dataKey="bookings"    stroke="#FF385C" strokeWidth={2.5} dot={{ r: 4, fill: "#FF385C" }} name="Bookings" />
                      <Line type="monotone" dataKey="roomsBooked" stroke="#38BDF8" strokeWidth={2.5} dot={{ r: 4, fill: "#38BDF8" }} name="Rooms" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* By Category */}
              <section className="chart-section">
                <p className="chart-title">Bookings by Category</p>
                <p className="chart-subtitle">Distribution across hotel types</p>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={analyticsData.bookingsByCategory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="category" tick={axisStyle} />
                      <YAxis tick={axisStyle} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill="#38BDF8" radius={[8, 8, 0, 0]} name="Bookings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* By Season */}
              <section className="chart-section">
                <p className="chart-title">Seasonal Demand</p>
                <p className="chart-subtitle">Bookings per season</p>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={analyticsData.bookingsBySeason}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="season" tick={axisStyle} />
                      <YAxis tick={axisStyle} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="bookings" fill="#FF385C" radius={[8, 8, 0, 0]} name="Bookings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Status Pie */}
              <section className="chart-section">
                <p className="chart-title">Booking Status</p>
                <p className="chart-subtitle">Current status breakdown</p>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={analyticsData.bookingsByStatusChart}
                        cx="50%" cy="50%"
                        outerRadius={100}
                        innerRadius={50}
                        dataKey="count"
                        label={({ status, count }) => `${status}: ${count}`}
                        labelLine={{ stroke: "#CBD5E1", strokeWidth: 1 }}
                      >
                        {analyticsData.bookingsByStatusChart.map((_, i) => (
                          <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Occupancy — full width */}
              {(() => {
                const topOccupancy = [...analyticsData.occupancyByHotel]
                  .sort((a, b) => b.occupancyRate - a.occupancyRate)
                  .slice(0, 5);
                return (
                  <section className="chart-section full-width">
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
                      <div>
                        <p className="chart-title">Hotel Occupancy Rates</p>
                        <p className="chart-subtitle">Top 5 best-performing properties</p>
                      </div>
                      <span style={{
                        fontSize: "0.72rem", fontWeight: 700, padding: "4px 12px",
                        background: "#ECFDF5", color: "#059669", borderRadius: 100,
                        whiteSpace: "nowrap", marginTop: 2,
                      }}>
                        Top {topOccupancy.length} hotels
                      </span>
                    </div>
                    <div className="chart-wrapper">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={topOccupancy}
                          margin={{ top: 10, right: 20, left: 10, bottom: 60 }}
                          barCategoryGap="35%"
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                          <XAxis
                            dataKey="hotelName"
                            tick={{ fill: "#64748B", fontSize: 12, fontWeight: 600 }}
                            angle={-35}
                            textAnchor="end"
                            interval={0}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            tick={axisStyle}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `${v}%`}
                            domain={[0, 100]}
                          />
                          <Tooltip content={<CustomTooltip suffix="%" />} />
                          <Bar dataKey="occupancyRate" radius={[10, 10, 0, 0]} name="Occupancy %">
                            {topOccupancy.map((entry, i) => (
                              <Cell
                                key={i}
                                fill={entry.occupancyRate >= 70 ? "#10B981" : entry.occupancyRate >= 40 ? "#38BDF8" : "#FF385C"}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </section>
                );
              })()}

              {/* Revenue by Season */}
              <section className="chart-section full-width">
                <p className="chart-title">Revenue by Season</p>
                <p className="chart-subtitle">Earnings breakdown across seasons</p>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={analyticsData.bookingsBySeason}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="season" tick={axisStyle} />
                      <YAxis tick={axisStyle} />
                      <Tooltip content={<CustomTooltip prefix="$" />} />
                      <Bar dataKey="revenue" fill="#F59E0B" radius={[8, 8, 0, 0]} name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

            </div>
          </div>
        )}

        {/* ═══════════ HOTELS ═══════════ */}
        {activeTab === "hotels" && (
          <div className="hotels-section">
            <h2>My Hotels</h2>
            {analyticsData.hotels.length > 0 ? (
              <div className="hotels-grid">
                {analyticsData.hotels.map((hotel, idx) => {
                  const occ = analyticsData.occupancyByHotel.find(
                    (h) => h.hotelName === hotel.name
                  ) || { occupancyRate: 0, totalBookings: 0 };

                  return (
                    <div key={hotel._id} className="hotel-card" style={{ animationDelay: `${idx * 0.07}s` }}>
                      <div className="hotel-card-top" />
                      <div className="hotel-card-body">
                        <div className="hotel-card-header">
                          <h3>{hotel.name}</h3>
                          <span className={`category-badge ${hotel.category}`}>{hotel.category}</span>
                        </div>
                        <div className="hotel-details">
                          {[
                            ["Location",       hotel.location],
                            ["Price / night",  `$${hotel.pricePerNight}`],
                            ["Total Rooms",    hotel.rooms],
                            ["Bookings",       occ.totalBookings],
                          ].map(([label, val]) => (
                            <div className="detail-row" key={label}>
                              <span className="detail-label">{label}</span>
                              <span className="detail-value">{val}</span>
                            </div>
                          ))}
                          <div className="detail-row">
                            <span className="detail-label">Occupancy</span>
                            <span className={`occupancy-pill ${occupancyClass(occ.occupancyRate)}`}>
                              {occ.occupancyRate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-data">
                <p>You haven't listed any hotels yet.</p>
                <button className="btn-add-hotel" onClick={() => navigate("/add-hotel")}>
                  Add Your First Hotel
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ BOOKINGS ═══════════ */}
        {activeTab === "bookings" && (
          <div className="bookings-section">
            <h2>Recent Bookings</h2>
            {analyticsData.recentBookings.length > 0 ? (
              <div className="bookings-table-wrapper">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      {["Hotel Name", "Check-In", "Check-Out", "Rooms", "Payment", "Revenue", "Status"].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.recentBookings.map((b) => (
                      <tr key={b._id}>
                        <td>{b.hotelName}</td>
                        <td>{new Date(b.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                        <td>{new Date(b.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                        <td>{b.roomsBooked}</td>
                        <td style={{ textTransform: "capitalize", fontSize: "12px" }}>{b.paymentMethod?.replace("_", " ") || "—"}</td>
                        <td style={{ fontWeight: 700, color: "#0F172A" }}>${b.totalPrice.toFixed(2)}</td>
                        <td><span className={`status-badge ${b.status}`}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-data">
                <p>No bookings yet.</p>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default SellerDashboard;