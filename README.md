# ai-mental-health-journal

AI-powered mental health journal with emotion detection, analytics, and a supportive AI chatbot/avatar for emotional wellbeing (**SereneMind**).

## Stack

- **Next.js** (App Router) + **Tailwind CSS** — backend logic uses **Route Handlers** (`app/api/**/route.ts`), not Express
- **MongoDB** + **Mongoose**
- **JWT** (HTTP-only cookie after registration and login — not exposed in `localStorage`)
- **bcrypt** for password hashing

## Getting started

1. Copy `.env.example` to `.env.local` and set `MONGODB_URI` and `JWT_SECRET`.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000). Test **Sign up** (`/signup`) and **Sign in** (`/login`); after login you are redirected to **`/dashboard`**.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run test` — Vitest (registration + login validation tests)

## Sprint 1 — AM-01 User Registration

Implemented: User schema, MongoDB connection, `POST /api/register`, bcrypt hashing, server-side validation (Zod), duplicate email handling, signup UI with client validation, success/error feedback, and automated tests for validation rules.

**Subtask 13 (Jira):** Mark the story complete and attach proof (screenshots of successful signup, test run, or API responses) in your project tracker.

## Sprint 1 — AM-02 Secure Login

Implemented: `POST /api/login` (Route Handler), credential checks with `bcrypt.compare`, JWT in HTTP-only cookie (no token in JSON), generic error for bad credentials (no user enumeration), login UI with validation, redirect to `/dashboard`, `GET /api/me` for session-aware UI, and Vitest tests for login body validation.

**Subtask 14 (Jira):** Mark complete and attach proof (successful login, failed login, test run) as required.

## Sprint 1 — AM-04 Profile management

Implemented: extended **User** schema (`preferences`, `emotionalGoals`, `bio` with maxlength + defaults), **`GET /api/profile`** and **`PUT /api/profile`** (password never returned), **JWT middleware** (`jose` + HS256) for `/profile` and `/api/profile`, Zod validation on updates, **`/profile`** page (load + save with success/error UI), dashboard link to profile, and Vitest tests for profile validation.

**Important:** Uses **HTTP-only cookies** and same-origin `fetch` with `credentials: "same-origin"`. Restart `npm run dev` after changing `.env.local`.

**Subtask 14 (Jira):** Mark story complete; attach screenshots or API proof (GET/PUT, 401 without cookie) as needed.

## Sprint 1 — MH-03 Write journal entries

Implemented: **Journal** Mongoose model (`userId`, `content`, emotion fields, `createdAt` / `updatedAt` via timestamps), **`POST /api/journal`** with Zod validation and cookie session (`getAuthenticatedUser`), **`POST /api/emotion`** (same analysis module), modular **`analyzeEmotion()`** (keyword mock today—swap for a real model), emotion results persisted on the journal document when analysis succeeds (failures do not roll back the save), JWT middleware includes **`/api/emotion`**, journal UI shows a **SereneMind insight** card after save, and tests cover mock analysis.
