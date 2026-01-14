# Task Manager - Project Status & Next Steps

**Last Updated:** January 12, 2026

---

## Project Summary

Building a personal Kanban-style task manager inspired by a podcast where the host built one in 2 hours using Lovable. We're building with code (Next.js + Airtable) instead.

**Goal:** A private web app accessible from phone and laptop that helps fill idle time gaps with tasks.

---

## Current Status: Phase 1 Complete (Setup)

### What's Done
- [x] Project folder created at `/Users/cameroncasperson/developer/task-manager`
- [x] Next.js 14 initialized with TypeScript, Tailwind CSS, ESLint, App Router
- [x] Airtable SDK installed (`npm install airtable`)
- [x] Documentation created:
  - `CLAUDE.md` - Project instructions for Claude
  - `docs/PLANNING.md` - Full implementation plan with 8 phases
  - `docs/IDEAS.md` - Transcript analysis, design philosophy, quotes
  - `docs/PRD.md` - Product requirements, user flows, design specs
  - `.env.example` - Environment variable template
- [x] Airtable base "Task-Manager" created with Tasks table
- [x] `.env.local` configured with credentials (connection verified)

### Ready for Next Phase
Phase 1 is complete. Ready to start Phase 2 (Authentication).

---

## Airtable Setup Instructions

### Step 1: Create a New Base
1. Go to [airtable.com](https://airtable.com)
2. Click "Add a base" → "Start from scratch"
3. Name it "Task Manager"

### Step 2: Create the Tasks Table
Rename the default table to "Tasks" and add these fields:

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| Title | Single line text | (default first field) |
| Description | Long text | For notes, links, context |
| Status | Single select | Options: `Queue`, `Today`, `Waiting`, `Completed` |
| Priority | Single select | Options: `High`, `Medium`, `Low` |
| Tag | Single select | Options: `Work`, `Personal`, `Projects` |
| EstimatedMinutes | Number | For time estimates (10, 30, 60, 90) |
| DueDate | Date | For due date color coding |
| TimeSpentSeconds | Number | Timer accumulates here |

### Step 3: Get Your Credentials
1. **Base ID:** Look at your Airtable URL - it's the part after `airtable.com/` that starts with `app` (e.g., `appXXXXXXXXXXXXXX`)
2. **Personal Access Token:**
   - Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
   - Create a new token with these scopes:
     - `data.records:read`
     - `data.records:write`
   - Add access to your "Task Manager" base
   - Copy the token (starts with `pat_`)

### Step 4: Create .env.local
Create a file called `.env.local` in the project root:
```
APP_PASSWORD=your_chosen_password_here
AIRTABLE_API_KEY=pat_xxxxxxxxxxxxx
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=Tasks
```

---

## Next Phase: Authentication (Phase 2)

Once Airtable is set up, the next steps are:

1. Build `PasswordGate` component - simple password entry screen
2. Create `/api/auth/verify` endpoint - validates password against env var
3. Add session storage - keeps user logged in until browser closes
4. Test the flow - correct/incorrect password handling

---

## Tech Stack Reference

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14 (App Router) | React framework with server components |
| Styling | Tailwind CSS | Utility-first CSS |
| Database | Airtable (free tier) | Stores tasks, syncs across devices |
| Auth | Simple password gate | Single password protects app |
| Hosting | Vercel (planned) | Free deployment platform |

---

## Key Design Decisions (Already Made)

1. **Completed tasks** disappear from board (filtered out, viewable in Airtable)
2. **Task ordering:** Priority first (High→Low), then Due Date (soonest first)
3. **Timer conflicts:** Starting new timer auto-pauses previous one
4. **No due date:** Task shows no badge, sorts to bottom of priority group
5. **Delete confirmation:** Always show "Are you sure?" dialog

---

## File Structure

```
task-manager/
├── CLAUDE.md                 # Read this first - project rules
├── .env.example              # Template for environment variables
├── .env.local                # YOUR secrets (create this, don't commit)
├── docs/
│   ├── PLANNING.md           # Implementation phases & technical details
│   ├── IDEAS.md              # Inspiration, quotes, brainstorming
│   ├── PRD.md                # Product requirements & design specs
│   └── NEXT-STEPS.md         # This file - current status
├── src/
│   └── app/
│       └── page.tsx          # Default Next.js page (will be replaced)
├── package.json              # Dependencies (next, react, tailwind, airtable)
└── ... (config files)
```

---

## Commands

```bash
cd /Users/cameroncasperson/developer/task-manager
npm run dev      # Start development server at localhost:3000
npm run build    # Build for production
```

---

## For Fresh Claude Session

Start with:
> "I'm building a task manager app. Read the docs in `/Users/cameroncasperson/developer/task-manager/docs/`. Airtable is configured - let's start Phase 2 (Authentication)."
