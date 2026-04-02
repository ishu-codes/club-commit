![Img](./assets/Thumbnail.png)

# ClubCommit

ClubCommit is a golf charity subscription platform built from the Digital Heroes sample PRD. The product combines golf score tracking, subscription access, monthly prize draws, and charity contributions in a modern web experience that avoids traditional golf-site styling.

## Product Summary

Users can:

- subscribe on a monthly or yearly plan
- enter Stableford golf scores
- participate in monthly draw-based prize pools
- support a selected charity with part of their subscription

The platform supports three user roles:

- public visitors
- registered subscribers
- administrators

## PRD Scope

Core product goals from `PRD.pdf`:

- subscription engine with monthly and yearly plans
- score management with rolling latest 5 scores
- draw and reward system with random or algorithmic logic
- charity contribution and charity directory features
- winner verification and payout tracking
- user dashboard and admin dashboard
- mobile-first, modern UI/UX

## Monorepo Structure

```text
.
├── apps/
│   ├── api/    # Express + Prisma + PostgreSQL
│   └── web/    # Next.js frontend
├── docker-compose.yml
├── PRD.pdf
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Tech Stack

- Next.js 16
- React 19
- Express 5
- Prisma
- PostgreSQL
- pnpm workspaces
- Turborepo
- Docker Compose

## Key Product Requirements

### Subscription System

- monthly and yearly plans
- restricted platform access for non-subscribers
- renewal, cancellation, and lapsed-state handling
- real-time subscription validation on authenticated requests

### Score Management

- users submit their last 5 scores
- Stableford score range: `1` to `45`
- every score includes a date
- only latest 5 scores are retained
- newest score replaces the oldest automatically
- score history shown most-recent-first

### Draw and Reward System

- monthly draw cadence
- admin-controlled draw publishing
- simulation / pre-analysis mode
- random and algorithmic draw logic
- prize tiers:
  - 5-number match: 40%, rollover enabled
  - 4-number match: 35%, no rollover
  - 3-number match: 25%, no rollover
- equal split across winners in the same tier

### Charity System

- charity selected at signup
- minimum contribution is 10% of subscription fee
- user can increase contribution percentage
- separate donation path supported by product requirements
- charity listing, search, filter, spotlight, and profile content

### Winner Verification

- winners upload score proof
- admins approve or reject submissions
- payout states move from pending to paid

### Dashboards

User dashboard requirements:

- subscription status
- score entry and editing
- selected charity and contribution percentage
- participation summary
- winnings overview and payment status

Admin dashboard requirements:

- user management
- subscription management
- score editing
- charity management
- draw management and simulation
- winner verification
- reports and analytics

## Current Apps

### `apps/web`

Next.js frontend for:

- landing page
- sign in / sign up
- user dashboard pages
- admin pages
- legal pages

### `apps/api`

Express API with Prisma-backed PostgreSQL models for:

- auth
- subscriptions
- scores
- charities
- draws
- winners
- dashboard data
- admin operations

## Local Development

### Requirements

- Node.js 22+
- pnpm 10+

Install dependencies:

```bash
pnpm install
```

Create the API env file:

```bash
cp apps/api/.env.example apps/api/.env
```

Run the apps:

```bash
pnpm --dir apps/api dev
pnpm --dir apps/web dev
```

Default local URLs:

- web: `http://localhost:3000`
- api: `http://localhost:8080`
- api health: `http://localhost:8080/health`

## Docker

Run the full local stack:

```bash
docker compose up --build
```

This starts:

- `clubcommit-web`
- `clubcommit-api`
- `clubcommit-db`

Build individual services:

```bash
docker compose build web
docker compose build api
```

## Database

Prisma schema:

- `apps/api/prisma/schema.prisma`

Migrations:

- `apps/api/prisma/migrations`

Useful commands:

```bash
pnpm --dir apps/api prisma generate
pnpm --dir apps/api prisma migrate deploy
pnpm --dir apps/api seed
```

## Scripts

Root:

```bash
pnpm dev
pnpm build
```

API:

```bash
pnpm --dir apps/api dev
pnpm --dir apps/api build
pnpm --dir apps/api start
pnpm --dir apps/api test
pnpm --dir apps/api seed
```

Web:

```bash
pnpm --dir apps/web dev
pnpm --dir apps/web build
pnpm --dir apps/web start
pnpm --dir apps/web lint
```

## Environment Variables

API:

- `DATABASE_URL`
- `DIRECT_URL`
- `CORS_ORIGINS`
- `PORT`
- `BETTER_AUTH_URL`
- `JWT_ACCESS_SECRET`

Web:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_API_VERSION`

## Delivery Notes

The PRD requires:

- a deployed public website
- working user and admin panels
- a properly configured backend database
- clean source code
- environment-based deployment setup

The PRD also calls out future-minded architecture requirements:

- multi-country expansion support
- team / corporate account extensibility
- campaign module readiness
- mobile-app-friendly codebase structure

## Reference

Primary requirement source:

- `PRD.pdf`

This README is based on the Digital Heroes sample product requirements document included in the repository.
