# PostgreSQL Migration Process

## Goal

This repository now includes a file-based PostgreSQL migration system for the MVP schema.

The migration files are stored in:

- [database/postgres/migrations/001_core_schema.sql](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/database/postgres/migrations/001_core_schema.sql)
- [database/postgres/migrations/002_indexes.sql](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/database/postgres/migrations/002_indexes.sql)
- [database/postgres/migrations/003_seed_mvp.sql](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/database/postgres/migrations/003_seed_mvp.sql)

The migration runner is:

- [backend/scripts/run-migrations.js](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/backend/scripts/run-migrations.js)

## How The Process Works

1. The backend reads `DATABASE_URL` from `backend/.env`.
2. It ensures a `schema_migrations` table exists.
3. It reads all `.sql` files in `database/postgres/migrations`.
4. It applies them in filename order.
5. It records each successful migration in `schema_migrations`.
6. On later runs, already-applied migrations are skipped.

## How To Run Migrations

From the repository root:

```powershell
cd backend
npm run migrate
```

## What Each Migration Does

### `001_core_schema.sql`

Creates:

- enum types
- all MVP content tables
- update timestamp trigger function
- update triggers on mutable tables

### `002_indexes.sql`

Creates indexes for:

- role lookups
- publication filtering
- ordering
- enrollments
- admin message review

### `003_seed_mvp.sql`

Seeds:

- categories
- sample courses
- starter lessons
- library items
- team members
- testimonials

## Applying Migrations To A New Database

1. Create the PostgreSQL database.
2. Set `DATABASE_URL` in [backend/.env](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/backend/.env).
3. Run:

```powershell
cd backend
npm install
npm run migrate
```

4. Start the backend:

```powershell
npm run dev
```

## Re-running Migrations

You can safely run:

```powershell
npm run migrate
```

again. Previously applied migrations are skipped.

## Adding A New Migration

1. Create a new SQL file in `database/postgres/migrations`.
2. Prefix it with the next number, for example:
   `004_add_announcements.sql`
3. Put only the new change in that file.
4. Run `npm run migrate`.

## Notes

- This is an MVP migration process, not a full migration framework.
- It is enough for the current codebase and local development workflow.
- If the project grows, you may later replace this with a dedicated migration tool.
