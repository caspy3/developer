# Task Manager - Ideas & Notes

## Source
Inspired by Sam's custom task management tool discussed in a podcast. He built it in 2 hours using Lovable (no-code tool) and shared it on Twitter.

---

## Key Quotes from Transcript

### The Problem
> "I struggle with prioritization and task management across all of the different things that we do. I've tried every single task management tool under the sun, and I hate them all. None of them do exactly what I want them to do."

> "I like a Kanban board. I like a due date. But none of them are like custom-built for me the way that I want it."

### The Solution
> "I decided I was just going to build my own custom task management software... I literally just ran in two hours built out like actually a perfect task management system for myself."

### Why It Works for Him
> "I find myself waking up in the morning or getting off of a phone call and then having an hour before my next phone call. Like four or five times a week, I'll just end up on Twitter for an hour... I just blow the hour."

> "I think I just need like the most rudimentary tracking system that has zero external inputs. It's just me. There's no Zap integration, like nothing. I define the list of things. I then manage that list in that time."

### The Trigger Effect
> "I had a call an hour before we popped on. I could have blew that time on Twitter, which I probably would have, but then I saw it and I was like, 'Oh, I have a 60-minute task that's like a medium priority that's due next week. I might as well just knock that out.' And now that's like off my plate."

> "It changes the dynamic of those open time slots because it quantifies that hour gap you have. I'd be like, 'Dude, I could at least knock out two of these 15-minute tasks.'"

---

## Design Philosophy

### Simplicity Over Features
- No external integrations (at first)
- No collaboration features
- Just a personal, private task list
- Brain dump on the left, execution in the middle

### Visual Clarity
- Color-coded priorities (red/orange/yellow sidebar)
- Color-coded due dates (red/blue/green)
- Aggregate time per column
- At-a-glance understanding of workload

### Time Awareness
- Estimated time forces you to think about task size
- Timer tracks actual time spent
- Aggregate shows total work queued
- Helps fill time gaps productively

---

## Feature Ideas (From Transcript)

### Implemented in His V1
1. Kanban columns: Queue, Today, Waiting
2. Task fields: Title, Description, Due Date, Priority, Tag, Estimated Time
3. Priority color sidebar
4. Due date color coding
5. Timer per task
6. Aggregate time per column

### Future Features He Mentioned
1. **Google Calendar integration** - See meetings alongside tasks
2. **Stripe integration** - Track revenue per hour per company
3. **Completion prompts:**
   - "Could I have delegated this?"
   - "Did this take longer than it should have?"
4. **Time analytics:**
   - % of time spent on each company
   - Standard deviation on time estimates
   - Estimated vs actual comparison

### Ideas from the Conversation
1. **Beat your estimate game** - Stack time when you finish early
2. **Skin in the game** - Pay money if you don't complete tasks (like Beeminder)

---

## Technical Insights (From Transcript)

### Three Components of Any App
> "When you think about any technology, there's really like three components. There's the data, like what exists in the back end. There's the front end which is the display of that data and then there's the middle which is like the manipulation of that data."

### Prompting Approach
> "I see all these guys... giving it code to prompt. And it's like you're like, 'Dude, I'm like, no, no, no. I want this button to be yellow when it's this' and just like let it do its thing."

> "Anytime Lovable says there's an error, I just click Fix. I go, it'll figure it out."

### Version Control Tip
> "Don't be scared to restore previous versions. Like if it did something wrong, if it messed it up, restore it back. Because what you don't want it to do is like do something wrong and then be trying to fix what it did wrong when you could just have it like rebuild it with a little bit of a smarter prompt."

---

## My Customizations to Consider

### Tags (Categories)
- Work
- Personal
- Projects

### Additional Ideas for My Version
- [x] Add a "Completed" column to archive done tasks (now part of core design - collapsible 4th column)
- [ ] Weekly/monthly time reports
- [ ] Recurring tasks
- [ ] Quick-add from mobile (maybe a bookmarklet?)
- [ ] Dark mode
- [ ] Keyboard shortcuts (J/K to navigate, Enter to edit, etc.)

---

## Questions (Resolved)
1. **Tasks with no due date?** → No badge shown, sort to bottom within priority group
2. **Completed tasks?** → Move to collapsible 4th column (collapsed by default). Gray when collapsed, full color when expanded. Data preserved in Airtable for analytics.
3. **Timer conflict when switching tasks?** → Auto-pause previous timer, save elapsed time
4. **Mobile-first or desktop-first?** → Responsive design, works on both. Test mobile early.

---

## Session Log

### Session 1 (Initial Planning)
- Analyzed podcast transcript
- Identified core features from screenshots
- Decided on tech stack: Next.js + Airtable + Vercel
- Created project structure
- Documented design patterns and philosophy
