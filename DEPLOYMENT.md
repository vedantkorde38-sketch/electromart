# 🚀 ElectroMart — 100% Free Cloud Deployment Guide

This step-by-step guide explains how to deploy the entire **ElectroMart** full-stack application to the internet **completely free**, with zero credit card required.

---

## 🛠️ Free Tech Stack Breakdown

| Component | Free Platform | Tier Specs | Why This Platform? |
|---|---|---|---|
| **Database** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) | **M0 Free Shared** (512 MB storage, forever free) | Official cloud MongoDB, reliable, auto-scales connection pools |
| **Backend API** | [Render](https://render.com) | **Free Web Service** (750 free hours/month) | Native Node.js support, automatic SSL (`https://`), environment variable secrets |
| **Frontend UI** | [Vercel](https://vercel.com) *(or Render)* | **Hobby Tier** (100 GB bandwidth, unlimited domains) | Instant edge CDN for React/Vite, automatic CI/CD on git push |

---

## 📋 Pre-Deployment Checklist (5 Minutes)

Before deploying, ensure you have:
1. A free [GitHub Account](https://github.com/).
2. Push your `electromart` folder to a new GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of ElectroMart full-stack project"
   git branch -M main
   git remote add origin https://github.com/<your-username>/electromart.git
   git push -u origin main
   ```

---

## 🟢 Step 1: Set Up Free Cloud MongoDB (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Click **Create Deployment** → Select **M0 (Free)**.
3. Choose your nearest cloud region (e.g. `aws / Mumbai (ap-south-1)` or `aws / Singapore`).
4. Click **Create**.
5. **Security & Access Configuration**:
   - **Username & Password**: Choose a username (e.g., `electromart_admin`) and a secure password. **Save these!**
   - **IP Access List**: Select **"Allow Access from Anywhere"** (`0.0.0.0/0`). *(This allows your free cloud hosting on Render to connect to your database).*
6. Click **Database** → **Connect** → Choose **Drivers** (Node.js).
7. Copy your connection string. It will look like:
   ```text
   mongodb+srv://electromart_admin:<password>@cluster0.abcde.mongodb.net/electromart?retryWrites=true&w=majority
   ```
   *(Replace `<password>` with the password you created in step 5).*

---

## 🟣 Step 2: Deploy Backend to Render (100% Free)

1. Sign up / Log in to [Render](https://render.com) using your GitHub account.
2. Click **New +** → **Web Service**.
3. Select your `electromart` repository from GitHub.
4. Fill in the service settings:
   - **Name**: `electromart-backend` (or your choice)
   - **Region**: Choose same region as your MongoDB (e.g., *Singapore* or *Frankfurt*)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: **Free**
5. Scroll down to **Environment Variables** and add:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGODB_URI` | *[Paste your MongoDB Atlas connection string from Step 1]* |
| `JWT_SECRET` | `electromart_super_secret_jwt_key_2026_production` |
| `JWT_EXPIRE` | `7d` |
| `ADMIN_EMAIL` | `admin@electromart.com` |
| `ADMIN_PASSWORD` | `Admin@12345` |
| `CLIENT_URL` | `https://your-frontend-domain.vercel.app` *(Can update after Step 3)* |

6. Click **Deploy Web Service**.
7. Once deployment finishes, Render gives you a live backend URL, for example:
   👉 `https://electromart-backend.onrender.com`
8. Test your backend by visiting:
   `https://electromart-backend.onrender.com/api/health`
   *(It will display `{"status":"OK","service":"ElectroMart E-Commerce API"}`).*
   > **Note**: On the very first startup, the backend automatically seeds all 37 products, 12 categories, coupons, and test accounts directly into your MongoDB Atlas cloud database!

---

## 🔷 Step 3: Deploy Frontend to Vercel (100% Free)

1. Sign up / Log in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **Add New...** → **Project**.
3. Import your `electromart` repository.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and select `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://electromart-backend.onrender.com/api` *(Your Render backend URL from Step 2 followed by `/api`)* |

6. Click **Deploy**.
7. In ~30 seconds, your site is live! Vercel provides a custom domain such as:
   👉 `https://electromart-frontend.vercel.app`
8. *(Optional final touch)*: Go back to Render → Environment Variables → Update `CLIENT_URL` with your new Vercel URL (`https://electromart-frontend.vercel.app`).

---

## ⚡ Alternative: Single-Service All-In-One Free Deploy on Render

If you prefer **one single URL** and zero CORS configuration:
1. In Render, create **Web Service** pointing to your repository.
2. Leave **Root Directory** blank (uses root of project).
3. Set **Build Command**: `npm run build`
4. Set **Start Command**: `npm start`
5. Add the MongoDB and JWT environment variables.
6. Render will automatically build the React frontend and serve it directly from Node.js Express at a single URL!

---

## 💡 Important Tips for Free Hosting
- **Render Cold Starts**: On Render's free tier, servers spin down after 15 minutes of inactivity to save energy. The very first request after sleeping may take 30–50 seconds to boot up; subsequent requests are lightning-fast. Mention this to evaluators during a viva: *"The backend uses cloud serverless auto-sleep to minimize resource consumption."*
- **Database Persistence**: Because we connected MongoDB Atlas, any orders you place, products you add, or user accounts you register will be permanently preserved in the cloud even when the server sleeps.
