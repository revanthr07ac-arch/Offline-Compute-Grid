# Deployment Guide: Offline Compute Grid

This project is configured as a full-stack production application (Vite React 19 Frontend + Node.js Express API) that can be deployed to any cloud platform with zero configuration.

---

## Architecture Overview

- **Unified Single-Port Deployment**: In production, the Node.js Express server automatically serves the compiled Vite static assets (`dist`) while handling all `/api/...` endpoints on a single port (`PORT`).
- **SPA Routing Support**: The server includes client-side routing fallback so direct links (e.g. `/devices`, `/tasks`, `/performance`) work seamlessly without 404 errors.
- **Autonomous Grid Simulation**: Background task progression and node telemetry polling continue running smoothly in cloud environments.

---

## 1. Deploy on Render (Recommended — 100% Free)

Render provides free cloud hosting for Node.js web services and natively supports the included `render.yaml` blueprint.

### Steps:
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: configure cloud production deployment"
   git push origin main
   ```
2. Open [dashboard.render.com](https://dashboard.render.com).
3. Click **New +** > **Web Service**.
4. Connect your GitHub repository (`Offline-Compute-Grid`).
5. Configure the service:
   - **Name**: `offline-compute-grid`
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
6. Add Environment Variables (optional, for AI features):
   - `GEMINI_API_KEY`: *(Your Google AI Studio API Key)*
   - `NODE_ENV`: `production`
7. Click **Create Web Service**. Render will build the frontend, compile the backend, and provide you with a live HTTPS URL (e.g. `https://offline-compute-grid.onrender.com`).

---

## 2. Deploy on Railway

1. Go to [railway.app](https://railway.app) and click **New Project**.
2. Select **Deploy from GitHub repo** and pick `Offline-Compute-Grid`.
3. Railway automatically detects either the `Dockerfile` or the Node.js scripts (`npm run build` and `npm start`).
4. In **Variables**, add:
   - `PORT`: `3001` (or let Railway assign automatically)
   - `GEMINI_API_KEY`: *(Your API key)*
5. Click **Deploy**. Railway will generate a live public domain.

---

## 3. Deploy with Docker

A multi-stage `Dockerfile` is provided in the repository root.

### Build and Run locally or on any VPS:
```bash
# Build the Docker image
docker build -t offline-compute-grid .

# Run the container
docker run -d -p 3001:3001 -e GEMINI_API_KEY="your_api_key_here" --name compute-grid offline-compute-grid

# Access the application
http://localhost:3001
```

---

## 4. Deploy Frontend Only on Vercel

If you only want to host the frontend interface on Vercel:
1. Connect your repo on [vercel.com](https://vercel.com).
2. The included `vercel.json` will automatically configure:
   - Build Command: `npm run build:client`
   - Output Directory: `dist`
   - SPA Rewrite rules for client-side navigation.

---

## Local Production Testing

To test the production build locally before deploying:
```bash
npm run build
npm start
```
The server will start on `http://localhost:3001` (or your configured `PORT`), serving both the UI and backend simulation.
