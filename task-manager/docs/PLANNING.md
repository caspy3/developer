# Task Manager App - Planning Document

## Overview
Building a personal task management web app inspired by Sam's custom Lovable build. Accessible from phone and laptop, private to the user, synced via Airtable.

---

## User Decisions
- **Data Sync:** Airtable (free plan)
- **Auth:** Simple password gate (Airtable doesn't offer user auth)
- **Tags:** Work / Personal / Projects
- **Build Method:** Code with Claude

---

## App Analysis (From Transcript & Screenshots)

### Core Layout
**Kanban Board with 4 columns:**
1. **Queue** - Brain dump / backlog of all tasks (shows aggregate: "10h 30m, 11 tasks")
2. **Today** - Tasks to complete today (shows aggregate: "1h 30m, 3 tasks")
3. **Waiting** - Tasks blocked/waiting on someone else
4. **Completed** - Finished tasks (collapsible, collapsed by default)

Each column header shows:
- Column name
- Total estimated time for tasks in that column
- Task count
- "+" button to add task

### Task Card Fields
Each task displays:
- **Title** (e.g., "Send Chris Wedding Invite")
- **Description/Notes** - Quick reference notes
- **Due Date** - With color coding
- **Tag** - Category (Work, Personal, Projects)
- **Estimated Time** - (10 min, 30 min, 60 min, 90+ min)
- **Timer** - Shows "00:00:00" with play button
- **Checkbox** - To mark complete

### Visual Priority System (Left Sidebar on Cards)
- **Red** = High priority
- **Orange** = Medium priority
- **Yellow** = Low priority

### Due Date Color Coding
- **Green** = Beyond 3 days away
- **Blue** = Due today
- **Red** = Past due

### Create Task Modal
Fields in the task creation form:
- Title (text input)
- Description (textarea)
- Estimated Time (button group: 10 min, 30 min, 60 min, 90+ min)
- Priority (dropdown: High, Medium, Low)
- Tag (button selection: Work, Personal, Projects)
- Due Date (date picker)
- "Create Task" button

### Timer Functionality
- Start/pause timer per task
- Tracks actual time spent vs estimated
- Data collection for future analytics

---

## Technical Architecture

### Stack
- **Frontend:** Next.js 14 (React) with TypeScript
- **Styling:** Tailwind CSS
- **Database:** Airtable (free plan)
- **Hosting:** Vercel (free tier)
- **Auth:** Simple password gate (environment variable)

### Why This Stack
- Airtable free plan: 1,000 records, unlimited bases - plenty for personal use
- Next.js + Vercel = seamless deployment, great mobile experience
- Password gate = simple, secure enough for personal app
- All free tier compatible

### Airtable Schema

**Table: Tasks**
| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| Title | Single line text | Required |
| Description | Long text | Optional notes |
| Status | Single select | Queue, Today, Waiting, Completed |
| Priority | Single select | High, Medium, Low |
| Tag | Single select | Work, Personal, Projects |
| EstimatedMinutes | Number | 10, 30, 60, 90 |
| DueDate | Date | For color coding |
| TimeSpentSeconds | Number | Accumulated timer data |
| CreatedAt | Created time | Auto-generated |
| CompletedAt | Date | When marked complete |

### Authentication Flow
1. User visits app → sees password screen
2. Enter password → stored in browser session
3. Password validated against `APP_PASSWORD` env variable
4. On success → show main app
5. Session persists until browser closed or logout

### API Architecture
```
/api/auth/verify     - Validate password
/api/tasks           - GET all tasks, POST new task
/api/tasks/[id]      - PUT update task, DELETE task
```

---

## File Structure

```
task-manager/
├── CLAUDE.md                    # Project instructions for Claude
├── README.md                    # Project documentation
├── .env.local                   # Local environment variables (git ignored)
├── .env.example                 # Template for env variables
├── docs/
│   ├── PRD.md                   # Product Requirements Document
│   ├── PLANNING.md              # This file
│   └── IDEAS.md                 # Running notes from conversations
├── src/
│   ├── app/
│   │   ├── page.tsx             # Main board page
│   │   ├── layout.tsx           # App layout
│   │   └── api/                 # API routes
│   ├── components/
│   │   ├── Board.tsx            # Kanban board
│   │   ├── Column.tsx           # Single column
│   │   ├── TaskCard.tsx         # Task card component
│   │   ├── TaskModal.tsx        # Create/edit task modal
│   │   ├── Timer.tsx            # Task timer
│   │   └── PasswordGate.tsx     # Auth screen
│   ├── lib/
│   │   ├── airtable.ts          # Airtable client
│   │   └── utils.ts             # Helper functions
│   └── types/
│       └── index.ts             # TypeScript types
├── public/
│   └── manifest.json            # PWA manifest
├── tailwind.config.js
├── package.json
└── tsconfig.json
```

---

## Implementation Phases

### Phase 1: Project Setup
- [x] Create `task-manager` folder
- [x] Create CLAUDE.md with project context
- [x] Create docs/PLANNING.md (this file)
- [x] Create docs/IDEAS.md with transcript analysis
- [x] Create docs/PRD.md
- [x] Create .env.example
- [x] Initialize Next.js project with TypeScript + Tailwind
- [x] Set up Airtable base with Tasks table

### Phase 2: Authentication
- [x] Build PasswordGate component
- [x] Create /api/auth/verify endpoint
- [x] Add session storage for auth state
- [x] Test password flow

### Phase 3: Core Board UI
- [x] Build Board component (4 columns: Queue, Today, Waiting, Completed)
- [x] Build Column component with header stats
- [x] Build collapsible Completed column (collapsed by default)
- [x] Build TaskCard component with all visual elements
- [x] Implement priority color sidebar
- [x] Implement due date color coding
- [x] Implement gray styling for collapsed Completed column, full color when expanded
- [x] Make responsive for mobile

### Phase 4: Airtable Integration
- [x] Set up Airtable client
- [x] Create API routes for CRUD operations
- [x] Connect Board to fetch tasks from Airtable
- [x] Implement create task flow
- [x] Implement update task (status change, edits)
- [x] Implement delete task

### Phase 5: Task Modal
- [x] Build TaskModal component
- [x] All form fields (title, description, time, priority, tag, due date)
- [x] Calendar date picker for due date
- [x] Create and Edit modes
- [x] Form validation
- [x] Delete task button with confirmation dialog

### Phase 6: Timer Feature
- [x] Build Timer component
- [x] Start/pause functionality
- [x] Persist time to Airtable on pause
- [x] Display accumulated time on cards
- [x] Auto-pause when switching tasks
- [x] Active timer indicator in header
- [x] Timer reset button (shows when running)

### Phase 7: Drag & Drop
- [x] Add drag-and-drop between columns
- [x] Update status in Airtable on drop
- [x] Visual feedback during drag

### Phase 8: Deploy & Polish
- [ ] Set up Vercel project
- [ ] Configure environment variables in Vercel
- [ ] Add PWA manifest for mobile install
- [ ] Final responsive design tweaks
- [ ] Test on phone and laptop

---

## Environment Variables

```
# .env.example
APP_PASSWORD=your_secure_password_here
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_NAME=Tasks
```

---

## Verification Plan
- [ ] Test password gate (correct/incorrect password)
- [ ] Test on desktop Chrome
- [ ] Test on desktop Safari
- [ ] Test on iOS Safari (mobile)
- [ ] Test on Android Chrome (mobile)
- [ ] Verify Airtable sync (create task on phone, see on laptop)
- [ ] Verify timer accuracy
- [ ] Verify data persists on refresh
- [ ] Test drag-and-drop functionality
- [ ] Test PWA install on mobile

---

## Design Decisions (Resolved)

### Completed Tasks
- When checkbox is clicked, task moves to "Completed" status in Airtable
- Completed tasks move to a **4th "Completed" column** (collapsible)
- Column is **collapsed by default** - shows as a thin vertical bar with "Completed" label
- When expanded, tasks display in their original visual state (priority colors, due dates, etc.)
- All completed tasks rendered **gray** in collapsed preview, but **full color** when expanded
- Data remains fully intact in Airtable for future analytics/dashboard use
- CompletedAt timestamp recorded for historical tracking

### Task Ordering
- Tasks within columns sorted by: **Priority (High first), then Due Date (soonest first)**
- No manual drag-to-reorder within columns (MVP simplicity)
- Drag-and-drop only for moving between columns

### Timer Conflicts
- Only **one timer can run at a time**
- Starting Timer B **auto-pauses Timer A** and saves A's elapsed time
- Visual indicator shows which task has active timer

### Missing Due Date
- Tasks with no due date show **no date badge** (badge omitted entirely)
- They sort to the bottom within their priority group

### Error Handling
- **Airtable unreachable:** Show toast "Could not save. Retrying..." with auto-retry
- **Session expired:** Redirect to password screen
- **Invalid form data:** Inline validation errors before submit
- **API errors:** Generic toast with "Something went wrong. Please try again."

### Delete Confirmation
- Deleting a task shows confirmation dialog: "Delete this task? This cannot be undone."
- Matches CLAUDE.md rule: never delete without confirmation

---

## Future Enhancements (Post-MVP)
- Google Calendar integration
- Time tracking analytics dashboard
- Completion prompts ("Could I have delegated this?")
- Standard deviation on time estimates
- Dark mode
- Keyboard shortcuts
