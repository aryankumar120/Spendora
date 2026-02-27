# Spendora

Spendora is an intelligent subscription spend optimization platform that demonstrates a full backend-first workflow: user management, subscription tracking, Redis caching, background jobs, and asynchronous optimization reports. This repository contains a Node/Express backend and a React (Vite) frontend that work together end-to-end.

## What This Project Does

- Enables users to create and manage recurring subscriptions such as streaming services, SaaS tools, and utilities.

- Calculates monthly and yearly subscription costs to give clear visibility into recurring spending.

- Analyzes subscription data to identify high-cost subscriptions and potential savings opportunities.

- Generates subscription optimization reports asynchronously without blocking the application.

- Stores historical optimization reports to track spending patterns and cost changes over time.

- Automatically handles background processing using job queues for scalability and performance.

- Uses caching to deliver fast subscription dashboards while reducing database load.

- Supports multiple users dynamically with complete data isolation per user.

- Provides a clean, user-friendly dashboard to interact with backend intelligence.

- Designed as a backend-first system that demonstrates real-world architecture patterns.

## Tech Stack

Frontend
- React (Vite)
- Tailwind CSS
- shadcn/ui components
- TanStack Query (React Query)
- React Router DOM

Backend
- Node.js + Express
- PostgreSQL (Sequelize ORM)
- Redis + BullMQ (queues and background jobs)

## Repository Structure

- `spendora-frontend` React UI
- `spendora-backend` API server + workers

## Backend API Contract

Base URL: `http://localhost:4000/api/v1`

- `POST /users`
- `GET /subscriptions/user/:userId`
- `POST /subscriptions`
- `POST /optimize/user/:userId/generate`
- `GET /optimize/user/:userId/reports`

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL running locally
- Redis running locally

### Backend

1. Go to the backend directory:
   - `cd spendora-backend`
2. Install dependencies:
   - `npm install`
3. Configure `.env`:
   - Ensure `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `PORT` are correct.
4. Start the API server:
   - `npm run dev`
5. Start the optimization worker in a second terminal:
   - `node src/jobs/optimization.worker.js`

The worker is required to process optimization reports. Without it, report generation will stay in “Processing…”.

### Frontend

1. Go to the frontend directory:
   - `cd spendora-frontend`
2. Install dependencies:
   - `npm install`
3. Configure `.env`:
   - `VITE_API_BASE_URL=http://localhost:4000/api/v1`
4. Start the frontend:
   - `npm run dev`

Open `http://localhost:5173` in your browser.

## How to Use

1. Create a user on the User Selection page.
2. Add subscriptions from the Dashboard.
3. Generate an Optimization Report.
4. View latest results in Optimization and history in Reports.

## Features and Outcomes

- Real-time subscription management tied to actual backend data.
- Asynchronous optimization processing using queues and a worker.
- Historical report tracking with breakdowns per subscription.
- Clean, light-themed UI designed for a backend-first demo.

## Output Images

