# Offline Compute Grid UI/UX

A modern, responsive React application built with Vite and Tailwind CSS. This project provides a comprehensive user interface for managing an offline compute grid, including device monitoring, task management, performance tracking, and user authentication.

## Features

- **Authentication System**: Splash screen, Login, Account Creation, Password Recovery, and Email Verification.
- **Dashboard**: High-level overview of the compute grid.
- **Device Management**: View and manage connected devices in the grid.
- **Task Manager**: Create, track, and manage computational tasks.
- **File Manager**: Handle files associated with tasks and devices.
- **Performance Monitoring**: Real-time performance metrics and charts (powered by Recharts).
- **System Logs**: View detailed system logs.
- **Notifications**: Stay updated with system alerts.
- **User Settings & Profile**: Manage user preferences and profile information.

## Tech Stack

- **Framework**: React 19
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite 8
- **Language**: TypeScript

## Getting Started

### Prerequisites

Ensure you have Node.js and `pnpm` installed.

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm run dev
   ```

3. Build for production:
   ```bash
   pnpm run build
   ```

## Project Structure

- `src/App.tsx` - Main routing and application structure
- `src/pages/` - Contains all the page components (Dashboard, Devices, Tasks, etc.)
- `src/components/` - Reusable UI components
- `src/index.css` - Global styles and Tailwind imports
