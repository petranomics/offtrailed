# ↗ OFFTRAILED

**Break the loop. Find what's new.**

AI-powered discovery trails that help you find novel, underrated local experiences. No tourist traps.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add your Anthropic API key
cp .env.example .env
# Edit .env and paste your key from https://console.anthropic.com

# 3. Start the dev server
npm run dev
```

App opens at `http://localhost:3000`

## Using with Claude Code

This project includes a `CLAUDE.md` file that gives Claude Code full context about the codebase. Just open the project folder and start asking Claude Code to make changes:

```bash
# Install Claude Code if you haven't
npm install -g @anthropic-ai/claude-code

# Open the project
cd offtrailed
claude
```

Claude Code will read `CLAUDE.md` and understand the entire project structure, features, and roadmap.

## Demo Accounts

| Account | Email | Password |
|---------|-------|----------|
| Explorer | demo@offtrailed.com | trail123 |
| Business | biz@coffeehaus.com | biz123 |
| Admin | admin@offtrailed.com | admin123 |

## Features

- 🧭 **Trail Builder** — Location, date, duration, vibe, budget
- 🔍 **AI-Powered** — Claude + web search finds real, current places
- 📍 **Check-ins** — Confirm arrival at each stop
- 🎁 **Incentives** — Business perks unlocked on check-in
- 👥 **Collab** — Shared trails with voting and reordering
- 📊 **Business Dashboard** — Proposed vs attended metrics
- ⚡ **Admin Panel** — Algorithm boost controls

## Tech Stack

- React 18 + Vite
- Anthropic Claude API (Sonnet) with web search
- Inline styles (no CSS framework)

## License

MIT
