# SmartPalika

AI-Powered Citizen Services for Nepal's Municipalities.

## Project Overview

SmartPalika is a digital governance platform that modernizes the interaction between citizens and municipal governments. It provides an end-to-end workflow for submitting, tracking, and managing municipal service applications.

### Customer Workflow
1. Browse available municipal services
2. Select a service and submit personal information
3. Upload required documents
4. Review and confirm application details
5. Make payment via eSewa integration
6. Track application status in real-time using a unique Application ID

### Staff Workflow
1. View all assigned applications in the ward dashboard
2. Review submitted documents and applicant information
3. Approve or reject applications
4. Request missing documents from applicants
5. Track application review history via timeline

### Admin Workflow
1. Oversee all applications across all wards
2. Manage staff accounts (create, delete)
3. View system-wide analytics and KPIs
4. Approve or reject applications at the admin level
5. Monitor system health and performance metrics

## Features

- **Authentication** - JWT-based login and registration with role-based access
- **Role Based Access Control** - Three roles: Citizen, Staff (Ward), Admin with distinct permissions
- **Application Tracking** - Real-time application status tracking by Application ID
- **Document Management** - Upload and verify required documents per service
- **eSewa Payment Integration** - Sandbox payment gateway for application fees
- **Staff Review Workflow** - Ward staff can review, approve, reject, and request documents
- **Application Approval System** - Multi-level approval with timeline tracking
- **AI Service Assistant** - AI-powered chatbot for document and procedure queries
- **Service Directory** - Categorized list of all municipal services with details
- **Dashboard Analytics** - Role-specific dashboards with KPIs and metrics
- **Responsive Design** - Mobile-friendly UI using TailwindCSS

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** (Build tool)
- **TailwindCSS 4** (Utility-first CSS)
- **Redux Toolkit** (State management)
- **React Router DOM** (Routing)
- **Lucide React** (Icons)

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** (JSON Web Tokens for authentication)
- **bcryptjs** (Password hashing)
- **dotenv** (Environment variable management)

### Payment
- **eSewa Sandbox** (Payment gateway integration)

## Installation

### Prerequisites
- Node.js 22+
- MongoDB (local or Atlas)
- npm or yarn

### Clone Repository
```bash
git clone <repository-url>
cd smartpalika
```

### Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=mongodb://localhost:27017/smartpalika
JWT_SECRET=your_jwt_secret_key_here
PORT=5000

# eSewa Sandbox Credentials
ESEWA_MERCHANT_ID=
ESEWA_SECRET_KEY=
ESEWA_SUCCESS_URL=http://localhost:5173/esewa-success
ESEWA_FAILURE_URL=http://localhost:5173/esewa-failure
```

## Database Setup

The application uses MongoDB. Ensure MongoDB is running locally or provide a remote `MONGO_URI`.

The database schema and seed data are created automatically on first run. No manual migration commands are needed.

## Running Development Environment

### Backend (port 5000):
```bash
cd backend
npm run dev
```

### Frontend (port 5173):
```bash
cd frontend
npm run dev
```

The frontend Vite dev server proxies API requests to the backend.

## Build for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm start
```

## User Roles

### Customer (Citizen)
- Register and login to the platform
- Browse municipal services
- Submit applications with required documents
- Upload supporting documents
- Track application status using Application ID
- Make payments via eSewa

### Staff (Ward)
- View applications assigned to their ward
- Review applicant information and documents
- Approve or reject applications
- Request missing documents from applicants
- View application timeline and history

### Admin
- Manage all applications across all wards
- Create and delete staff accounts
- View system-wide analytics and KPIs
- Approve or reject any application
- Monitor system health metrics

## Test Credentials

| Role     | Email                       | Password      |
|----------|-----------------------------|---------------|
| Customer | ram.customer@palika.gov.np  | Password123!  |
| Staff    | sita.staff@palika.gov.np    | Password123!  |
| Admin    | admin@palika.gov.np         | Password123!  |

## API Documentation

Refer to [API.md](./API.md) for complete API reference.

## Folder Structure

```
smartpalika/
├── frontend/
│   └── src/
│       ├── api/              # API service functions
│       ├── assets/           # Static assets (images)
│       ├── components/       # Shared components
│       ├── config/           # Configuration files
│       ├── constants/        # Constants and enums
│       ├── data/             # Static data (services)
│       ├── hooks/            # Custom React hooks
│       ├── pages/            # Page components
│       │   ├── Apply/        # Application flow pages
│       │   ├── DashboardAdmin.tsx
│       │   ├── DashboardCustomer.tsx
│       │   ├── DashboardStaff.tsx
│       │   ├── LandingPage.tsx
│       │   ├── Login.tsx
│       │   ├── ServiceDirectory.tsx
│       │   ├── Signup.tsx
│       │   └── TrackApplication.tsx
│       ├── store/            # Redux store and slices
│       └── utils/            # Utility functions
├── backend/
│   ├── config/               # Database configuration
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Auth and role middleware
│   ├── models/              # Mongoose models
│   └── routes/
│       └── v1/               # API route definitions
├── docs/                    # Documentation
├── assets/                  # Project assets
├── API.md                   # API documentation
└── README.md
```

## Security Measures

- **Role-Based Access Control** - Each role has strictly defined permissions enforced at both route and component level
- **Authentication Protection** - JWT tokens with 7-day expiry; all protected routes validate tokens
- **Input Validation** - Client and server-side validation for all form inputs
- **File Upload Validation** - Document upload validation with type and size checks
- **Anti User Enumeration** - Generic error messages on login failure ("Invalid credentials")
- **Duplicate Submission Prevention** - Check for existing email/phone during registration
- **XSS Protection** - Input sanitization utility for user display names
- **Protected Routes** - Frontend route guards redirect unauthorized users to login

## Deployment Guide

### Build Steps
1. Build frontend: `cd frontend && npm run build`
2. Configure environment variables in backend `.env`
3. Set `NODE_ENV=production` in backend
4. Serve frontend build from backend or static hosting
5. Start backend: `cd backend && npm start`

### Production Considerations
- Use a production MongoDB instance (Atlas or self-hosted)
- Set strong `JWT_SECRET`
- Configure proper CORS settings
- Use HTTPS in production
- Set up proper file storage for uploaded documents

## Troubleshooting

### MongoDB Connection Error
Ensure MongoDB is running: `mongod` or check your `MONGO_URI` connection string.

### Frontend API Proxy Issues
The Vite dev server proxies `/api` requests to `http://localhost:5000`. Ensure the backend is running on port 5000.

### Token Expired
Users are automatically redirected to login when their JWT token expires (7 days).

### File Upload Issues
Check that uploaded files meet size and type requirements. Ensure the upload directory exists and is writable.

## Changelog

### v1.0.0
- Initial release with core features
- Authentication and role-based access control
- Application submission and tracking
- Document upload and management
- eSewa payment integration
- Staff review and approval workflow
- Admin dashboard with analytics
- AI-powered service assistant chatbot
- Responsive TailwindCSS design
