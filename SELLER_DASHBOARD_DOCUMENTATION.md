# Seller Dashboard Documentation

## Overview

The Seller Dashboard is a comprehensive analytics platform designed for hotel owners and sellers to track their business performance, manage their listings, and view detailed booking analytics with visualizations.

## Features

### 1. **Key Metrics Dashboard**
- **Total Revenue**: Sum of all booking revenues
- **Total Bookings**: Number of confirmed bookings
- **Rooms Booked**: Total number of rooms booked across all hotels
- **My Hotels**: Count of active hotel listings

### 2. **Analytics Charts**

#### Monthly Bookings Chart (Line Graph)
- Tracks booking trends over time
- Shows both number of bookings and rooms booked per month
- Helps identify peak seasons and low periods
- Useful for inventory and pricing decisions

#### Bookings by Category (Bar Chart)
- Breaks down bookings by hotel type (luxury, budget, boutique, resort, business)
- Shows revenue distribution across categories
- Helps understand which hotel types are most popular

#### Seasonal Analytics (Bar Chart)
- Groups bookings into seasons: Summer, Winter, Spring, Fall
- Displays seasonal trends in your bookings
- Useful for seasonal marketing and pricing strategies

#### Booking Status Distribution (Pie Chart)
- Visual breakdown of booking statuses: Confirmed, Pending, Cancelled
- Quick insight into booking health and cancellation rates

#### Hotel Occupancy Rate (Bar Chart)
- Shows occupancy percentage for each of your hotels
- Identifies underperforming properties
- Helps optimize pricing and marketing per property

#### Revenue by Season (Bar Chart)
- Displays revenue generation across seasons
- Helps plan annual budgets and resource allocation

### 3. **My Hotels Section**
- View all your active hotel listings
- See key details:
  - Hotel name and location
  - Price per night
  - Total available rooms
  - Number of bookings
  - Current occupancy rate
- Category badge showing hotel type
- Color-coded category indicators for quick identification

### 4. **Recent Bookings Table**
- Last 10 bookings for your properties
- Columns include:
  - Hotel Name
  - Check-in Date
  - Check-out Date
  - Number of Rooms Booked
  - Total Revenue
  - Booking Status (Confirmed/Pending/Cancelled)
- Status indicators with color coding

## Navigation

### Tabs
1. **Overview** - Main dashboard with all analytics and metrics
2. **My Hotels** - Detailed view of all your hotel listings
3. **Recent Bookings** - Table showing your most recent bookings

## Getting Started

### Sign Up as a Seller

1. Go to the Authentication page (`/auth`)
2. Click "Sign Up"
3. Select "Host/Seller" role
4. Fill in:
   - Username
   - Email
   - Password
5. Create account
6. Log in with your credentials
7. Access dashboard at `/seller-dashboard`

### Access the Dashboard

- Once logged in as a seller, navigate to `/seller-dashboard`
- Or add a link in your navigation menu
- The dashboard will load your analytics automatically

## API Endpoints

### GET /api/hotels/analytics/dashboard
Fetches all analytics data for the logged-in seller

**Authentication Required**: Bearer Token
**Response includes**:
- User's hotels
- Total bookings, rooms booked, and revenue
- Monthly booking trends
- Category-wise booking distribution
- Seasonal analytics
- Booking status distribution
- Occupancy by hotel
- Recent bookings (last 10)

## Data Models Used

### User Model
- Added "seller" role option
- Tracks user type (user/admin/seller)

### Hotel Model
- `createdBy`: References the seller who created the hotel
- Used to filter hotels belonging to a specific seller

### Booking Model
- Links to hotels and users
- Contains check-in/out dates, room count, pricing, and status
- Used for all analytics calculations

## Analytics Calculations

### Occupancy Rate Calculation
```
Occupancy Rate = (Total Room Days Booked / (Total Rooms × 365)) × 100
Where Room Days = Number of Rooms × Days Stayed
```

### Seasonal Classification
- **Summer**: June, July, August (months 5-7)
- **Winter**: December, January, February (months 11-1)
- **Spring**: March, April, May (months 2-4)
- **Fall**: September, October, November (months 8-10)

## Color Scheme

