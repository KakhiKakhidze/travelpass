# TravelPass - Gamified Culinary Tourism Platform

A full-stack web application for gamified culinary tourism experiences, built with React and Node.js.

## 🚀 Features

- **User Authentication** - Secure JWT-based authentication system
- **Venue Management** - Discover and explore restaurants and culinary venues
- **QR Code Scanning** - Check-in at venues using QR codes
- **Challenges & Rewards** - Complete challenges to earn badges and XP
- **Social Features** - Follow users, share stories, and join communities
- **Taste Memory** - Track your culinary preferences and experiences
- **Accessibility** - Built with accessibility features including colorblind support

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- React Icons
- HTML5 QR Code Scanner
- Google Maps API

### Backend
- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- Mongoose
- JWT Authentication
- Bcrypt for password hashing

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)
- Google Maps API key (for map features)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd traveltech
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   **Backend** (`backend/.env`):
   ```env
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret-key
   JWT_REFRESH_SECRET=your-jwt-refresh-secret-key
   PORT=3050
   NODE_ENV=development
   ```

   **Frontend** (`frontend/.env`):
   ```env
   REACT_APP_API_URL=http://localhost:3050/api
   REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

   See `.env.example` files in `backend/` and `frontend/` directories for reference.

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both backend (port 3050) and frontend (port 3000) servers concurrently.

   Or start them separately:
   ```bash
   # Backend only
   npm run dev:backend

   # Frontend only
   npm run dev:frontend
   ```

## 📁 Project Structure

```
traveltech/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── scripts/         # Utility scripts
│   └── server.js        # Express server
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── contexts/    # React contexts
│       ├── services/    # API services
│       └── assets/      # Images and assets
└── README.md
```

## 🔐 Environment Variables

### Backend Required Variables
- `MONGODB_URI` - MongoDB connection string (MongoDB Atlas recommended)
- `JWT_SECRET` - Secret key for JWT access tokens
- `JWT_REFRESH_SECRET` - Secret key for JWT refresh tokens

### Frontend Required Variables
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_GOOGLE_MAPS_API_KEY` - Google Maps API key

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend
```

## 📝 API Endpoints

The backend API runs on `http://localhost:3050/api` by default.

Key endpoints:
- `/api/auth` - Authentication (login, register, refresh token)
- `/api/venues` - Venue management
- `/api/stamps` - Check-in stamps
- `/api/challenges` - Challenges and rewards
- `/api/users` - User profiles
- `/api/communities` - Community features
- `/api/stories` - User stories
- `/api/collections` - Collections

## 🚢 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Ensure MongoDB Atlas network access allows your server IP
3. Deploy to platforms like Heroku, Railway, or AWS

### Frontend Deployment
1. Build the production bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `build/` folder to platforms like Netlify or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Your Name

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Google Maps API for location services
- React community for excellent documentation

