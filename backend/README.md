# IIC Quest - Backend API

A Node.js/Express backend application for the IIC Quest platform with authentication, user management, and PostgreSQL database integration.

##  Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Setup](#database-setup)
- [Contributing](#contributing)

##  Project Overview

IIC Quest Backend is a RESTful API built with Express.js that provides:
- User authentication with JWT tokens
- User management functionality
- PostgreSQL database integration using Sequelize ORM
- JWT-based middleware for protected routes
- CORS support for cross-origin requests
- Environment-based configuration

##  Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | - | JavaScript runtime |
| **Express.js** | ^5.2.1 | Web framework |
| **PostgreSQL** | - | Database |
| **Sequelize** | ^6.37.8 | ORM |
| **JWT** | ^9.0.3 | Authentication tokens |
| **bcryptjs** | ^3.0.3 | Password hashing |
| **dotenv** | ^17.4.2 | Environment variables |
| **CORS** | ^2.8.6 | Cross-origin requests |
| **nodemon** | ^3.1.14 | Development auto-reload |

##  Project Structure

```
backend/
├── App.js                    # Express app configuration
├── server.js                 # Server entry point
├── package.json              # Dependencies
├── .env                      # Environment variables (git ignored)
├── .gitignore                # Git ignore rules
│
├── Config/
│   └── dbconfig.js          # Database configuration
│
├── Controllers/
│   ├── authController.js    # Authentication logic
│   └── userController.js    # User management logic
│
├── middleware/
│   └── authMiddleware.js    # JWT verification middleware
│
├── model/
│   ├── index.js             # Database connection & models
│   └── userModel.js         # User model definition
│
├── routers/
│   ├── authRoutes.js        # Authentication endpoints
│   └── UserRoutes.js        # User management endpoints
│
└── migrations/
    └── SQLmigrations        # Database migration scripts
```

##  Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v10 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** (optional, for version control)

##  Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zack1o1/balmikicodebrigade_iicquest4.0.git
   cd balmikicodebrigade_iicquest4.0/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

   Or install specific packages:
   ```bash
   npm install express pg sequelize dotenv cors bcryptjs jsonwebtoken pg-hstore
   npm install --save-dev nodemon
   ```

##  Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=iic_quest_db
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

**Note:** Never commit the `.env` file to version control. It's included in `.gitignore`.

##  Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
# or
npx nodemon server.js
```

### Production Mode
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 5000).

**Expected Output:**
```
PostgreSQL connected
Server running on port 5000
```

### API Documentation

### Authentication Endpoints

#### Register User
- **Endpoint:** `POST /auth/register`
- **Description:** Create a new user account
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```
- **Response:** User object with JWT token

#### Login
- **Endpoint:** `POST /auth/login`
- **Description:** Authenticate user and receive JWT token
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { ... }
  }
  ```

### User Endpoints

#### Get User Profile
- **Endpoint:** `GET /users/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** User profile object

#### Update User Profile
- **Endpoint:** `PUT /users/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** User data to update
- **Response:** Updated user object

#### Delete User Account
- **Endpoint:** `DELETE /users/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Success message

##  Database Setup

### Create Database

1. **Open PostgreSQL command line (psql)**
   ```bash
   psql -U postgres
   ```

2. **Create database**
   ```sql
   CREATE DATABASE iic_quest_db;
   ```

3. **Connect to the database**
   ```sql
   \c iic_quest_db
   ```

### Run Migrations

Migration scripts are located in `migrations/SQLmigrations`. Execute them:

```bash
psql -U postgres -d iic_quest_db -f migrations/SQLmigrations/001_initial_schema.sql
```

### Database Schema

The User model includes:
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed with bcryptjs)
- `name`
- `createdAt`
- `updatedAt`

##  Authentication Flow

1. User registers with email and password
2. Password is hashed using **bcryptjs**
3. On login, credentials are verified
4. JWT token is generated and returned
5. Token is used in `Authorization: Bearer <token>` header for protected routes
6. Middleware verifies token on each protected request

##  Middleware

### authMiddleware.js
- Extracts JWT token from Authorization header
- Verifies token signature
- Attaches decoded user data to request object
- Returns 401 error if token is invalid or missing

Usage:
```javascript
router.get('/protected-route', authMiddleware, controller);
```

##  Troubleshooting

| Issue | Solution |
|-------|----------|
| `Port already in use` | Change PORT in .env or kill process using the port |
| `PostgreSQL connection failed` | Check DB credentials in .env and ensure PostgreSQL is running |
| `jwt malformed` | Ensure JWT_SECRET in .env matches the one used to generate tokens |
| `Module not found` | Run `npm install` to ensure all dependencies are installed |

##  Contributing

1. Create a new branch for your feature
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make your changes and commit
   ```bash
   git commit -m "Add your feature"
   ```

3. Push to the repository
   ```bash
   git push origin feature/your-feature
   ```

4. Create a Pull Request
##  License

ISC License - See LICENSE file for details

## 🔗 Repository

- **GitHub:** https://github.com/Zack1o1/balmikicodebrigade_iicquest4.0
- **Issues:** https://github.com/Zack1o1/balmikicodebrigade_iicquest4.0/issues

##  Support

For issues and questions, please open an issue on GitHub.

---

**Last Updated:** December 2024
**Version:** 1.0.0


