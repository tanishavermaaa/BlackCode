# BlackCube 🕋 - Premium MERN Stack Product Management Platform

BlackCube is a state-of-the-art product management application featuring a modern glassmorphism design, robust JWT/cookie-based authentication, paginated product directories, and customizable likes. 

This repository is designed as a unified monorepo for seamless developer workflow and rapid cloud deployment.

---

## ✨ Features & Architecture

### 1. 🛡️ Security & Authentication
- **Dual-Token Strategy**: Employs short-lived Access Tokens (15-minute expiry) stored in memory, paired with long-lived Refresh Tokens (7-day expiry) stored in secure, **HttpOnly cookies** to protect against XSS attacks.
- **Pre-emptive Token Refresh**: The client interceptor checks for expiration, transparently requests new access tokens from `/refresh`, and queues concurrent failed requests to avoid race conditions.
- **Robust Registration Validation**: Custom password strength policies require at least 12 characters, mixing uppercase, lowercase, numbers, and symbols. Phone numbers are validated via strict regex.
- **Middleware Protections**: Integrated `helmet` security headers and `express-rate-limit` to restrict brute-force attempts to 100 requests per 15 minutes.

### 2. ⚡ Product Management & Feed
- **Interactive Feed**: Catalog listings are paginated (defaulting to 8 items per page) to load quickly under heavy data.
- **CRUD Operations**: Support for creating new products, updating product names, prices, descriptions, and images, and deleting products instantly.
- **Interactive Likes**: Users can like or unlike products. Liked products are saved to the database and can be tracked in the **Liked Products** tab.

### 3. 🎨 Premium Glassmorphism UI
- Implemented using custom HSL color tokens, dark theme backgrounds, frosted glass-like cards, glowing interactive buttons, and smooth micro-animations.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, React Router, React Hook Form, Zod (for type-safe client validations), Axios, and Lucide Icons.
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt.js (12 salt rounds), Cookie Parser, Winston (stdout JSON logger), Morgan.
- **Database**: MongoDB (via Mongoose) with optimized compound database indices.

---

## 📁 Repository Structure

```
BlackCube/
├── client/                     # React Frontend App
│   ├── src/
│   │   ├── components/         # Reusable UI elements (Navbar, etc.)
│   │   ├── context/            # AuthContext (session state)
│   │   ├── pages/              # App screens (Login, Home, Profile, CRUD)
│   │   ├── utils/              # apiClient (Axios interceptors)
│   │   ├── App.jsx             # React router configuration
│   │   ├── index.css           # Premium HSL CSS design system
│   │   └── main.jsx            # Frontend entry point
│   ├── index.html              # HTML shell loading Outfit & Inter fonts
│   └── package.json
│
├── server/                     # Express Backend API
│   ├── models/                 # Mongoose schemas (User, Product)
│   ├── routes/                 # Express routers (auth, products)
│   ├── middleware/             # JWT auth middleware
│   ├── src/
│   │   ├── config/             # Config loaders and validations
│   │   ├── middleware/         # Centralized error handlers
│   │   ├── utils/              # AppError utility, Winston logger
│   │   └── validators/         # Password schema validators
│   ├── .env                    # Local environment config (git-ignored)
│   ├── server.js               # Main server entry point
│   └── package.json
│
├── package.json                # Monorepo root package manager
└── README.md                   # Setup documentation
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance running at `mongodb://127.0.0.1:27017` or MongoDB Atlas Cluster)

### 1. Configure the Environment
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_access_secret_key
REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_EXPIRES_IN=15m
REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

### 2. Install Dependencies & Build
Run the following command in the **root** directory to install all packages for both the client and server, and build the frontend assets:
```bash
npm run build
```

---

## 💻 Running the Application

### Development Mode
To run both the backend server and Vite client concurrently in development mode:

1. **Start the API Server**:
   ```bash
   cd server
   npm start
   ```
   *Runs at `http://localhost:5000`*

2. **Start the React Client**:
   ```bash
   cd client
   npm run dev
   ```
   *Runs at `http://localhost:5173`*

### Production Mode (Single-Unit)
To test the production build served entirely by the Express backend:
1. Ensure `NODE_ENV` is set to `production` in `server/.env`.
2. Start the backend:
   ```bash
   cd server
   npm start
   ```
   *The Express server will build the frontend assets and serve the complete app at `http://localhost:5000`.*

---

## 🛰️ API Endpoint Reference

### Authentication Routes (`/api/auth`)
- `POST /signup`: Registers a new user account.
- `POST /login`: Log in to an account; sets an HttpOnly cookie and returns an access token.
- `POST /refresh`: Exchange the refresh cookie for a new 15m access token.
- `POST /logout`: Clears the HttpOnly refresh token cookie.
- `GET /profile`: Fetch the current user profile (requires Access Token).

### Product Routes (`/api/products`)
- `GET /`: Returns a paginated list of all products (`?page=1&limit=8`).
- `GET /liked`: Retrieve all liked products for the logged-in user.
- `POST /`: Add a new product to the catalog.
- `PUT /:id`: Update details of a product.
- `DELETE /:id`: Remove a product from the database.
- `POST /:id/like`: Toggle like/unlike status on a product.
