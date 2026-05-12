# Atlas — AI-Powered Cebu Fitness & Sports Discovery

A portfolio-grade MERN stack platform for discovering gyms, parks, sports courts, and nutrition stores in Cebu City, Philippines. Features crowd prediction, community check-ins, analytics dashboard, and personalized recommendations.

## Features

### Authentication
- Email/password sign up and sign in with bcrypt hashing
- Google OAuth integration
- JWT-based sessions (7-day tokens)
- Guest mode (full browse access without account)
- Protected routes and middleware

### Discovery & Search
- Full-text search across 50+ locations
- Advanced filters: category, area, distance, price, rating, amenities
- Amenity filters: air-conditioned, parking, shower, beginner-friendly, 24/7
- Real-time distance calculation from user location
- Toggle between list and map views

### Community Check-Ins
- Check in at any location with crowd level (low/medium/high)
- Optional status notes
- Recent check-ins feed on location pages
- Check-in count tracking per location
- User check-in history

### Crowd Intelligence (ML-Like)
- Rule-based crowd prediction engine
- Factors: time of day, weekday/weekend, category, historical check-ins
- Real-time crowd level badges
- "Best time to visit" recommendations
- "Peak hours" insights
- 24-hour traffic forecast charts

### Analytics Dashboard
- Total locations and check-ins stats
- Most active locations (bar chart)
- Category breakdown (pie chart)
- Recent community activity feed
- Fitness Accessibility Score by area (1–100 scale)
- Area rankings: Excellent / Good / Moderate / Poor

### Favorites & Profile
- Save locations (heart icon with animation)
- Recently viewed locations (auto-tracked, last 10)
- User preferences: categories, areas, budget, workout times
- Profile stats: saved count, viewed count
- Sign out

### UI/UX
- Dark glassmorphism design system
- Framer Motion animations throughout
- Shimmer skeleton loading states
- Toast notifications (react-hot-toast)
- Optimistic UI updates
- Smooth page transitions
- Fully responsive (mobile bottom nav, desktop top nav)
- Recharts for analytics visualizations

### Data
- 50+ seeded locations across Cebu:
  - 10 gyms
  - 10 parks/trails
  - 10 sports courts
  - 10 nutrition stores
- Areas: IT Park, Ayala, Lahug, Banilad, Talamban, Fuente Osmeña, Mabolo, Guadalupe, SRP
- Realistic amenities, hours, ratings, prices

## Tech Stack

**Frontend:**
- React 18
- Tailwind CSS
- Framer Motion
- Leaflet (maps)
- Recharts (analytics)
- React Hot Toast
- Lucide React (icons)
- Axios

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Passport.js (Google OAuth)
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- express-rate-limit
- helmet (security)
- morgan (logging)

## Quick Start

### 1. Configure environment
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/atlas
PORT=5000
SESSION_SECRET=your_secret
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
```

### 2. Seed database
```bash
cd server
npm run seed
```

### 3. Start backend
```bash
cd server
npm run dev
```

### 4. Start frontend
```bash
cd client
npm run dev
```

Open http://localhost:5173

## API Endpoints

### Auth
- `POST /api/auth/signup` — email/password sign up
- `POST /api/auth/signin` — email/password sign in
- `GET /api/auth/google` — initiate Google OAuth
- `GET /api/auth/me` — get current user (JWT required)
- `POST /api/auth/logout` — logout

### Locations
- `GET /api/locations` — list/filter locations
- `GET /api/locations/:id` — single location with crowd prediction
- `POST /api/locations` — create location

### User
- `GET /api/user/favorites` — get favorites
- `POST /api/user/favorites/:id` — toggle favorite
- `POST /api/user/viewed/:id` — track view
- `PUT /api/user/preferences` — update preferences

### Check-ins
- `POST /api/checkins/:locationId` — create check-in
- `GET /api/checkins/:locationId` — get location check-ins
- `GET /api/checkins/stats/:locationId` — crowd stats
- `GET /api/checkins/user/me` — user's check-ins

### Analytics
- `GET /api/analytics/dashboard` — dashboard stats
- `GET /api/analytics/accessibility` — area accessibility scores
- `GET /api/analytics/heatmap` — check-in density data

### Recommendations
- `GET /api/recommendations` — smart suggestions (time-based + personalized)

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add redirect URI: `http://localhost:5000/api/auth/google/callback`
5. Copy Client ID and Secret to `.env`

## Architecture

```
atlas/
├── server/
│   ├── config/          # Passport config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── utils/           # Helpers (distance, crowd predictor, JWT)
│   ├── seed/            # Seed data
│   └── index.js         # Server entry
├── client/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # AuthContext
│   │   ├── pages/       # Route pages
│   │   ├── services/    # API client
│   │   ├── utils/       # Client-side helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css    # Tailwind + custom styles
│   └── public/
└── README.md
```

## License

MIT
