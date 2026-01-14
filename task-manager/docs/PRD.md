# Task Manager - Product Requirements Document

## Product Overview

### Vision
A personal task management web app that helps fill idle time gaps with meaningful work. Simple, visual, and private.

### Problem Statement
Existing task management tools (Asana, Trello, Todoist, etc.) are either:
- Too complex with features you don't need
- Too collaborative when you just want personal tracking
- Not customized to individual workflows

The result: wasted time between meetings scrolling Twitter instead of doing actual work.

### Solution
A minimal Kanban board that:
1. Shows your brain dump of tasks (Queue)
2. Highlights what to do today (Today)
3. Tracks what's blocked (Waiting)
4. Makes it obvious what fits in a 30-minute gap

---

## Target User

**Primary User:** Me (single user, personal use)

**Characteristics:**
- Manages multiple projects/companies
- Has irregular schedule with time gaps
- Needs visual cues to stay on track
- Values simplicity over features

---

## Core Features (MVP)

### 1. Kanban Board
**Columns:**
| Column | Purpose |
|--------|---------|
| Queue | Backlog of all tasks, brain dump |
| Today | Tasks to complete today |
| Waiting | Tasks blocked on someone else |
| Completed | Finished tasks (collapsible, collapsed by default) |

**Column Header Shows:**
- Column name
- Total estimated time (sum of all tasks)
- Task count
- Add task button (+)

### 2. Task Cards
**Required Fields:**
| Field | Type | Purpose |
|-------|------|---------|
| Title | Text | What to do |
| Description | Text | Notes, links, context |
| Priority | Select | High / Medium / Low |
| Tag | Select | Work / Personal / Projects |
| Estimated Time | Select | 10 / 30 / 60 / 90+ min |
| Due Date | Date | When it's due |

**Visual Indicators:**
- Left sidebar color = Priority (Red/Orange/Yellow)
- Due date badge color = Urgency (Red=overdue, Blue=today, Green=future)

### 3. Timer
- Start/pause button on each task
- Shows elapsed time (HH:MM:SS)
- Persists across page refresh
- Only one timer active at a time

### 4. Task Actions
- Create new task (modal form)
- Edit existing task
- Move between columns (drag-drop or buttons)
- Mark complete (checkbox) → moves to Completed column
- Delete task

### 5. Completed Column Behavior
- **Collapsed by default** - displays as thin vertical bar with "Completed" label
- **Click to expand** - reveals all completed tasks
- **Gray styling when collapsed** - visual distinction from active columns
- **Full color when expanded** - tasks show original priority colors, due dates, etc.
- **Data preserved** - all task data remains intact in Airtable for future analytics

### 6. Authentication
- Simple password gate
- Enter password to access app
- Session persists until browser closed

---

## User Flows

### Flow 1: Daily Planning
1. Open app, enter password
2. Review Queue column
3. Drag tasks to Today based on available time
4. See total estimated time for Today

### Flow 2: Working on Task
1. Find task in Today column
2. Click play to start timer
3. Work on task
4. Click pause when interrupted or done
5. Check off task when complete

### Flow 3: Adding New Task
1. Click "+" on any column
2. Fill out task form
3. Click "Create Task"
4. Task appears in selected column

### Flow 4: Task Blocked
1. Realize task needs input from someone
2. Drag task to Waiting column
3. Add note about what you're waiting for

---

## Technical Requirements

### Performance
- Page load < 2 seconds
- Task operations < 500ms response
- Works offline with cached data (stretch goal)

### Compatibility
- Desktop: Chrome, Safari, Firefox (latest)
- Mobile: iOS Safari, Android Chrome
- Responsive design, mobile-first

### Security
- Password stored as environment variable (not in code)
- HTTPS only
- No sensitive data in localStorage

### Data
- Stored in Airtable
- Syncs across devices
- No data loss on refresh

---

## Design Specifications

### Color Palette
| Element | Color | Hex |
|---------|-------|-----|
| High Priority | Red | #EF4444 |
| Medium Priority | Orange | #F97316 |
| Low Priority | Yellow | #EAB308 |
| Due Today | Blue | #3B82F6 |
| Due Future | Green | #22C55E |
| Overdue | Red | #EF4444 |
| Background | Dark Gray | #1F2937 |
| Card Background | Lighter Gray | #374151 |

### Typography
- Font: System default (SF Pro on Mac, Segoe on Windows)
- Title: 16px semibold
- Body: 14px regular
- Meta (dates, times): 12px

### Spacing
- Card padding: 16px
- Gap between cards: 8px
- Column width: ~300px (flexible)

---

## Out of Scope (V1)

- Multi-user / collaboration
- External integrations (Calendar, Stripe)
- Recurring tasks
- Subtasks
- File attachments
- Comments
- Notifications
- Native mobile app

---

## Success Metrics

1. **Adoption:** Using the app daily for 2+ weeks
2. **Task Completion:** Completing 5+ tasks per day
3. **Time Gaps:** Filling 80% of 30+ minute gaps with tasks
4. **Data:** Tracking actual time on 50%+ of tasks

---

## Future Roadmap

### Phase 2: Analytics
- Time spent by category
- Estimated vs actual time
- Weekly/monthly reports

### Phase 3: Integrations
- Google Calendar (see meetings)
- Completion prompts

### Phase 4: Advanced Features
- Recurring tasks
- Dark/light mode toggle
- Keyboard shortcuts
- Quick-add widget

---

## Appendix

### Airtable Schema
See `docs/PLANNING.md` for full schema.

### Wireframes
Reference screenshots from original video stored locally.
