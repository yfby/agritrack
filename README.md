# AgriTrack

A small, mobile-first expense tracker for farm harvests. Track what each season
costs, broken down by category, without spreadsheets.

Built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma + SQLite,
Server Actions, and Zod.

## Features

- **Password login** — a single app password (no username) protects every page
  and action. A signed, httpOnly cookie keeps the session for seven days.
- **Harvests** — create, edit, and delete harvests. The list shows the crop,
  status, total spend, and expense count, newest first.
- **Harvest detail** — category totals with percentages and horizontal bars,
  plus a filterable/sortable expense list (filter by category, sort by date or
  amount).
- **Quick add** — add an expense without leaving the harvest page; the list and
  totals refresh in place.
- **Categories** — add, rename, recolor, and delete. Deleting a category that is
  still used by an expense is blocked with an explanatory message.
- **Close / reopen** — a closed harvest is a finished record: its details and
  expenses cannot be edited and it cannot be deleted. Reopen it to make changes
  or delete it. Deleting an open harvest removes its expenses.
- **Validation** — every form is validated server-side with Zod (required
  fields, valid dates, amount greater than zero), with SQLite CHECK constraints
  backing the amount and harvest-date rules at the database level.
- **Money** — stored as integer centavos, never floating point, and formatted
  with `Intl.NumberFormat`.

## Getting started

Requires Node.js 20+ and pnpm.

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create your environment file from the template:

   ```bash
   cp .env.example .env
   ```

3. Set the login password. Open `.env` and replace `APP_PASSWORD="change-me"`
   with a password of your choice. This is the only credential — there is no
   username. See [Login password](#login-password) for details.

4. Create the SQLite database, apply migrations, and install the default
   categories:

   ```bash
   pnpm db:migrate
   ```

5. Start the development server:

   ```bash
   pnpm dev
   ```

6. Open <http://localhost:3000>. You will be sent to `/login`; enter the
   password you set in step 3. Use **Log out** in the header to end the session.

To run a production build instead of the dev server:

```bash
pnpm build
pnpm start
```

If migrations have already been applied and you only need the default
categories:

```bash
pnpm db:seed
```

The seed is idempotent and installs these categories: Seeds, Fertilizer,
Pesticide/Herbicide, Labor, Fuel, Equipment & Repairs, Irrigation, Transport,
and Other.

## Scripts

| Command          | What it does                                      |
| ---------------- | ------------------------------------------------- |
| `pnpm dev`       | Start the development server on port 3000.        |
| `pnpm build`     | Production build.                                 |
| `pnpm start`     | Serve the production build.                       |
| `pnpm lint`      | Run ESLint.                                       |
| `pnpm db:migrate`| Create/apply Prisma migrations in development.    |
| `pnpm db:seed`   | Insert the default categories (safe to re-run).   |
| `pnpm db:studio` | Open Prisma Studio to browse the database.        |

## Configuration

### Login password

AgriTrack has one shared password, not individual user accounts.

**Setting it:** copy `.env.example` to `.env` and replace the placeholder with
your chosen password, then restart the server:

```dotenv
APP_PASSWORD="a-long-random-password"
```

**How it is stored:** the password itself only lives in `APP_PASSWORD` in `.env`
on the server. That file is git-ignored and is never committed. Nothing is
written to the SQLite database: on login, the submitted value and the configured
password are each hashed with SHA-256 and compared with a timing-safe
comparison. The password is never included in a session cookie.

**How sessions work:** a successful login sets an `httpOnly`, `SameSite=Lax`
cookie containing an expiry timestamp and an HMAC signature keyed by
`APP_PASSWORD`. The cookie is valid for seven days (and is only sent over HTTPS
in production). Changing `APP_PASSWORD` invalidates every existing session, so
users must log in again. Use a long, unique value for any shared deployment.

### Currency

Money is stored as integer minor units (centavos × 100). The display currency
comes from `NEXT_PUBLIC_CURRENCY` (default `PHP`), so switching to another
ISO 4217 currency is a one-line change in `.env`:

```dotenv
NEXT_PUBLIC_CURRENCY="USD"
```

The prefix on amount inputs and all formatted totals follow the same value.

### Database

SQLite lives at `prisma/dev.db` and is git-ignored. `DATABASE_URL` in `.env`
controls the connection:

```dotenv
DATABASE_URL="file:./dev.db"
```

The path is resolved relative to `prisma/schema.prisma`.

## Data model

- **Harvest** — `name`, optional `crop`, `startDate`, optional `endDate`,
  `status` (`ACTIVE` / `CLOSED`), optional `notes`.
- **Category** — unique `name` and a hex `color`.
- **Expense** — belongs to a harvest and a category; `amountCents` (integer),
  `date`, optional `description`.

Harvest dates are date-only values stored at midnight UTC so they display
consistently regardless of the server timezone. Deleting an open harvest
cascades to its expenses; a closed harvest is read-only and cannot be deleted
until it is reopened, and deleting a category with expenses is restricted. The
database enforces `amountCents > 0` and `endDate >= startDate` with CHECK
constraints, and blocks edits/deletes of closed harvests with triggers, so these
rules also hold for writes that bypass the app.

## Moving to Postgres

The schema only uses portable types (`String`, `Int`, `DateTime`), so the
application code does not change. Prisma migration SQL is dialect-specific,
though, so generate fresh migrations for the new database:

1. Update `prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Point `DATABASE_URL` at Postgres:

   ```dotenv
   DATABASE_URL="postgresql://user:password@localhost:5432/agritrack?schema=public"
   ```

3. Replace the SQLite migrations with Postgres ones and seed:

   ```bash
   rm -rf prisma/migrations
   pnpm db:migrate
   pnpm db:seed
   ```

`pnpm db:migrate` creates and applies the initial migration for the new
provider. Commit the regenerated `prisma/migrations` directory.
