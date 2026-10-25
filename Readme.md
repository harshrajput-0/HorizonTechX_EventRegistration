# HorizonTechX Event Registration API

Backend internship project for **HorizonTechX** — a REST API for creating events, managing organizers/attendees, and handling event registrations.

## Tech Stack

- Node.js + Express 5
- MongoDB + Mongoose 9
- JWT authentication
- Cloudinary (event cover image uploads via Multer)

## Features

- User auth (register/login) with role-based access (`attendee`, `organizer`, `admin`)
- Organizers can create, update, and delete events with a cover image
- Public event listing and event details
- Attendees can register/cancel registration for events
- Capacity tracking (prevents over-registration)

## Setup

```bash
npm install
cp .example.env .env   # fill in MongoDB URI, JWT secret, Cloudinary keys
npm run dev
```

Server runs on `http://localhost:5000` by default.

## API Overview

| Method | Route                          | Access             |
|--------|---------------------------------|---------------------|
| POST   | /api/auth/register              | Public              |
| POST   | /api/auth/login                 | Public              |
| GET    | /api/events                     | Public              |
| GET    | /api/events/:id                 | Public              |
| GET    | /api/events/mine                | Organizer           |
| POST   | /api/events                     | Organizer           |
| PUT    | /api/events/:id                 | Organizer           |
| DELETE | /api/events/:id                 | Organizer           |
| GET    | /api/users/:id                  | Public              |
| POST   | /api/registrations              | Attendee (logged in)|
| GET    | /api/registrations/user/:userId | Public              |
| DELETE | /api/registrations/:id          | Attendee (logged in)|

A ready-to-import Postman collection is included for testing all routes.

## Project Structure

```
src/
├── configs/      # DB + Cloudinary setup
├── controllers/   # Route handlers
├── middlewares/   # Auth & role guards
├── models/        # Mongoose schemas
├── routes/        # API routes
├── utils/         # ApiError, ApiResponse, asyncHandler
└── app.js, server.js
```

---
Built as part of a backend development internship at HorizonTechX.