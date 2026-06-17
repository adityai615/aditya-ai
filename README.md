# Aditya OS

A fictional desktop-themed developer portfolio — an interactive OS shell where visitors explore projects, chat with a live AI agent, and poke around apps like they're on a real machine.

**Live site → [adityajain-os.vercel.app](https://adityajain-os.vercel.app/)**

---

## What is this?

Instead of a scroll-heavy résumé page, **Aditya OS** drops you into a desktop environment: draggable windows, a sidebar of apps, wallpapers, dark/light theme, and a command palette (`Ctrl+K`). It’s built by [Aditya Jain](https://linkedin.com/in/adityajain-ai) to show full-stack and AI work in a way that’s actually fun to use.

Works on **desktop** (window manager) and **mobile** (tab-based shell with a home screen).

---

## Highlights

- **AI Agent** — Portfolio assistant powered by **Gemini** and **Groq**, with automatic fallback, multi-turn chat, and a knowledge base synced to project data
- **Projects** — Featured work with expandable case-study details
- **GitHub** — Live profile and repo stats from the GitHub API
- **Spotify** — Live **Top 50 India** chart via Spotify Web API (with embed fallback)
- **Like counter** — Global likes on Upstash Redis, with per-visitor rate limits and tap animations
- **Terminal** — Playful CLI with `help`, `projects`, `contact`, `hire`, and more
- **About / Resume / Calculator / Uptime / Activity Monitor** — Extra personality and utility
- **Settings** — Theme toggle and wallpaper picker

---

## Built-in apps

| App | What it does |
|-----|----------------|
| Agent | Ask about projects, skills, hiring, and experience |
| GitHub | Repos, languages, and contribution overview |
| Projects | Portfolio case studies |
| Terminal | OS-style commands and easter eggs |
| About | Bio, skills, education, achievements |
| Monitor | Activity-style system view |
| Uptime | Boot / session uptime display |
| Resume | PDF viewer |
| Calc | Calculator |
| Spotify | Top 50 India playlist |
| Settings | Theme and wallpaper |

---

## Tech stack

| Layer | Tools |
|-------|--------|
| Framework | [Next.js 16](https://nextjs.org/), React 19, TypeScript |
| Styling | Tailwind CSS 4, Framer Motion |
| AI | [Vercel AI SDK](https://sdk.vercel.ai/), Gemini 2.5 Flash, Groq (Llama 3.3 70B) |
| Data | Upstash Redis (likes, chat rate limits) |
| APIs | Spotify Web API, GitHub REST API |
| Deploy | [Vercel](https://vercel.com) |

---

## Project structure

```
src/
├── app/                  # Next.js App Router, API routes
│   └── api/
│       ├── chat/         # AI agent endpoint
│       ├── likes/        # Global like counter
│       ├── spotify/      # Top songs
│       ├── github/       # Profile + repos
│       └── wallpapers/
├── components/
│   ├── os/               # Desktop shell, top bar, mobile tabs
│   └── windows/          # Per-app window content
└── lib/
    ├── ai/               # Providers, system prompt, chat types
    ├── portfolio-context.ts   # Single source for AI knowledge base
    └── contact.ts        # Shared LinkedIn / email links
```

---

## Run locally

**Requirements:** Node.js 20+, npm

```bash
git clone https://github.com/adityai615/aditya-ai.git
cd aditya-ai
npm install
```

Create `.env.local` in the project root:

```env
# AI (at least one required for the agent)
GEMINI_API_KEY=
GROQ_API_KEY=

# Likes + chat rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Spotify (optional — embed fallback exists)
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build    # production build
npm run start    # run production server
npm run lint     # ESLint
```

---

## Environment notes

| Variable | Required | Purpose |
|----------|----------|---------|
| `GEMINI_API_KEY` | One of Gemini/Groq | Primary AI provider |
| `GROQ_API_KEY` | One of Gemini/Groq | Secondary AI + fallback |
| `UPSTASH_REDIS_REST_URL` | For likes & rate limits | Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | For likes & rate limits | Redis REST token |
| `SPOTIFY_CLIENT_ID` | Optional | Spotify Web API |
| `SPOTIFY_CLIENT_SECRET` | Optional | Spotify Web API |

Without Redis, the like counter and chat rate limiting won’t work fully. Without Spotify keys, the chart still tries an embed-based fallback.

---

## Deploy

Optimized for **Vercel**:

1. Push the repo to GitHub
2. Import on [Vercel](https://vercel.com/new)
3. Add the env vars above in **Project → Settings → Environment Variables**
4. Deploy

The live deployment: **[https://adityajain-os.vercel.app/](https://adityajain-os.vercel.app/)**

---

## Contact

- **Website:** [adityajain-os.vercel.app](https://adityajain-os.vercel.app/)
- **LinkedIn:** [linkedin.com/in/adityajain-ai](https://linkedin.com/in/adityajain-ai)
- **GitHub:** [github.com/adityai615](https://github.com/adityai615)
- **Email:** adityajain.dev.ai11@gmail.com

---

Built with curiosity and too many windows open at once.
