# Dzidzo Edutech AR/VR

Dzidzo is a browser-based AR/VR education platform with a static frontend, a small Node/Express backend, and PostgreSQL for authentication and MVP content management.

## What Is In This Repo

- Static public frontend served from the repository root
- Admin frontend pages in `admin src/build/pages`
- Node/Express backend in `backend`
- PostgreSQL schema and migrations in `database/postgres`
- Setup and schema documentation in `docs`

## Stack

- Frontend: HTML, CSS, JavaScript, Bootstrap, jQuery
- Backend: Node.js, Express
- Database: PostgreSQL
- Auth: bcrypt + JWT

## Project Structure

```text
.
|- admin src/build/pages
|- backend
|- database/postgres/migrations
|- docs
|- index.html
|- course.html
|- contact.html
|- team.html
|- testimonial.html
```

## Prerequisites

- Node.js 18+
- PostgreSQL installed locally
- A PostgreSQL database named `dzidzo`

## Backend Environment

Create:

- `backend/.env`

Example:

```env
PORT=4000
FRONTEND_ORIGIN=http://127.0.0.1:5500
DATABASE_URL=postgresql://your_db_user:your_db_password@localhost:5432/your_db_name
JWT_SECRET=generate_your_own_long_random_secret
```

Recommended setup:

1. Copy `backend/.env.example` to `backend/.env`
2. Create your own local PostgreSQL database and user
3. Replace `your_db_user`, `your_db_password`, and `your_db_name`
4. Generate your own JWT secret instead of using the placeholder

## First-Time Setup

### 1. Install frontend dev-server metadata

From the repository root:

```powershell
npm install
```

Note:
This root package only exists so the static frontend can run with `npm run dev`.

### 2. Install backend dependencies

```powershell
cd backend
npm install
```

### 3. Run database migrations

```powershell
npm run migrate
```

This applies the MVP schema and seed data.

## Running The App

You need two terminals.

### Terminal 1: Frontend

From the repository root:

```powershell
npm run dev
```

Frontend URLs:

- Home: `http://127.0.0.1:5500/`
- Sign up: `http://127.0.0.1:5500/admin%20src/build/pages/sign-up.html`
- Sign in: `http://127.0.0.1:5500/admin%20src/build/pages/sign-in.html`
- Admin management: `http://127.0.0.1:5500/admin%20src/build/pages/admin-management.html`

### Terminal 2: Backend

```powershell
cd backend
npm run dev
```

Backend URL:

- API: `http://localhost:4000`

## Admin Flow

1. Open the sign-up page
2. Create an account with role `admin`
3. Sign in
4. Open the admin dashboard
5. Use the tabbed admin management page to create, edit, and delete MVP content

## Available Database Tables

Main MVP tables:

- `users`
- `categories`
- `courses`
- `lessons`
- `enrollments`
- `library_items`
- `team_members`
- `testimonials`
- `contact_messages`
- `newsletter_subscribers`

Support table:

- `schema_migrations`

For the detailed table plan, see:

- [MVP database plan](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/docs/mvp-database-plan.md)
- [Migration process](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/docs/postgres-migration-process.md)
- [Postgres setup guide](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/docs/postgres-setup.md)

## Useful Commands

From repo root:

```powershell
npm run dev
```

From `backend`:

```powershell
npm install
npm run migrate
npm run dev
npm start
```

## Notes

- The public site is still mostly static HTML, but key sections are now wired to PostgreSQL-backed APIs.
- Contact submissions and newsletter subscriptions are stored in the database.
- Team, testimonials, course listings, and course detail metadata are hydrated from the backend.
- The admin area supports CRUD for the main MVP entities.

## Git Branch

Current work is intended to continue on branch:

- `dev`