### Status Badges
- **Confirmed**: Green (#d4edda)
- **Pending**: Yellow (#fff3cd)
- **Cancelled**: Red (#f8d7da)

### Category Colors
- **Luxury**: Gold
- **Budget**: Light Blue
- **Boutique**: Green
- **Resort**: Red
- **Business**: Gray

### Chart Colors
- Primary: #FF6B6B (Red)
- Secondary: #4ECDC4 (Teal)
- Tertiary: #45B7D1 (Blue)
- Accent 1: #FFA07A (Salmon)
- Accent 2: #98D8C8 (Mint)
- Accent 3: #F7DC6F (Gold)

## Features Walkthrough

### Viewing Analytics
1. Log in as a seller
2. Go to `/seller-dashboard`
3. On "Overview" tab, see all metrics at a glance
4. Scroll down to view detailed charts
5. Hover over chart elements for exact values

### Managing Hotels
1. Click on "My Hotels" tab
2. View all your listings
3. See real-time occupancy and booking stats
4. Click on hotel cards to get more details (expandable feature can be added)

### Tracking Bookings
1. Click on "Recent Bookings" tab
2. View your last 10 bookings in table format
3. Check status of each booking
4. Sort by relevant columns (feature can be enhanced)

## Responsive Design

The dashboard is fully responsive:
- **Desktop**: Full grid layout with side-by-side charts
- **Tablet**: Adjusted grid (2 columns)
- **Mobile**: Single column layout, stackable elements
- **Small Devices**: Optimized touch interactions

## Technologies Used

### Frontend
- **React**: UI framework
- **Recharts**: Data visualization library
- **Axios**: HTTP client for API calls
- **React Router**: Routing
- **Framer Motion**: Animations
- **Lucide React**: Icons
- **React Hot Toast**: Notifications

### Backend
- **Node.js/Express**: Server framework
- **MongoDB**: Database
- **Mongoose**: ODM
- **JWT**: Authentication
- **Bcrypt**: Password hashing

## Error Handling

- **Missing Authentication**: Redirects to login page
- **Insufficient Permissions**: Shows error and redirects to home
- **Failed Data Load**: Shows error message with retry button
- **Network Errors**: Displays toast notifications

## Future Enhancements

1. **Export Analytics**
   - Download reports as PDF/Excel
   - Email reports to seller

2. **Advanced Filtering**
   - Filter bookings by date range
   - Filter hotels by category or performance

3. **Recommendations**
   - AI-driven pricing suggestions
   - Availability optimization tips

4. **Real-time Notifications**
   - New booking alerts
   - Cancellation notifications
   - Revenue milestones

5. **Detailed Hotel Performance**
   - Individual hotel analytics page
   - Guest reviews and ratings
   - Revenue per hotel

6. **Booking Management**
   - Accept/Reject pending bookings
   - Manage cancellations
   - Add notes to bookings

7. **Inventory Management**
   - Add/remove rooms
   - Mark dates as unavailable
   - Seasonal pricing

## Troubleshooting

### Dashboard Not Loading
1. Ensure you're logged in as a seller
2. Check browser console for errors
3. Verify backend server is running on port 5000
4. Check network tab in DevTools

### No Bookings Showing
1. Ensure hotels are created and have bookings
2. Verify bookings have confirmed status
3. Check date ranges for bookings

### Charts Not Rendering
1. Verify Recharts is installed: `npm install recharts`
2. Clear browser cache and reload
3. Check for console errors

## Setup Instructions

### Backend Setup
1. Add `getSellerAnalytics` export to hotelController.js
2. Update hotelRoutes.js to include analytics route
3. Update adminMiddleware.js to accept seller role
4. Restart backend server

### Frontend Setup
1. Create SellerDashboard.jsx page component
2. Create SellerDashboard.css styles
3. Update App.jsx with dashboard route
4. Update AuthPage.jsx to support seller signup
5. Run `npm install recharts` in frontend directory
6. Start frontend development server

## Support

For issues or questions about the seller dashboard:
1. Check this documentation
2. Review the code comments in components
3. Check browser console for error messages
4. Verify all backend endpoints are working

---

**Version**: 1.0
**Last Updated**: March 2026
**Status**: Ready for Production
