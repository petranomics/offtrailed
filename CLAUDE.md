# OFFTRAILED

AI-powered discovery trail platform that helps people break out of routines and find novel, underrated local experiences.

## Project Overview

Offtrailed generates personalized itineraries ("trails") of 3-10 stops based on location, vibe, budget, and duration. It uses Claude's API with web search to find real, current places and events.

## Architecture

- **Frontend**: React 18 + Vite (single-page app, no router library)
- **Styling**: All inline styles, no CSS framework. Dark theme with hiking/topo aesthetic.
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514) with web_search tool for live data
- **State**: React useState only — no external state management yet
- **Auth**: Currently mock/in-memory — needs real backend (see Roadmap)

## Key Files

- `src/App.jsx` — Entire app in one file (will be split later)
- `index.html` — Entry point
- `vite.config.js` — Dev server config

## Pages / Views (controlled by `pg` state variable)

| pg value | Description | Access |
|----------|-------------|--------|
| `home` | Landing page + trail builder form | Everyone |
| `results` | Generated trail with stops, check-ins, reroute | Everyone |
| `auth` | Sign-in dropdown (in header) | Logged out |
| `profile` | Saved trails + user preferences | Logged-in users |
| `collab` | Collaborative trails with voting/reordering | Logged-in users |
| `biz` | Business dashboard — metrics + incentive manager | Business accounts |
| `admin` | Algorithm boost controls | Admin accounts |

## Color System

All colors defined as constants at top of App.jsx:
- `BG` (#0e1a12) — dark forest green background
- `FG` (#8fbc6a) — primary green
- `HI` (#d4f0c0) — bright/highlight text
- `ACC` (#e8a835) — gold accent (times, costs, alerts)
- `AC2` (#d45a3a) — red accent (errors, downvotes)
- `AC3` (#6ab8d4) — blue accent
- `OK` (#6abf5a) — success green (check-ins)

## Demo Accounts (mock auth)

| Email | Password | Type |
|-------|----------|------|
| demo@offtrailed.com | trail123 | User (explorer) |
| biz@coffeehaus.com | biz123 | Business |
| admin@offtrailed.com | admin123 | Admin |

## Core Features

### Trail Builder
- Location, date, duration (2-3hrs / half day / full day / overnight)
- 6 vibe options as button grid
- Budget selector (Free / $ / $$ / $$$)
- Optional "mission" field for specific events/activities
- AI generates JSON with stops, times, tips, costs

### Check-in System
- Each stop has a CHECK IN button
- Progress bar shows X/Y checked in
- Incentive badges revealed on check-in (e.g. "Free chips & salsa")

### Collaborative Trails
- Shared itineraries with multiple members
- 👍👎 voting on individual stops (toggle on/off, tracks per-user)
- ▲▼ reorder stops
- Invite by email

### Business Dashboard
- KPI cards: Proposed / Check-ins / Conversion rate
- Monthly trend chart (proposed vs check-ins)
- Incentive manager: add/pause/enable deals, track redemptions

### Admin Panel
- Algorithm boost table: spot name, category, boost %, reason
- Enable/disable individual boosts
- Add new boosts
- Platform stats

## API Integration

The app calls Claude's Messages API directly from the browser. For local dev:
1. Set your API key in `.env` as `VITE_ANTHROPIC_API_KEY`
2. The header `anthropic-dangerous-direct-browser-access: true` enables CORS

**Note**: For production, API calls should go through a backend proxy to keep the key secure.

## Roadmap / TODO

### Immediate
- [ ] Split App.jsx into separate component files
- [ ] Add real authentication (Supabase, Firebase, or Auth0)
- [ ] Add persistent storage (database for trails, users, check-ins)
- [ ] Move API calls to a backend/serverless function

### Near-term
- [ ] Real-time collaborative editing (WebSocket or Supabase Realtime)
- [ ] GPS-based auto check-in (geolocation API)
- [ ] Google Maps embed in results
- [ ] KML/JSON export buttons
- [ ] Push notifications for trail reminders
- [ ] Business onboarding flow + Stripe for paid incentive tiers

### Future
- [ ] Mobile app (React Native)
- [ ] Social feed of public trails
- [ ] Trail ratings and reviews
- [ ] Gamification (badges, streaks, leaderboards)
- [ ] Partner API for businesses to manage listings

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run preview      # Preview production build
```

## Environment Variables

Create a `.env` file in the project root:

```
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```
