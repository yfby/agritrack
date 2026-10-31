# AgriTrack

A small, mobile-first expense tracker for farm harvests. Track what each season
costs, broken down by category, without spreadsheets.

Built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma + SQLite,
Server Actions, and Zod.

## Features

- **Harvests** — create, edit, and delete harvests. The list shows the crop,
  status, total spend, and expense count, newest first.
- **Harvest detail** — category totals with percentages and horizontal bars,
  plus a filterable/sortable expense list (filter by category, sort by date or
  amount).
- **Quick add** — add an expense without leaving the harvest page; the list and
  totals refresh in place.
- **Categories** — add, rename, recolor, and delete. Deleting a category that is
  still used by an expense is blocked with an explanatory message.
- **Close / reopen** — a closed harvest is read-only for expenses; reopen it to
  make changes. Deleting a harvest removes its expenses.
- **Validation** — every form is validated server-side with Zod (required
  fields, valid dates, amount greater than zero).
- **Money** — stored as integer centavos, never floating point, and formatted
  with `Intl.NumberFormat`.

## Getting started

Requires Node.js 20+ and pnpm.

```bash
pnpm install
cp .env.example .env
pnpm db:migrate   # creates prisma/dev.db and runs the seed
pnpm dev
```

Open <http://localhost:3000>.

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
consistently regardless of the server timezone. Deleting a harvest cascades to
its expenses; deleting a category with expenses is restricted.

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
