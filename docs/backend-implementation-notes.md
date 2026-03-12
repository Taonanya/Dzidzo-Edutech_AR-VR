# Backend Implementation Notes

## What I Added

I added a small Node/Express backend that uses PostgreSQL for authentication.

Files added:

- [backend/package.json](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/backend/package.json)
- [backend/.env.example](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/backend/.env.example)
- [backend/src/config/env.js](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/backend/src/config/env.js)
- [backend/src/config/db.js](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/backend/src/config/db.js)
- [backend/src/lib/validators.js](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/backend/src/lib/validators.js)
- [backend/src/routes/auth.js](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/backend/src/routes/auth.js)
- [backend/src/server.js](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/backend/src/server.js)

## API Endpoints

### `GET /api/health`

Checks that the backend is running and PostgreSQL is reachable.

### `POST /api/auth/signup`

Creates a user in PostgreSQL with:

- `full_name`
- `email`
- `password`
- `role`

The backend hashes the password with `bcryptjs` before saving it.

### `POST /api/auth/signin`

Looks up a user by email and verifies the password hash.

It returns:

- a JWT token
- a minimal user object for the frontend to store locally

### `GET /api/me`

This is a protected route.

It requires:

- `Authorization: Bearer <token>`

It returns the authenticated user profile used by the dashboard pages.

## Frontend Wiring

I also added a browser auth script here:

- [admin src/build/assets/js/auth.js](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/admin%20src/build/assets/js/auth.js)

That script sends requests to:

- `http://localhost:4000/api/auth/signup`
- `http://localhost:4000/api/auth/signin`

I also added a protected page helper here:

- [admin src/build/assets/js/protected-page.js](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/admin%20src/build/assets/js/protected-page.js)

And real role landing pages here:

- [admin src/build/pages/admin-dashboard.html](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/admin%20src/build/pages/admin-dashboard.html)
- [admin src/build/pages/teacher-dashboard.html](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/admin%20src/build/pages/teacher-dashboard.html)
- [admin src/build/pages/student-dashboard.html](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/admin%20src/build/pages/student-dashboard.html)

## What Else I Would Have Done With More Time

If we were taking this beyond a minimal starter backend, I would also add:

1. proper session or JWT-based authentication
2. route protection middleware
3. request logging
4. rate limiting on auth endpoints
5. structured validation with a schema library
6. migration tooling instead of raw SQL files only
7. automated tests for auth and DB behavior
8. frontend dashboard routes that actually exist for each role

## Why I Chose This Shape

The repository did not already contain a working backend runtime. A small Express app is the fastest coherent way to:

- hold the PostgreSQL connection on the server side
- hash passwords correctly
- expose simple auth endpoints
- avoid mixing browser code with database credentials

## Remaining Constraints

- dependencies are declared but not installed yet
- the backend will not run until `npm install` is executed in `backend/`
- the PostgreSQL schema must be applied first
- the current site still has placeholder redirects to dashboard pages that may not exist as real application routes
