# Task Manager - Project Instructions

## Project Overview
Personal task management web app with Kanban board layout. Syncs via Airtable, accessible from phone and laptop.

## Tech Stack
- **Frontend:** Next.js 14 with TypeScript
- **Styling:** Tailwind CSS
- **Database:** Airtable (free plan)
- **Hosting:** Vercel
- **Auth:** Simple password gate

## Core Features
- 3-column Kanban board (Queue, Today, Waiting)
- Task cards with priority colors, due date indicators, timer
- Create/edit task modal
- Time tracking per task
- Responsive design (mobile-first)

## Development Rules

**NEVER:**
- Store passwords, API keys, or secrets in code files
- Commit .env.local or any file with secrets
- Delete data without confirmation
- Skip error handling

**ALWAYS:**
- Use .env files for sensitive configuration
- Validate user input
- Handle API errors gracefully
- Keep components simple and readable

## File Structure
```
src/
├── app/           # Next.js app router pages
├── components/    # React components
├── lib/           # Utilities and Airtable client
└── types/         # TypeScript types
```

## Key Files
- `src/lib/airtable.ts` - Airtable API client
- `src/components/Board.tsx` - Main Kanban board
- `src/components/TaskCard.tsx` - Individual task card
- `src/components/TaskModal.tsx` - Create/edit form

## Environment Variables Required
- `APP_PASSWORD` - Password to access the app
- `AIRTABLE_API_KEY` - Airtable personal access token
- `AIRTABLE_BASE_ID` - Airtable base ID
- `AIRTABLE_TABLE_NAME` - Name of tasks table (default: Tasks)

## Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
```
