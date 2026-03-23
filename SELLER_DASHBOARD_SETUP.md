# Seller Dashboard - Quick Setup Guide

## Installation Steps

### 1. Backend Changes (Already Done)
✅ Updated `/backend/models/User.js` - Added "seller" role
✅ Updated `/backend/controllers/authController.js` - Allow seller role
✅ Updated `/backend/middleware/adminMiddleware.js` - Allow seller access
✅ Added `/backend/controllers/hotelController.js` - `getSellerAnalytics()` function
✅ Updated `/backend/routes/hotelRoutes.js` - Added analytics route

### 2. Frontend Changes (Already Done)
✅ Created `/frontned/src/pages/SellerDashboard.jsx` - Main dashboard component
✅ Created `/frontned/src/pages/SellerDashboard.css` - Dashboard styles
✅ Updated `/frontned/src/App.jsx` - Added dashboard route
✅ Updated `/frontned/src/pages/AuthPage.jsx` - Added seller signup option

### 3. Install Required Package

From the `frontned` directory, run:

```bash
npm install recharts
```

This installs the charting library needed for all graphs and visualizations.

### 4. Restart Servers

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontned
npm run dev
```

## Verify Installation

1. **Start both servers**
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:5173` (or as configured)

2. **Test Seller Signup**
   - Go to `http://localhost:5173/auth`
   - Click "Sign Up"
   - Select "Host/Seller" option
   - Create an account

3. **Access Dashboard**
   - Log in with seller account
   - Navigate to `/seller-dashboard`
   - Should see analytics loading

4. **Test API**
   - With valid token, test: `GET /api/hotels/analytics/dashboard`
   - Should return all analytics data

## File Structure

```
planora-final/
├── backend/
│   ├── controllers/
│   │   └── hotelController.js (✅ Updated - added getSellerAnalytics)
│   ├── middleware/
│   │   └── adminMiddleware.js (✅ Updated - seller role support)
│   ├── models/
│   │   └── User.js (✅ Updated - seller role)
│   └── routes/
│       └── hotelRoutes.js (✅ Updated - analytics route)
│
├── frontned/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── SellerDashboard.jsx (✨ NEW)
│   │   │   ├── SellerDashboard.css (✨ NEW)
│   │   │   └── AuthPage.jsx (✅ Updated - seller option)
│   │   ├── App.jsx (✅ Updated - dashboard route)
│   │   └── package.json (⚠️ ADD: recharts)
│   └── node_modules/ (run npm install)
│
└── SELLER_DASHBOARD_DOCUMENTATION.md (✨ NEW)
```

## Dashboard Features Summary

### 📊 Analytics Include:
- Total revenue, bookings, rooms booked, hotel count
- Monthly booking trends (line chart)
- Bookings by category (bar chart)
- Seasonal distribution (summer/winter/spring/fall)
- Booking status distribution (pie chart)
- Occupancy rates by hotel (bar chart)
- Revenue by season (bar chart)

### 🏨 Hotel Management:
- View all listed hotels
- See occupancy rates
- Track bookings per hotel
- Category badges with pricing

### 📝 Booking History:
- Recent 10 bookings table
- Guest information
- Revenue per booking
- Booking status indicators

## Troubleshooting

### Issue: "recharts not found"
**Solution**: Run `npm install recharts` in frontned directory

### Issue: "Cannot find module 'recharts'"
**Solution**: Clear node_modules and reinstall
```bash
cd frontned
rm -rf node_modules
npm install
```

### Issue: Analytics not loading
**Solution**: 
1. Check backend is running on port 5000
2. Verify token is valid
3. Ensure user has seller role
4. Check browser console for errors

### Issue: "Seller access required"
**Solution**: 
1. Sign up with "Host/Seller" role selected
2. Log out and log back in
3. Then access /seller-dashboard

### Issue: Charts not displaying
**Solution**:
1. Run `npm install recharts` again
2. Clear browser cache
3. Hard refresh (Ctrl+Shift+R on Windows)
4. Restart development server

## API Usage Example

### Login as Seller
```bash
POST http://localhost:5000/api/auth/login
Body: { email: "seller@example.com", password: "password" }
Response: { token: "...", user: { role: "seller", ... } }
```

### Access Analytics
```bash
GET http://localhost:5000/api/hotels/analytics/dashboard
Headers: Authorization: Bearer {token}
Response: { hotels, totalBookings, charts data, ... }
```

## Database Requirements

Your MongoDB should have:
- User documents with seller role
- Hotel documents with createdBy field
- Booking documents linked to hotels and users

The analytics endpoint automatically queries and processes these relationships.

## Performance Notes

- Analytics queries are optimized but may take 1-2 seconds for large datasets
- Monthly data is sorted automatically
- Charts update in real-time as bookings are added
- Pagination can be added if > 1000 bookings needed

## Next Steps

1. Create sample data/bookings to test analytics
2. Add export features for reports
3. Implement real-time notifications
4. Add advanced filtering options
5. Create individual hotel performance pages

## Contact & Support

For detailed documentation, see: `SELLER_DASHBOARD_DOCUMENTATION.md`

---

✅ **Setup Complete!** Your seller dashboard is ready to use.
