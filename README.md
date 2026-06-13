# BlackCube 🕋 — Premium MERN Stack Product Management Platform

BlackCube is a full-stack product management application featuring a **glassmorphism dark UI**, JWT + HttpOnly cookie authentication, paginated product catalog, and real-time likes. Built as a monorepo with a clean separation between a React/Vite frontend and a Node/Express backend.

[![Deploy to Render](https://wonderful-dragon-c278aa.netlify.app/)

---

## ✨ Features

### 🛡️ Security & Authentication
- **Dual-Token Strategy** — 15-minute access tokens in memory + 7-day refresh tokens in `HttpOnly` cookies (XSS-safe)
- **Transparent Refresh** — Axios interceptor silently refreshes expired tokens and queues concurrent requests to avoid race conditions
- **Password Policy** — Min 12 characters, requires uppercase, lowercase, number, and special character
- **Security Middleware** — `helmet` headers, `express-rate-limit` (100 req / 15 min), CORS origin whitelist

### ⚡ Product Management
- **Full CRUD** — Create, read, update, and delete products
- **Paginated Feed** — 8 products per page with smooth navigation
- **Interactive Likes** — Like / unlike any product; view all liked items in a dedicated tab
- **Image Fallback** — Broken image URLs gracefully fall back to a placeholder

### 🎨 Premium Glassmorphism UI
- Custom HSL design system, dark theme, frosted-glass cards, glowing buttons, micro-animations

---

## 🛠️ Tech Stack

| Layer      | Technologies                                                    |
| ---------- | --------------------------------------------------------------- |
| Frontend   | React 19, Vite, React Router v7, Axios, Lucide Icons, Zod       |
| Backend    | Node.js, Express, Mongoose, JWT, bcryptjs, Winston, Morgan      |
| Database   | MongoDB Atlas                                                   |
| Deployment | Render (Backend API) + Netlify (Frontend)                       |

---

## 📁 Project Structure

```
BlackCube/
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/       # Navbar, reusable UI
│   │   ├── context/          # AuthContext (global auth state)
│   │   ├── pages/            # Home, Login, Signup, AddProduct, EditProduct, Profile
│   │   ├── utils/            # apiClient.js (Axios with interceptors)
│   │   ├── App.jsx           # Router configuration
│   │   └── index.css         # HSL CSS design system
│   ├── public/
│   │   └── _redirects        # Netlify SPA routing
│   ├── vite.config.js        # Proxy config for local dev
│   └── package.json
│
├── server/                   # Node.js + Express backend
│   ├── models/               # Mongoose schemas (User, Product)
│   ├── routes/               # Express routers (auth, products)
│   ├── middleware/           # JWT auth middleware
│   ├── src/
│   │   ├── config/           # Config + env validation
│   │   ├── middleware/       # Centralized error handler
│   │   ├── utils/            # AppError, Winston logger
│   │   └── validators/       # Password validator
│   ├── .env.example          # Environment variable template
│   ├── server.js             # Express entry point
│   └── package.json
│
├── render.yaml               # Render deployment config
├── netlify.toml              # Netlify deployment config
├── package.json              # Root monorepo scripts
└── README.md
```

---

## 💻 Local Development

### Prerequisites
- **Node.js** v18+
- **MongoDB Atlas** account (or local MongoDB)

### 1. Clone & Install

```bash
git clone https://github.com/tanishavermaaa/BlackCode.git
cd BlackCode

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Configure Environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
REFRESH_SECRET=<generate another secret>
JWT_EXPIRES_IN=15m
REFRESH_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173
```

### 3. Run Dev Servers

**Terminal 1 — Backend:**
```bash
cd server
npm start
# Listening on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Open http://localhost:5173
```

> The Vite dev proxy automatically forwards all `/api/*` requests to `localhost:5000` so there are **no CORS issues** in development.

---

## 🚀 Deployment

### Step 1 — Fix MongoDB Atlas IP Access

> **This is required before any deployment will work.**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) → Your Project → **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access From Anywhere** → Confirm (`0.0.0.0/0`)

This allows Render's dynamic IPs to connect. You can restrict IPs later if needed.

---

### Step 2 — Deploy Backend to Render

1. Push your code to GitHub.
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub repo.
4. Use these settings:

   | Setting       | Value                    |
   | ------------- | ------------------------ |
   | Root Dir      | `server`                 |
   | Build Command | `npm install`            |
   | Start Command | `npm start`              |
   | Node Version  | `20`                     |

5. Add these **Environment Variables** in Render's dashboard:

   | Key               | Value                             |
   | ----------------- | --------------------------------- |
   | `NODE_ENV`        | `production`                      |
   | `PORT`            | `10000`                           |
   | `MONGO_URI`       | Your MongoDB Atlas connection URI |
   | `JWT_SECRET`      | A strong random secret            |
   | `REFRESH_SECRET`  | Another strong random secret      |
   | `ALLOWED_ORIGINS` | `https://your-app.netlify.app`    |
   | `JWT_EXPIRES_IN`  | `15m`                             |
   | `REFRESH_EXPIRES_IN` | `7d`                           |

6. Click **Deploy**. Copy the URL (e.g., `https://blackcube-api.onrender.com`).

---

### Step 3 — Deploy Frontend to Netlify

1. Go to [netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
2. Connect your repo and use these build settings:

   | Setting        | Value                    |
   | -------------- | ------------------------ |
   | Base directory | `client`                 |
   | Build command  | `npm run build`          |
   | Publish dir    | `client/dist`            |

3. Add this **Environment Variable** in Netlify's dashboard:

   | Key              | Value                                          |
   | ---------------- | ---------------------------------------------- |
   | `VITE_API_URL`   | `https://blackcube-api.onrender.com` (your Render URL) |

4. Click **Deploy site**.

---

### Step 4 — Update CORS on Render

Once Netlify gives you a URL (e.g., `https://blackcube.netlify.app`):
1. Go back to Render → Environment Variables
2. Update `ALLOWED_ORIGINS` to your Netlify URL
3. Redeploy the Render service

---

## 🛰️ API Reference

### Auth — `/api/auth`

| Method | Endpoint    | Description                             | Auth |
| ------ | ----------- | --------------------------------------- | ---- |
| POST   | `/signup`   | Register a new user                     | ❌   |
| POST   | `/login`    | Login, sets HttpOnly refresh cookie     | ❌   |
| POST   | `/refresh`  | Get new access token from cookie        | ❌   |
| POST   | `/logout`   | Clears the refresh token cookie         | ❌   |
| GET    | `/profile`  | Get current user profile                | ✅   |

### Products — `/api/products`

| Method | Endpoint      | Description                           | Auth |
| ------ | ------------- | ------------------------------------- | ---- |
| GET    | `/`           | List products (paginated)             | ✅   |
| GET    | `/liked`      | Get current user's liked products     | ✅   |
| POST   | `/`           | Create a product                      | ✅   |
| PUT    | `/:id`        | Update a product                      | ✅   |
| DELETE | `/:id`        | Delete a product                      | ✅   |
| POST   | `/:id/like`   | Toggle like/unlike                    | ✅   |

---

## 🔐 Security Notes

- Never commit your `.env` file (it's in `.gitignore`)
- Generate secrets with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- Restrict MongoDB Atlas to specific IPs when you know your Render static IP (requires Render paid plan)

---

## 📄 License

MIT © tanishavermaaa
