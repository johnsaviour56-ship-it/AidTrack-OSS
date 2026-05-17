# AidTrack OSS

**Open-source humanitarian distribution and beneficiary tracking platform.**

AidTrack OSS helps NGOs, community organizations, and relief programs manage beneficiary registration, aid distribution, attendance verification, and reporting — through a simple, contributor-friendly system.

---

## Who is this for?

- NGOs and humanitarian organizations
- Community-based organizations (CBOs)
- Food security and livelihood programs
- Relief distribution programs
- Volunteer coordination teams

---

## Features

| Feature | Description |
|---|---|
| **Authentication** | Email/password login with Admin, Field Officer, and Volunteer roles |
| **Beneficiary Management** | Register, edit, archive, and view beneficiary profiles |
| **Distribution Tracking** | Create distribution events, assign beneficiaries, track status |
| **Attendance / Verification** | Mark beneficiaries as received with timestamps |
| **Reporting** | Summary stats and downloadable CSV export |

---

## Screenshots

> _Screenshots coming soon. Contributions welcome!_

---

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (Auth + PostgreSQL)
- [shadcn/ui](https://ui.shadcn.com/)

---

## Local Setup

### Prerequisites

- Node.js 18+
- A free [Supabase](https://supabase.com) account

### 1. Clone the repository

```bash
git clone https://github.com/johnsaviour56-ship-it/AidTrack-OSS.git
cd AidTrack-OSS
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your Supabase project URL and anon key.  
Find these at: **Supabase Dashboard → Project Settings → API**

### 4. Set up the database

In your Supabase project, open the **SQL Editor** and run the contents of:

```
supabase/schema.sql
```

This creates all tables, RLS policies, and the user profile trigger.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign up for an account.

---

## Project Structure

```
/app              # Next.js App Router pages
  /(app)          # Authenticated app shell (dashboard, beneficiaries, etc.)
  /login          # Login page
  /signup         # Signup page
  /api            # API routes (CSV export)
/components       # Reusable UI components
/lib              # Utilities and server actions
/hooks            # Custom React hooks
/types            # TypeScript type definitions
/supabase         # Supabase client setup
/docs             # Additional documentation
```

---

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for the full roadmap.

**MVP (current):** Auth, beneficiary CRUD, distribution tracking, attendance, basic reporting.

**Coming next:** Search and filtering, pagination, mobile-optimized attendance view, user management.

---

## Contributing

We welcome contributions of all sizes — from fixing typos to building new features.

See [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

**Good first issues** are labeled [`good first issue`](../../issues?q=label%3A%22good+first+issue%22) in the issue tracker.

---

## License

MIT — see [LICENSE](./LICENSE) for details.
