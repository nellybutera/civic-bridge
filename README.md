# Civic Bridge Africa

A governance-literacy platform for African youth (ages 16–35): plain-language
explainers on parliamentary process and civic rights, comprehension quizzes,
a moderated discussion forum, and a live regional-integration tracker (AU,
EAC initiatives).

Built for the Software Development Cycle final summative.

## Live demo

- **Deployed app:** https://civic-bridge-steel.vercel.app/
- **Backend API (Swagger UI):** https://civic-bridge-api.onrender.com/swagger-ui/index.html ([repo](https://github.com/nellybutera/civic-bridge-api)) — the bare root URL returns a 500 by design (no landing route), so Swagger is the link to use to see the API live
- **Demo video:** ADD_YOUR_VIDEO_LINK_HERE
- **SRS document:** https://docs.google.com/document/d/1X3lUw-EJw0zpg27KlR0judLzAulZHfM29sC_SSEPRic/edit (v1.1 — includes a delivery-status appendix reconciling the pilot against the original spec)

### A note on first-load speed

The backend runs on Render's free tier, which sleeps after ~15 minutes with
no traffic. A GitHub Actions cron in the API repo pings it every 10 minutes
to keep it warm, but if you're the first visitor after a long gap, the very
first request (usually logging in) can take up to ~2 minutes while the
server wakes up — the page will show a "waking up the server" message
rather than appearing frozen. Every request after that is fast.

## Demo accounts

The API seeds three accounts on startup so every role can be tested without
signing up:

| Role | Email | Password |
|---|---|---|
| Admin | admin@civicbridge.africa | admin123 |
| Moderator | moderator@civicbridge.africa | mod123 |
| Youth User | youth@civicbridge.africa | youth123 |

You can also browse as a guest from the home page without logging in, or use
the Sign Up page to create a new Youth User account.

## Tech stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Backend:** Spring Boot 4 + PostgreSQL, JWT auth, deployed separately — see
  [civic-bridge-api](https://github.com/nellybutera/civic-bridge-api)
- **Deployment:** Vercel (frontend), Render (backend)

This frontend calls the live backend directly over HTTPS
(`NEXT_PUBLIC_API_URL`, defaulting to the Render URL above if unset) — there
is no client-side data layer. See [Architecture](#architecture) below.

## Actors and role permissions

| Capability | Guest | Youth User | Moderator | Admin |
|---|:---:|:---:|:---:|:---:|
| Browse civic content | Yes | Yes | Yes | Yes |
| View quizzes / forum / tracker | Yes | Yes | Yes | Yes |
| Take quizzes & save results | No | Yes | Yes | Yes |
| Post in the forum | No | Yes | Yes | Yes |
| Delete/moderate forum posts | No | No | Yes | Yes |
| Manage regional tracker items | No | No | No | Yes |
| Publish/edit/remove civic content | No | No | No | Yes |

Permissions are enforced twice: client-side (`permissionsFor()` in
`lib/auth-context.js`) for UX, and server-side in the API's
`RoleAuthorizationFilter` for actual security — the client checks are not
trusted.

## Getting started locally

**Prerequisites:** [Node.js 18.18 or later](https://nodejs.org) and npm
(comes bundled with Node).

1. Clone the repository:
   ```bash
   git clone https://github.com/nellybutera/civic-bridge.git
   cd civic-bridge
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 in your browser.
5. Log in with any of the demo accounts above, or sign up as a new user.

By default this points at the live Render backend, so no local database or
extra setup is required. To run against a local instance of the backend
instead, set `NEXT_PUBLIC_API_URL=http://localhost:8080` in a `.env.local`
file (see the [civic-bridge-api README](https://github.com/nellybutera/civic-bridge-api)
for running that locally).

## Deploying your own copy (Vercel)

1. Push this repository to your own GitHub account.
2. Go to https://vercel.com and sign in (Continue with Email works even if
   "Continue with GitHub" conflicts with an existing account on the same
   email — connect GitHub afterward under Settings → Git).
3. Click **Add New → Project**, select this repository, and set **Root
   Directory** to `civic-bridge` if your repo has the same nested folder
   layout as this one.
4. Click **Deploy**. No environment variables are required unless you're
   pointing at your own backend instead of the live one above.

## Project structure

```
app/
  page.js                    Landing page (problem, solution, regional pulse)
  login/page.js               Log in
  signup/page.js              Sign up (creates a Youth User)
  dashboard/page.js           Role-aware dashboard (protected route)
  civic-content/page.js       Explainers; Admin can publish/edit/remove
  quizzes/page.js             Quiz list
  quizzes/[id]/page.js        Take a quiz, see your score
  forum/page.js               Discussion forum, organized into topic rooms
  regional-tracker/page.js    AU/EAC initiative progress tracker
  community-guidelines/page.js  Moderation rules and political-neutrality policy
  faq/page.js                 Help / FAQ
lib/
  api.js                      Fetch client for the Spring Boot API
  auth-context.js             Auth state (calls /api/auth), roles, permissions
  progress.js                 Quiz result submission/retrieval via the API
  storage.js                  Browser-storage helper (session token only)
components/
  Navbar.js, Footer.js, CivicPulseBar.js, StatusBadge.js,
  RequireAuth.js, LoadingState.js, ErrorState.js
```

## Architecture

This frontend and the [Spring Boot API](https://github.com/nellybutera/civic-bridge-api)
are two independently deployed repos that talk over HTTPS — matching the
SRS's intended Next.js + Spring Boot + PostgreSQL design. Login and signup
return a JWT (`lib/auth-context.js`), which is attached as a Bearer token on
every write (posting to the forum, submitting a quiz result, managing the
tracker). Reads are public. The only thing kept in the browser is the
session token itself, in `localStorage`, so a refresh doesn't log you out.

## Known limitations

- First request after backend idle time is slow (see the note above) —
  this is a Render free-tier constraint, not an application bug.
- Passwords are hashed (BCrypt) server-side, but there's no password-reset
  flow or email verification.
- **Google OAuth is not implemented** — email/password only. The SRS lists
  OAuth as a login option; adding it would require registering an OAuth
  client and a callback flow, which is out of scope for this pilot build.
- **No profile management page** — users can't yet update their display
  name or notification preferences after signup.
- **No admin user-management panel** — Admins can manage content and the
  regional tracker, but there's no UI (or backend endpoint) yet to list
  users, suspend accounts, or assign roles. Role changes currently require
  a direct database update.
- **No account lockout after failed logins** — the SRS specifies locking an
  account for 15 minutes after 5 failed attempts; this isn't enforced.
- **Forum posts don't support replies** — posting and moderating (delete)
  work; threaded replies to an existing post are not implemented.
- **No flag-based moderation queue** — Moderators/Admins can delete any
  post directly; there's no reader-facing "flag" button or automatic
  hide-at-3-flags queue as described in the SRS.
- Civic content is organized by category rather than personalized to a
  user's selected country/regional bloc, and there's no keyword search or
  date-range filter yet — only category filtering.
