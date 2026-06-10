# Smart Palika - AI-Powered Citizen Services for Nepal's Municipalities

An AI-powered citizen service platform for Nepal's Ward Offices and Municipalities.

## Project Structure

```
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Express.js + PostgreSQL API
├── database/          # SQL schema + seed scripts
├── docs/              # API documentation
├── assets/            # Static assets
├── .env.example       # Environment variable template
└── README.md
```

## Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS 4, Redux Toolkit |
| Backend   | Node.js, Express.js           |
| Database  | PostgreSQL                    |
| Auth      | JWT + bcryptjs (3 roles: customer, staff, admin) |

## Getting Started

### 1. Database

Ensure PostgreSQL is running, then:

```bash
npm run db:init
```

This creates the schema and seeds sample users.

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend

```bash
cd frontend
# Use Node.js 22+
nvm use 22
npm install
npm run dev
```

### Test Credentials

| Role     | Email                       | Password      |
|----------|-----------------------------|---------------|
| Customer | ram.customer@palika.gov.np  | Password123!  |
| Staff    | sita.staff@palika.gov.np    | Password123!  |
| Admin    | admin@palika.gov.np         | Password123!  |
