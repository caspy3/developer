# PRD: Terminal Log Page with Journal & Token Tracker

## Overview

Create a new `/log.html` page for the terminal-styled website featuring:
- **Primary focus (top ~75%)**: Personal journal log (password-protected entry, public viewing)
- **Compact dashboard (bottom ~25%)**: Claude Code token usage tracker with daily/weekly breakdowns

This document serves as a complete implementation guide for a future Claude Code session.

---

## CRITICAL: Final Design Decisions (LOCKED IN)

These decisions have been finalized and should NOT be changed during implementation:

| Decision | Value | Notes |
|----------|-------|-------|
| **Password** | `1524` | Hash this for production backend |
| **Layout Ratio** | Journal ~75% / Tokens ~25% | Token tracker is a compact dashboard, NOT equal split |
| **Journal Initial State** | Empty | No sample entries - starts blank |
| **Token Data Source** | Manual entry only | Anthropic Admin API unavailable for individual accounts |
| **Design Prototype** | `log-feature-docs/log-design-concept.html` | Use this as the exact template |

---

## Executive Summary

| Aspect | Decision |
|--------|----------|
| **Authentication** | Google Apps Script backend (server-side password verification) |
| **Password** | `1524` (hash with SHA-256 for backend storage) |
| **Token Tracking** | Manual entry (Anthropic Admin API unavailable for individual accounts) |
| **Data Storage** | Google Sheets (journal entries + token data) |
| **Frontend** | Vanilla HTML/CSS/JS (matches existing site stack) |
| **Test Environment** | Local dev folder with Python HTTP server |

---

## Requirements

### Functional Requirements

**Journal Log (PRIMARY FOCUS - ~75% of screen)**
- [x] Scrollable list of dated journal entries
- [x] Anyone can view entries (public read)
- [x] Only owner can add entries (password: `1524`)
- [x] Auto-generated timestamps on entry creation
- [x] Terminal-styled modal for authentication + entry input
- [x] Empty state message when no entries exist
- [x] Entry IDs start at LOG-0001

**Token Tracker (COMPACT DASHBOARD - ~25% of screen, max 200px height)**
- [x] Display total tokens used (all-time)
- [x] Display weekly and daily token counts
- [x] Horizontal layout with stats on left, chart on right
- [x] Compact ASCII-style bar chart (7-day activity)
- [x] Manual token entry with password protection
- [x] Placeholder data until manually entered

### Non-Functional Requirements
- [x] Match existing terminal aesthetic (green/cyan/amber on dark)
- [x] CRT effects (scanlines, vignette, flicker)
- [x] Mobile responsive
- [x] No external dependencies (vanilla stack)
- [x] Rate limiting on write operations

---

## Architecture

### System Diagram

```
┌─────────────────────┐         ┌───────────────────────┐
│     log.html        │  fetch  │   Google Apps Script  │
│  (Frontend - JS)    │ ──────► │      (Backend)        │
│                     │ ◄────── │                       │
└─────────────────────┘   JSON  └───────────┬───────────┘
                                            │
                                            ▼
                                ┌───────────────────────┐
                                │    Google Sheets      │
                                │  - JournalEntries     │
                                │  - TokenUsage         │
                                │  - Config             │
                                └───────────────────────┘
```

### Data Flow

1. **Page Load**: Frontend fetches journal entries + token data (no auth)
2. **New Journal Entry**: Password → Verify → If valid, save entry
3. **New Token Entry**: Password → Verify → If valid, save tokens
4. **Caching**: LocalStorage caches data for 5 minutes to reduce API calls

---

## Data Schemas

### Google Sheet: "JournalEntries"

| Column | Type | Description |
|--------|------|-------------|
| A: id | String | Unique ID (LOG-0001, LOG-0002...) |
| B: timestamp | ISO DateTime | When entry was created |
| C: content | String | Entry text (max 5000 chars) |
| D: hidden | Boolean | Soft delete flag (FALSE by default) |

### Google Sheet: "TokenUsage"

| Column | Type | Description |
|--------|------|-------------|
| A: id | Number | Auto-increment |
| B: date | Date | YYYY-MM-DD format |
| C: tokens | Number | Token count for that date |
| D: notes | String | Optional note (e.g., "Claude session") |

### Google Sheet: "Config"

| Row | Setting | Value |
|-----|---------|-------|
| 1 | password_hash | SHA-256 hash of your password |
| 2 | rate_limit_window_minutes | 60 |
| 3 | max_writes_per_window | 5 |

---

## API Endpoints (Google Apps Script)

### GET Requests

**Get Journal Entries**
```
GET ?action=getJournalEntries

Response:
{
  "success": true,
  "entries": [
    { "id": "LOG-0047", "timestamp": "2026-01-10T14:32:00Z", "content": "..." },
    ...
  ]
}
```

