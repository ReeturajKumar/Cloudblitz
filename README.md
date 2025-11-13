# CloudBlitz - Enquiry Management System

<div align="center">

![CloudBlitz](https://img.shields.io/badge/CloudBlitz-CRM%20System-4A90E2?style=for-the-badge&logo=react&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**AI-First Fullstack CRM for Enquiry Tracking & Team Management**

[Live Demo](https://cloudblitz-gray.vercel.app) • [API Documentation](#api-documentation) • [Report Bug](https://github.com/ReeturajKumar/Cloudblitz/issues) • [Request Feature](https://github.com/ReeturajKumar/Cloudblitz/issues)

---

### Quick Links

[![Frontend](https://img.shields.io/badge/Frontend-Live%20on%20Vercel-black?style=flat-square&logo=vercel)](https://cloudblitz-gray.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Live%20on%20Render-46E3B7?style=flat-square&logo=render)](https://cloudblitz.onrender.com)
[![Health](https://img.shields.io/badge/API-Health%20Check-success?style=flat-square)](https://cloudblitz.onrender.com/api/health)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [User Roles](#user-roles-and-permissions)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

CloudBlitz is a modern, full-stack **Enquiry Management System** built with React, TypeScript, Node.js, and MongoDB. Designed for efficient customer enquiry tracking and team collaboration with role-based access control, real-time analytics, and comprehensive team management.

### Key Highlights

- JWT-based Authentication with role-based access control
- Real-time Analytics Dashboard with interactive charts
- Team Management with user and enquiry assignment
- Modern UI/UX using React 18, TypeScript & Tailwind CSS
- Fully Tested with Jest & Supertest (58%+ coverage)
- Docker Ready for containerized deployment
- Production Ready - Deployed on Vercel & Render

---

## Features

### Authentication & Authorization

- Secure JWT-based authentication
- Role-based access control (Admin & Staff)
- Protected routes and API endpoints
- Session persistence with auto token refresh

### Enquiry Management

- Complete CRUD operations for enquiries
- Status tracking: New, In Progress, Closed
- Staff assignment and reassignment
- Advanced filtering and search capabilities
- Detailed enquiry information management

### User Management

- Create and manage user accounts (Admin only)
- Role assignment (Admin/Staff)
- User activity tracking
- Team performance monitoring

### Analytics & Dashboard

- Weekly trend charts (Created vs Closed)
- Status distribution visualization
- Top performer leaderboard
- Real-time activity feed
- Responsive dashboard design

---

## Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css&logoColor=white)

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible components
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)

- **Node.js 20** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### DevOps & Testing

![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-29.x-C21325?logo=jest&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?logo=render&logoColor=white)

- **Jest** - Unit testing
- **Supertest** - API testing
- **Docker & Docker Compose** - Containerization
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

---

## Project Structure

```
Cloudblitz/
│
├── frontend/                          # React + Vite Frontend
│   ├── public/                        # Static assets
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   │   ├── auth/                  # Login, Register components
│   │   │   ├── dashboard/             # Dashboard widgets
│   │   │   ├── enquiries/             # Enquiry management UI
│   │   │   ├── layout/                # Header, Sidebar, Layout
│   │   │   └── users/                 # User management UI
│   │   ├── contexts/                  # React Context (Auth, Theme)
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── lib/                       # Utility functions
│   │   ├── pages/                     # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Enquiries.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Users.tsx
│   │   ├── services/                  # API service layer
│   │   │   ├── api.ts                 # Axios configuration
│   │   │   ├── authService.ts
│   │   │   ├── enquiryService.ts
│   │   │   └── userService.ts
│   │   ├── types/                     # TypeScript definitions
│   │   ├── App.tsx                    # Root component
│   │   ├── main.tsx                   # Entry point
│   │   └── index.css                  # Global styles
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                           # Node.js + Express Backend
│   ├── src/
│   │   ├── config/                    # Configuration
│   │   │   └── database.ts            # MongoDB connection
│   │   ├── controllers/               # Request handlers
│   │   │   ├── authController.ts
│   │   │   ├── enquiryController.ts
│   │   │   ├── userController.ts
│   │   │   └── analyticsController.ts
│   │   ├── middleware/                # Express middleware
│   │   │   ├── auth.ts                # JWT verification
│   │   │   ├── roles.ts               # Role-based access
│   │   │   └── errorHandler.ts        # Error handling
│   │   ├── models/                    # Mongoose models
│   │   │   ├── User.ts
│   │   │   └── Enquiry.ts
│   │   ├── routes/                    # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── enquiryRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   └── analyticsRoutes.ts
│   │   ├── types/                     # TypeScript interfaces
│   │   ├── utils/                     # Helper functions
│   │   ├── app.ts                     # Express app setup
│   │   └── server.ts                  # Server entry point
│   ├── tests/                         # Test suites
│   │   ├── unit/                      # Unit tests
│   │   ├── integration/               # Integration tests
│   │   │   ├── auth.test.ts
│   │   │   ├── enquiries.test.ts
│   │   │   └── users.test.ts
│   │   └── setup.ts
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
├── docker-compose.yml                 # Multi-container setup
├── .gitignore
├── LICENSE
└── README.md
```

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │ Web Browser  │────────▶│  React App   │                  │
│  └──────────────┘         │   (Vercel)   │                  │
│                           └──────┬───────┘                   │
└──────────────────────────────────┼───────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│                                                               │
│  ┌────────────────┐    ┌──────────────┐   ┌──────────────┐ │
│  │ React Router   │───▶│ Auth Context │──▶│ API Services │ │
│  └────────────────┘    └──────────────┘   └──────┬───────┘ │
│                                                    │          │
│                                            ┌───────▼───────┐ │
│                                            │ Axios Client  │ │
│                                            └───────┬───────┘ │
└────────────────────────────────────────────────────┼─────────┘
                                                     │
                                                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER (Render)                    │
│                                                               │
│  ┌───────────────┐    ┌────────────────┐   ┌─────────────┐ │
│  │ Express Server│───▶│ JWT Middleware │──▶│ Controllers │ │
│  └───────────────┘    └────────────────┘   └──────┬──────┘ │
│                                                     │         │
│                                            ┌────────▼──────┐ │
│                                            │ Mongoose ODM  │ │
│                                            └────────┬──────┘ │
└─────────────────────────────────────────────────────┼─────────┘
                                                      │
                                                      ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
│                                                               │
│                  ┌──────────────────────┐                    │
│                  │   MongoDB Atlas      │                    │
│                  │  (Cloud Database)    │                    │
│                  └──────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

**Data Flow:**

1. User interacts with React frontend hosted on Vercel
2. API requests sent via Axios with JWT token
3. Express server validates JWT and role permissions
4. Controllers process business logic
5. Mongoose interacts with MongoDB Atlas
6. Response sent back through the chain

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **MongoDB** ([Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas))
- **Git**
- **Docker** (optional)

### Installation

#### 1. Clone Repository

```bash
git clone https://github.com/ReeturajKumar/Cloudblitz.git
cd Cloudblitz
```

#### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

**Configure `.env`:**

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/cloudblitz
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

**Start Backend:**

```bash
npm run dev
```

**Verify:** Visit http://localhost:5000/api/health

#### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

**Configure `.env`:**

```env
VITE_API_URL=http://localhost:5000/api
```

**Start Frontend:**

```bash
npm run dev
```

**Access:** http://localhost:5173

#### 4. Docker Setup (Optional)

```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## User Roles and Permissions

| Feature                 | Admin | Staff    |
| ----------------------- | ----- | -------- |
| View All Enquiries      | Yes   | No       |
| View Assigned Enquiries | Yes   | Yes      |
| Create Enquiry          | Yes   | No       |
| Edit Enquiry            | All   | Own Only |
| Assign Enquiry          | Yes   | No       |
| Delete Enquiry          | Yes   | No       |
| Manage Users            | Yes   | No       |
| View Full Analytics     | Yes   | Limited  |
| Change Any Status       | Yes   | Own Only |

---

## API Documentation

### Base URLs

- **Production:** `https://cloudblitz.onrender.com/api`
- **Development:** `http://localhost:5000/api`

### Authentication

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePass123",
  "role": "staff"
}
```

**Response (201):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "staff"
  }
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePass123"
}
```

#### Get Current User

```http
GET /auth/me
Authorization: Bearer <your_jwt_token>
```

### Enquiries

#### Get All Enquiries

```http
GET /enquiries
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "customerName": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+1234567890",
      "description": "Product inquiry",
      "status": "new",
      "assignedTo": null,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Create Enquiry (Admin Only)

```http
POST /enquiries
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerName": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "description": "Interested in premium plan"
}
```

#### Update Enquiry

```http
PUT /enquiries/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress",
  "assignedTo": "user_id_here"
}
```

#### Delete Enquiry (Admin Only)

```http
DELETE /enquiries/:id
Authorization: Bearer <token>
```

### Users (Admin Only)

#### Get All Users

```http
GET /users
Authorization: Bearer <token>
```

#### Create User

```http
POST /users
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Staff",
  "email": "staff@example.com",
  "password": "staffPass123",
  "role": "staff"
}
```

#### Update User

```http
PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "admin"
}
```

#### Delete User

```http
DELETE /users/:id
Authorization: Bearer <token>
```

### Analytics

#### Top Performers

```http
GET /analytics/top-performers
Authorization: Bearer <token>
```

#### Dashboard Statistics

```http
GET /analytics/stats
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "totalEnquiries": 150,
  "newEnquiries": 45,
  "inProgress": 60,
  "closed": 45,
  "weeklyTrend": [...],
  "topPerformers": [...]
}
```

---

## Testing

### Run Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Coverage

| Component   | Statements | Branches | Functions | Lines   |
| ----------- | ---------- | -------- | --------- | ------- |
| **Overall** | 58.64%     | 26.96%   | 45.45%    | 57.91%  |
| app.ts      | 95.00%     | 50.00%   | 100.00%   | 94.73%  |
| Controllers | 40.99%     | 22.66%   | 28.57%    | 38.12%  |
| Middleware  | 69.56%     | 50.00%   | 66.66%    | 69.56%  |
| Models      | 100.00%    | 100.00%  | 100.00%   | 100.00% |
| Routes      | 83.72%     | 100.00%  | 0.00%     | 83.72%  |

### Test Suites

- Health Check API
- Authentication (Register, Login, JWT)
- Enquiry CRUD Operations
- User Management
- Role-Based Access Control

---

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Root Directory:** `frontend`
4. Add environment variable:
   ```
   VITE_API_URL=https://cloudblitz.onrender.com/api
   ```
5. Deploy

### Backend (Render)

1. Connect GitHub repository
2. Configure Web Service:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Root Directory:** `backend`
3. Add environment variables:
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/cloudblitz
   JWT_SECRET=your_production_secret_key
   NODE_ENV=production
   PORT=5000
   ```
