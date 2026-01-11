# Next Steps: Log Page Deployment Guide

**Status:** Implementation complete, awaiting deployment

---

## Files Created

| File | Purpose | Status |
|------|---------|--------|
| `cam-casperson-website/log.html` | Log page with journal & token tracker | Ready |
| `cam-casperson-website/log-apps-script.js` | Backend code for Google Apps Script | Ready |
| `cam-casperson-website/index.html` | Updated with sidebar link to log.dat | Ready |

---

## Part 1: Set Up Google Sheet (5 min)

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **+ Blank** to create new spreadsheet
3. Click "Untitled spreadsheet" and rename to **Log Data**
4. Rename the first sheet tab (at bottom) to **JournalEntries**
5. Add headers in row 1:
   - A1: `id`
   - B1: `timestamp`
   - C1: `content`
   - D1: `hidden`
6. Click the **+** at bottom to add new sheet, name it **TokenUsage**
7. Add headers:
   - A1: `id`
   - B1: `date`
   - C1: `tokens`
   - D1: `notes`

---

## Part 2: Deploy Apps Script (5 min)

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete any existing code in Code.gs
3. Open `cam-casperson-website/log-apps-script.js` and copy ALL the code
4. Paste it into the Apps Script editor

### Initialize the Password

5. Click the function dropdown (shows "myFunction" or similar)
6. Select **setupPasswordHash**
7. Click **Run** (play button)
8. When prompted:
   - Click **Review Permissions**
   - Select your Google account
   - Click **Advanced**
   - Click **Go to Log Data (unsafe)**
   - Click **Allow**
9. Check the log (View → Logs) - should show "Password hash stored successfully"

### Deploy as Web App

10. Click **Deploy** → **New deployment**
11. Click the gear icon next to "Select type" → choose **Web app**
12. Fill in:
    - Description: `Log API v1`
    - Execute as: **Me**
    - Who has access: **Anyone**
13. Click **Deploy**
14. **IMPORTANT: Copy the Web App URL** (looks like `https://script.google.com/macros/s/AKfycb.../exec`)

---

## Part 3: Connect Frontend to Backend

1. Open `cam-casperson-website/log.html` in a text editor
2. Find this line near the top of the `<script>` section (around line 1010):
   ```javascript
   const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace with your actual URL:
   ```javascript
   const API_URL = 'https://script.google.com/macros/s/YOUR_ACTUAL_ID/exec';
   ```
4. Save the file

---

## Part 4: Test Locally

Run a local server to test:

```bash
cd /Users/cameroncasperson/developer/cam-casperson-website
python3 -m http.server 8000
```

Then open in browser:
- **Main site:** http://localhost:8000
- **Log page:** http://localhost:8000/log.html

### Test Checklist (Local Mode - Uses Mock Data)

- [ ] Boot sequence animation plays
- [ ] Empty journal shows "No transmissions logged"
- [ ] Click "+ NEW TRANSMISSION" → modal opens
- [ ] Enter password `1524` → shows "ACCESS GRANTED"
- [ ] Submit a test entry → appears in list
- [ ] Token chart displays with zeros
- [ ] Sidebar link on main page works

---

## Part 5: Deploy to Netlify

After adding your Apps Script URL to log.html, commit and push:

```bash
cd /Users/cameroncasperson/developer
git add cam-casperson-website/
git commit -m "Add log page with journal and token tracker"
git push
```

Netlify will auto-deploy within 1-2 minutes.

---

## Part 6: Test on Live Site

1. Go to your live Netlify URL
2. Navigate to `/log.html`
3. Test with password `1524`:
   - [ ] Password `1524` grants access
   - [ ] Wrong password shows "ACCESS DENIED"
   - [ ] New journal entry saves and persists after refresh
   - [ ] Token entry works
   - [ ] Data appears in Google Sheet

---

## Security Summary

| Risk | Mitigation |
|------|------------|
| Password exposure | Server-side verification only, SHA-256 hashed |
| Brute force attacks | Rate limiting: 5 attempts per hour |
| XSS attacks | All input HTML-escaped before storage/display |
| API abuse | Rate limiting on all write operations |

**Password:** `1524` (hashed server-side, never in client code)

---

## Troubleshooting

### "ACCESS DENIED - Connection error"
- Check that your Apps Script URL is correct in log.html
- Verify the script is deployed as a Web App with "Anyone" access

### Entries not saving
- Check Google Sheet has correct sheet names (JournalEntries, TokenUsage)
- Check Apps Script logs for errors (View → Logs in Apps Script editor)

### Rate limited
- Wait 1 hour, or run `clearRateLimits()` function in Apps Script

---

## File Reference

- `log.html` - Main frontend (modify API_URL on line ~1010)
- `log-apps-script.js` - Backend code (copy to Google Apps Script)
- `log-feature-docs/PRD.md` - Original requirements document
- `log-feature-docs/log-design-concept.html` - Design prototype (reference only)

---

## Quick Reference Commands

```bash
# Start local server
cd /Users/cameroncasperson/developer/cam-casperson-website
python3 -m http.server 8000

# Deploy to Netlify
cd /Users/cameroncasperson/developer
git add cam-casperson-website/
git commit -m "Add log page with journal and token tracker"
git push
```

---

*Generated by Claude Code - January 10, 2026*