**Get Token Data**
```
GET ?action=getTokenData

Response:
{
  "success": true,
  "total": 1847293,
  "weekly": 287456,
  "daily": 42891,
  "history": [
    { "date": "2026-01-10", "day": "Fri", "tokens": 42891 },
    ...
  ]
}
```

### POST Requests

**Verify Password**
```
POST { "action": "verifyPassword", "password": "..." }

Response: { "success": true } or { "success": false, "error": "Invalid" }
```

**Add Journal Entry**
```
POST {
  "action": "addJournalEntry",
  "password": "...",
  "content": "Entry text here"
}

Response: { "success": true, "entry": { ... } }
```

**Add Token Entry**
```
POST {
  "action": "addTokenEntry",
  "password": "...",
  "date": "2026-01-10",
  "tokens": 15000,
  "notes": "Claude session"
}

Response: { "success": true }
```

---

## Security Implementation

### Password Handling

**Password: `1524`**

```javascript
// Backend: Hash password with SHA-256 (never store plaintext)
function hashPassword(password) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password
  );
  return digest.map(b => (b < 0 ? b + 256 : b).toString(16).padStart(2, '0')).join('');
}

// Store hash in Script Properties (not in code)
// Run this ONCE during setup to store the hash for password "1524"
PropertiesService.getScriptProperties().setProperty('PASSWORD_HASH', hashPassword('1524'));
```

### Rate Limiting
```javascript
function isRateLimited(identifier) {
  const props = PropertiesService.getScriptProperties();
  const key = `rate_${identifier}`;
  const window = 60 * 60 * 1000; // 1 hour
  const maxWrites = 5;

  // Track timestamps of recent writes
  // Block if exceeds max in window
}
```

### Input Sanitization
- All user input HTML-escaped before storage/display
- Content length limits enforced (5000 chars)
- No script execution from user content

---

## Frontend Design

### Design Concept File (USE THIS AS EXACT TEMPLATE)
A complete, working HTML prototype with all styling and interactions is available at:
```
cam-casperson-website/log-feature-docs/log-design-concept.html
```

**IMPORTANT**: This file contains the FINAL approved design. Copy the CSS and HTML structure exactly. The only changes needed are:
1. Replace client-side password check with Google Apps Script API call
2. Replace mock token data with API fetch
3. Add localStorage caching

### Key Visual Elements

**Color Palette**
```css
--green: #39ff14;     /* Primary accent, status, journal */
--cyan: #22d3ee;      /* Secondary, token tracker */
--amber: #ffbf00;     /* Numbers, metrics */
--red: #ff3333;       /* Errors, close buttons */
--bg-primary: #161b22;
--bg-void: #0a0d10;
```

**CRT Effects**
- Scanlines (2px repeating gradient)
- Vignette (radial gradient darkening edges)
- Subtle screen flicker (0.02 opacity)
- Noise grain overlay

**Typography**
- JetBrains Mono (primary)
- Share Tech Mono (display/headers)

**Layout (FINAL - DO NOT CHANGE)**
- Status bar at top (node ID, status dot, clock)
- Journal panel takes ~75% of vertical space (grid-template-rows: 1fr auto)
- Token tracker is compact dashboard (~200px max-height)
- Horizontal layout inside token tracker (stats left, chart right)
- Terminal footer with blinking cursor

---

## Test Environment Setup

### Current Structure

Files are organized in:
```
cam-casperson-website/
├── index.html              # Main site
├── log-feature-docs/
│   ├── PRD.md              # This document
│   └── log-design-concept.html  # Working prototype (USE AS TEMPLATE)
```

### Testing the Prototype

1. **Open the design concept directly in browser:**
```bash
open cam-casperson-website/log-feature-docs/log-design-concept.html
```

2. **Or run a local server for full testing:**
```bash
cd cam-casperson-website
python -m http.server 8000
# Open http://localhost:8000/log-feature-docs/log-design-concept.html
```

### For Production Implementation

1. Copy `log-design-concept.html` to `cam-casperson-website/log.html`
2. Replace mock data with API calls
3. Add localStorage caching
4. Deploy Google Apps Script backend

### Local vs Production Detection
```javascript
const IS_LOCAL = window.location.hostname === 'localhost'
             || window.location.hostname === '127.0.0.1';

if (IS_LOCAL) {
  // Use mock data (for testing)
  state.journalEntries = [];
  state.tokenData = MOCK_TOKEN_DATA;
} else {
  // Fetch from Google Apps Script
  await fetchFromBackend();
}
```

---

## Token Tracking: Options Analysis

### Current Situation
- User has individual Anthropic account
- Admin API (for automated token tracking) requires organization account

