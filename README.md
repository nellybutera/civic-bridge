# Civic Bridge Africa

A governance-literacy platform for African youth (ages 16–35): plain-language
explainers on parliamentary process and civic rights, comprehension quizzes,
a moderated discussion forum, and a live regional-integration tracker (AU,
EAC initiatives).

Built for the Software Development Cycle final summative.

## Live demo

- **Deployed app:** ADD_YOUR_VERCEL_URL_HERE
- **Demo video:** ADD_YOUR_VIDEO_LINK_HERE
- **SRS document:** ADD_YOUR_SRS_LINK_HERE

## Demo accounts

The app ships with three seeded accounts so every role can be tested without
signing up:

| Role | Email | Password |
|---|---|---|
| Admin | admin@civicbridge.africa | admin123 |
| Moderator | moderator@civicbridge.africa | mod123 |
| Youth User | youth@civicbridge.africa | youth123 |

You can also click "Continue as guest" from the home page to explore without
logging in, or use the Sign Up page to create a new Youth User account.

## Tech stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Data layer:** client-side persistence (browser storage), seeded on first
  load — see [Note on the data layer](#note-on-the-data-layer) below
- **Deployment:** Vercel

## Actors and role permissions

| Capability | Guest | Youth User | Moderator | Admin |
|---|:---:|:---:|:---:|:---:|
| Browse civic content | Yes | Yes | Yes | Yes |
| View quizzes / forum / tracker | Yes | Yes | Yes | Yes |
| Take quizzes & save results | No | Yes | Yes | Yes |
| Post in the forum | No | Yes | Yes | Yes |
| Delete/moderate forum posts | No | No | Yes | Yes |
| Manage regional tracker items | No | No | No | Yes |

## Getting started locally

**Prerequisites:** [Node.js 18.18 or later](https://nodejs.org) and npm
(comes bundled with Node).

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/civic-bridge.git
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

No environment variables, database, or API keys are required to run this
project locally.

## Deploying your own copy (Vercel)

1. Push this repository to your own GitHub account (see "Pushing to GitHub"
   below).
2. Go to https://vercel.com and sign in with GitHub.
3. Click **Add New -> Project**, select this repository, and click **Deploy**.
   No configuration or environment variables are needed.
4. Vercel will give you a public URL (e.g. `civic-bridge.vercel.app`) once
   the build finishes (roughly 1-2 minutes).

## Pushing to GitHub

```bash
cd civic-bridge
git init
git add .
git commit -m "Initial commit: Civic Bridge Africa prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/civic-bridge.git
git push -u origin main
```
Make sure the repository is set to **Public** in GitHub's repository settings
(Settings -> General -> Danger Zone -> Change visibility).

## Project structure

```
app/
  page.js                   Landing page (problem, solution, regional pulse)
  login/page.js              Log in
  signup/page.js             Sign up (creates a Youth User)
  dashboard/page.js          Role-aware dashboard (protected route)
  civic-content/page.js      Governance/civic-rights explainers
  quizzes/page.js            Quiz list
  quizzes/[id]/page.js       Take a quiz, see your score
  forum/page.js              Discussion forum (post + moderate)
  regional-tracker/page.js   AU/EAC initiative progress tracker
lib/
  auth-context.js            Auth state, roles, permissions
  data.js                    Seed content (civic content, quizzes, tracker, forum)
  progress.js                Quiz result persistence
  storage.js                 Browser-storage read/write helpers
components/
  Navbar.js, Footer.js, CivicPulseBar.js, RequireAuth.js
```

## Note on the data layer

The SRS specifies a Next.js + Java/Spring Boot + PostgreSQL architecture.
For this prototype, given the implementation timeline, the backend and
database were simplified to client-side persistence (data is seeded once
and stored in the browser) so the full user-facing feature set — auth,
role permissions, quizzes, forum, tracker — could be built and deployed
without standing up separate backend infrastructure. Swapping in a real
API layer (Spring Boot) backed by PostgreSQL is the natural next step and
would require no changes to the page components beyond replacing the
functions in `lib/` with API calls.

## Known limitations

- Data resets if browser storage is cleared, and is not shared across
  devices/browsers (no real backend yet — see note above).
- Passwords are stored in plain text for demo purposes only; this is not
  production-ready authentication.