4. Deploy

---

## Live Deployment

| Service          | URL                                        | Status |
| ---------------- | ------------------------------------------ | ------ |
| **Frontend**     | https://cloudblitz-gray.vercel.app         | Active |
| **Backend API**  | https://cloudblitz.onrender.com            | Active |
| **Health Check** | https://cloudblitz.onrender.com/api/health | Active |

---

## Roadmap

### Completed

- JWT Authentication & Authorization
- Role-based Access Control
- Enquiry CRUD Operations
- User Management System
- Analytics Dashboard
- Responsive UI Design
- Testing Suite (58%+ coverage)
- Docker Configuration
- Production Deployment

### Planned

- Email Notifications
- Advanced Search & Filters
- Export Reports (PDF/Excel)
- WebSocket Real-time Updates
- Audit Logging
- Multi-language Support
- Dark Mode
- Mobile App (React Native)

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Developer

**Reeturaj Kumar**  
AI-First Fullstack Developer

- Email: reeturajvats587@gmail.com
- LinkedIn: [linkedin.com/in/reeturajkumar](https://linkedin.com/in/reeturajkumar)
- GitHub: [@ReeturajKumar](https://github.com/ReeturajKumar)

---

## Acknowledgments

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database
- [Vercel](https://vercel.com/) - Frontend hosting
- [Render](https://render.com/) - Backend hosting
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

## Support

- Documentation: [GitHub Repository](https://github.com/ReeturajKumar/Cloudblitz)
- Report Issues: [GitHub Issues](https://github.com/ReeturajKumar/Cloudblitz/issues)
- Email: [reeturajvats587@gmail.com](mailto:reeturajvats587@gmail.com)

---

<div align="center">

**If you find this project helpful, please give it a star on GitHub**

Made with care by [Reeturaj Kumar](https://github.com/ReeturajKumar)

![GitHub Stars](https://img.shields.io/github/stars/ReeturajKumar/Cloudblitz?style=social)
![GitHub Forks](https://img.shields.io/github/forks/ReeturajKumar/Cloudblitz?style=social)
![GitHub Watchers](https://img.shields.io/github/watchers/ReeturajKumar/Cloudblitz?style=social)

</div>
