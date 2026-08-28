
# 🎵 Grunge Studio

A full-featured music platform API built with Node.js and Express that allows users to discover, upload, rate, and review songs. Grunge Studio provides comprehensive song management, user authentication, and admin controls.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Songs](#songs)
  - [Admin Management](#admin-management)
  - [Reviews & Ratings](#reviews--ratings)
- [Authentication & Authorization](#authentication--authorization)
- [Important Notes](#important-notes)

## ✨ Features

- **User Management**: User registration, email verification, login, and password management
- **Song Management**: Upload, view, filter, and search songs by genre and title
- **Ratings & Reviews**: Users can like, rate, and review songs
- **Admin System**: Role-based admin management with multiple status levels
- **Role-Based Access Control**: Support for user, admin, and superadmin roles
- **Email Notifications**: Automated email system for account verification and admin invitations
- **Cloud Storage**: Cloudinary integration for song file uploads
- **Security**: JWT authentication, password hashing with bcryptjs, helmet for security headers

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with db-migrate for migrations
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Validation**: Joi
- **Server Security**: Helmet, CORS, compression
- **Development**: Nodemon

## Documentation
- [Postman Documentation](https://farlodunolusege-1104561.postman.co/workspace/Farlodun-olusegun's-Workspace~e29527d5-53ca-4470-817e-b4308ff88c2f/collection/50548576-344748b3-ea10-4343-b02b-c3185d4171cd?action=share&creator=50548576)

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Cloudinary account
- Email service credentials (for Nodemailer)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Grunge Studio"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env` and fill in required values (see [Environment Variables](#environment-variables) section)

4. **Run database migrations**
   ```bash
   npm run migrate:create
   ```

##  Running the Application

### Development Mode
```bash
npm run dev
```
Runs the application with nodemon for auto-restart on file changes.

### Production Mode
```bash
npm start
```

### Seed Admin
```bash
npm run seedAdmin
```
Creates an initial superadmin user in the database.

### Run Tests
```bash
npm test
```

## 🗄️ Database Setup

The project includes database migrations for schema management:

- **20260214185038**: Initial Grunge Studio schema with users, artists, and genres
- **20260214201555**: Song uploads functionality
- **20260222035218**: Seeded song user
- **20260222043355**: Seed song data
- **20260227064636**: Likes, ratings, and reviews

All SQL migrations are stored in `migrations/sqls/` with corresponding up and down scripts.

## 🔌 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user account |
| POST | `/verify-account` | Verify email with verification code |
| POST | `/resend-verification-code` | Resend verification code to email |
| POST | `/login` | Login with credentials (returns JWT) |
| POST | `/forgot-password` | Request password reset link |
| PATCH | `/reset-password` | Reset password with reset token |

### Songs (`/api/v1/songs`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/all` | Get all songs |
| GET | `/view_song` | View a specific song (requires auth) |
| GET | `/filter_genre` | Filter songs by genre |
| GET | `/search` | Search songs by title or artist |
| POST | `/new_song` | Upload a new song (requires auth) |
| POST | `/:song_id/like` | Like/unlike a song (requires auth) |
| POST | `/:song_id/rate` | Rate a song (requires auth) |

**Note**: When uploading a new song, the contributor ID is automatically extracted from the JWT token. You don't need to manually provide it.

### Admin Management (`/api/v1/admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-admin` | Create new admin (superadmin only) |
| GET | `/list` | Get list of admins (superadmin only) |
| PATCH | `/update/:admin_id` | Update admin details (superadmin only) |

**Important**: 
- Only a **superadmin** can create new admins
- A welcome email with login credentials is sent to the new admin
- Admin status is updated in `current_roles` only after their first login
- The `current_roles` field is critical for determining admin permissions

### Status Control (`/api/v1/status`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | `/suspend/:admin_id` | Suspend an admin (superadmin only) |
| PATCH | `/reinstate/:admin_id` | Reinstate a suspended admin (superadmin only) |
| PATCH | `/reactivate/:admin_id` | Reactivate a deactivated admin (superadmin only) |
| PATCH | `/deactivate/:admin_id` | Deactivate an admin (superadmin only) |

### Reviews & Ratings (`/api/v1/reviews`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/song/:song_id` | Get all reviews for a song |
| POST | `/add` | Add a review to a song (requires auth) |
| PATCH | `/:review_id` | Edit a review (requires auth) |
| DELETE | `/:review_id` | Delete a review (requires auth) |

## 🔐 Authentication & Authorization

### JWT Token Usage

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The token contains the user ID, which is automatically extracted by middleware for operations like:
- Adding songs (contributor ID is automatically set)
- Creating reviews and ratings
- Managing user-specific data

### Role-Based Access Control

Three roles are supported:

| Role | Permissions |
|------|-------------|
| **User** | Upload songs, create reviews, like/rate songs |
| **Admin** | Manage songs, moderate reviews, manage other users |
| **SuperAdmin** | Create/manage admins, full system control |

### Admin Status Tracking

The `current_roles` column tracks the active role of an admin. This is separate from the `roles` column and is crucial:

- Only **active admins** have `current_roles = 'admin'`
- **Suspended, inactive, or deactivated** admins have `current_roles = 'user'`
- Admin must successfully log in after creation for `current_roles` to be updated to 'admin'

## 📝 Important Notes

### Song Upload
- Contributor ID is automatically set from the JWT token
- You do **not** need to manually provide the user ID when uploading songs
- Files are stored on Cloudinary

### Admin Management
- Email notifications are sent automatically when admins are created
- Admin permissions depend heavily on the `current_roles` value
- Only one superadmin should exist in production
- Admin status changes require careful coordination with the status control endpoints

### Filtering & Search
- Filter songs by **genre name** using query parameters
- Search songs by **song title** or **artist name**
- Both operations support pagination

### Error Handling
- 404 responses for resources not found
- 500 responses for server errors (team will be notified)
- Validation errors return detailed error messages

## 📂 Project Structure

```
src/
├── controllers/        # Request handlers for each feature
├── models/            # Database models and queries
├── routes/            # API route definitions
├── middlewares/       # Authentication and validation
├── services/          # Business logic (email, etc.)
├── config/            # Database, email, Cloudinary config
├── schema/            # Joi validation schemas
├── utils/             # Helper functions and utilities
└── app.js             # Express app setup

migrations/           # Database schema migrations
test/                 # Unit and integration tests
```

## 🤝 Contributing

When working with this API:
- Always use the role-based endpoints according to user permissions
- Follow the JWT authentication pattern for protected routes
- Ensure admin status is properly managed through the status control endpoints
- Respect email notification patterns for critical operations

## 📞 Support

For issues or questions, please contact the development team or create an issue in the repository.