### Options

**Option A: Manual Entry (Recommended for now)**
- User manually checks Claude Console usage
- Enters token counts via password-protected form
- Simple, reliable, works immediately

**Option B: Upgrade to Organization**
- Free to create organization in Anthropic Console
- Enables Admin API access
- Would allow automated token fetching via Apps Script backend
- Steps: Console → Settings → Organization → Create

**Option C: Claude Code Local Data**
- Claude Code may store session data locally
- Could potentially parse local files for token counts
- More complex, may break with updates

**Recommendation**: Start with Option A (manual), upgrade to Option B later if automation is desired.

---

## Implementation Steps

### Phase 1: Google Sheets Setup
1. Create new Google Sheet named "Log Data"
2. Add three sheets: JournalEntries, TokenUsage, Config
3. Set up column headers per schema above
4. Run password hash function ONCE to store hash for `1524`

### Phase 2: Google Apps Script Backend
1. Create new Apps Script attached to the Sheet
2. Implement `doGet()` for reading data
3. Implement `doPost()` for writing + password verification (password: `1524`)
4. Add rate limiting
5. Deploy as Web App (Anyone can access)

### Phase 3: Frontend (COPY FROM TEMPLATE)
1. Copy `log-feature-docs/log-design-concept.html` to `cam-casperson-website/log.html`
2. The CSS and HTML structure is FINAL - do not modify the layout
3. Update the JavaScript to:
   - Replace `password === '1524'` with API call to Google Apps Script
   - Replace `MOCK_TOKEN_DATA` with API fetch
   - Add localStorage caching (5 min TTL)

### Phase 4: Integration Testing
1. Test read operations (no auth)
2. Test password `1524` grants access
3. Test wrong password shows error
4. Test new journal entry saves and displays
5. Test rate limiting
6. Test mobile responsiveness

### Phase 5: Production Deployment
1. `log.html` should already be in `cam-casperson-website/`
2. Update `index.html` sidebar with link to log page
3. Deploy to Netlify
4. Test on live site with password `1524`

---

## Files to Create/Modify

### New Files
| File | Purpose |
|------|---------|
| `cam-casperson-website/log.html` | Main log page (COPY FROM `log-feature-docs/log-design-concept.html`) |
| `log-apps-script.js` | Backend (deploy to Google Apps Script) |

### Files to Modify
| File | Change |
|------|--------|
| `cam-casperson-website/index.html` | Add sidebar link to log.html |

### Reference Files
| File | Use For |
|------|---------|
| `cam-casperson-website/index.html` | CSS variables, terminal styling, layout patterns |
| `cam-casperson-website/google-apps-script.js` | Backend patterns, rate limiting, error handling |
| `cam-casperson-website/memorymatch.html` | LocalStorage patterns, screen state management |
| `cam-casperson-website/log-feature-docs/log-design-concept.html` | **EXACT TEMPLATE** - Copy this design |

---

## Verification Checklist

After implementation, verify:

**Layout & Design**
- [ ] Journal takes up ~75% of screen (primary focus)
- [ ] Token tracker is compact dashboard at bottom (~200px)
- [ ] CRT effects visible (scanlines, vignette)
- [ ] Clock updates in real-time

**Journal Functionality**
- [ ] Empty state message shows when no entries
- [ ] "New Transmission" button opens modal
- [ ] Wrong password shows "ACCESS DENIED" error
- [ ] Password `1524` shows "ACCESS GRANTED" and opens entry form
- [ ] New entry appears in list with correct timestamp
- [ ] Entry IDs increment correctly (LOG-0001, LOG-0002...)
- [ ] Journal entries are scrollable

**Token Tracker**
- [ ] Token stats display correctly (total, weekly, daily)
- [ ] Bar chart renders with correct proportions
- [ ] Manual token entry works with password `1524`

**Backend & Security**
- [ ] Password hash stored in Script Properties (not code)
- [ ] Rate limiting prevents spam
- [ ] Input sanitization working

**Mobile & Caching**
- [ ] Mobile layout works
- [ ] LocalStorage caching works
- [ ] Link from main page sidebar works

---

## Future Enhancements (Out of Scope)

- Automated token tracking via Anthropic Admin API (requires org account)
- Journal entry editing/deletion
- Token entry history view
- Export to CSV
- Search/filter journal entries
- Tags/categories for entries

---

## Sources

- [Anthropic Usage and Cost API](https://docs.anthropic.com/en/api/usage-cost-api)
- [Claude Code Analytics API](https://docs.claude.com/en/api/claude-code-analytics-api)
- [Cost and Usage Reporting in Console](https://support.anthropic.com/en/articles/9534590-cost-and-usage-reporting-in-console)
