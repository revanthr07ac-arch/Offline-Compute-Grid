# Decentralized Offline Compute Grid

A modern, two-tiered Mobile Cloud Computing (MCC) platform that orchestrates location-aware task offloading across a local area network. This project provides a full-stack environment (React frontend + Node.js backend) to manage heterogeneous edge devices (PCs, laptops, smartphones) and distribute computationally intensive tasks offline, preserving battery life and avoiding expensive 3G/4G cloud connectivity.

## Features

- **Decentralized Task Orchestration**: Dynamically distribute tasks (Video Encoding, ML Training, etc.) to idle worker nodes within a local Wi-Fi cloudlet.
- **Live Polling Backend**: An Express.js API that actively simulates task processing, progression, and edge node health checks.
- **Interactive Dashboard**: A sleek, Violet-themed React SPA providing a real-time topology of connected devices and running tasks.
- **Performance Monitoring**: Live telemetry charts (powered by Recharts) mapping CPU, RAM, and Network utilization.
- **Authentication**: Simulated login flow and user session management.
- **One-Click Startup**: Integrated Windows batch script to seamlessly launch both servers and the browser environment.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Recharts, Lucide React
- **Backend**: Node.js, Express.js, TypeScript (ts-node)
- **Architecture**: Edge-Assisted IoT Task Offloading (Local Cloudlet)

## Getting Started

### The Easy Way (Windows)

The simplest way to run the entire application is to use the provided batch script:

1. Double-click the `start.bat` file in the root directory.
2. The script will automatically install dependencies, boot up the Node.js backend, start the React frontend, and open your browser to `http://localhost:8443`.

### Manual Start (Mac/Linux/Windows)

If you prefer to start the servers manually via the terminal:

**1. Start the Backend:**
```bash
cd backend
npm install
npm run dev
```
*(Runs on `http://localhost:3001`)*

**2. Start the Frontend:**
Open a new terminal window in the root directory:
```bash
npm install
npm run dev
```
*(Runs on `http://localhost:8443` and proxies `/api` to the backend)*

## Academic Context

This project serves as the practical implementation for a V Semester Project Review, strongly referencing concepts from state-of-the-art literature such as *"Online Algorithms for Location-Aware Task Offloading in Two-Tiered Mobile Cloud Environments"*. It demonstrates how localized, offline cloudlets can effectively mitigate the high latency and energy constraints typically associated with centralized cloud computing models.

---
*Developed for V Semester Project Review*
