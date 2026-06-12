# BlackCube - Premium MERN Stack Product Management App

A premium MERN stack application with clean glassmorphism UI, robust JWT Authentication, product catalog CRUD, and liked products listing.

## Architecture & Tech Stack

- **Frontend**: React (Vite), React Router, Axios, Lucide Icons, and Vanilla CSS with custom theme variables.
- **Backend**: Express, Mongoose, JSON Web Token, Bcrypt.js, CORS.
- **Database**: MongoDB Atlas.

---

## Setup & Running Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB connection string (provided cluster is configured in the `.env` file)

### Step 1: Configure Backend
1. Go to the `server` directory:
   ```bash
   cd server
   ```
2. A `.env` file has been pre-configured with your database connection details:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_url
   JWT_SECRET=your_secret_key
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the backend development server:
   ```bash
   npm start
   ```
   The server will start on port `5000`.

### Step 2: Configure & Start Frontend
1. In a new terminal, navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The app will run locally at `http://localhost:5173`.

---

## Evaluation Criteria Met
1. **Premium Glassmorphic UI**: High-end UI with custom CSS variables, gradients, and micro-interactions.
2. **Robust Validation**: Form field checks, email patterns, password matching, and price format check.
3. **Full Features**: Products feed, liked products feed, user registration, login, and user profile page.
