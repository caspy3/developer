/**
 * Google Apps Script for Log Page Backend
 * Journal Entries + Token Usage Tracking
 *
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Create a Google Sheet named "Log Data"
 * 2. Go to Extensions > Apps Script
 * 3. Delete default code, paste this entire file
 * 4. Run setupPasswordHash() once to initialize password
 * 5. Deploy > New deployment > Web app > Anyone can access
 * 6. Copy the Web App URL for use in log.html
 *
 * SECURITY:
 * - Password hash stored in Script Properties (NOT in code)
 * - SHA-256 hashing for password verification
 * - Rate limiting: 5 writes per hour per action type
 * - All input is sanitized before storage/response
 */

// ===== CONFIGURATION =====
const RATE_LIMIT_WINDOW_MINUTES = 60;
const MAX_WRITES_PER_WINDOW = 5;
// =========================

/**
 * SETUP FUNCTION - Run ONCE to initialize password hash
 *
 * HOW TO RUN:
 * 1. Open your Google Sheet first (this function needs the Sheet UI)
 * 2. Select this function from the dropdown (next to Debug button)
 * 3. Click Run
 * 4. Authorize when prompted
 * 5. Enter your password in the dialog box
 * 6. Check Logs to confirm success
 *
 * SECURITY: Your password is entered via dialog and stored as a SHA-256 hash.
 * The plaintext password is NEVER stored in code or logs.
 */
function setupPasswordHash() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Set Password',
    'Enter the password for your log page (this will be hashed and stored securely):',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) {
    console.log('Password setup cancelled');
    return;
  }

  const password = response.getResponseText().trim();

  if (!password || password.length < 4) {
    ui.alert('Error', 'Password must be at least 4 characters.', ui.ButtonSet.OK);
    console.log('Password setup failed: password too short');
    return;
  }

  const hash = hashPassword(password);
  PropertiesService.getScriptProperties().setProperty('PASSWORD_HASH', hash);

  ui.alert('Success', 'Password hash stored successfully! You can now deploy this script as a Web App.', ui.ButtonSet.OK);
  console.log('Password hash stored successfully');
}

/**
 * Hash password using SHA-256
 */
function hashPassword(password) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password,
    Utilities.Charset.UTF_8
  );
  return digest.map(b => (b < 0 ? b + 256 : b).toString(16).padStart(2, '0')).join('');
}

/**
 * Verify password against stored hash
 */
function verifyPassword(password) {
  const storedHash = PropertiesService.getScriptProperties().getProperty('PASSWORD_HASH');
  if (!storedHash) {
    console.error('No password hash found in Script Properties. Run setupPasswordHash() first.');
    return false;
  }
  const inputHash = hashPassword(password);
  return storedHash === inputHash;
}

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text) {
  if (!text) return '';
  return text
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Rate limiting - tracks writes per action type
 * Returns true if rate limited, false if allowed
 */
function isRateLimited(actionType) {
  const props = PropertiesService.getScriptProperties();
  const now = new Date().getTime();
  const windowMs = RATE_LIMIT_WINDOW_MINUTES * 60 * 1000;

  const key = 'rate_' + actionType;
  const existingData = props.getProperty(key);

  let timestamps = [];
  if (existingData) {
    try {
      timestamps = JSON.parse(existingData);
      // Filter to only timestamps within the window
      timestamps = timestamps.filter(ts => (now - ts) < windowMs);
    } catch (e) {
      timestamps = [];
    }
  }

  if (timestamps.length >= MAX_WRITES_PER_WINDOW) {
    console.log(`Rate limited: ${actionType} has ${timestamps.length} writes in window`);
    return true;
  }

  // Add current timestamp and save
  timestamps.push(now);
  props.setProperty(key, JSON.stringify(timestamps));
  return false;
}

/**
 * Create CORS-enabled JSON response
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle GET requests - public read access (no auth required)
 */
function doGet(e) {
  const action = e.parameter.action;

  try {
    switch (action) {
      case 'getJournalEntries':
        return getJournalEntries();
      case 'getTokenData':
        return getTokenData();
      default:
        return createJsonResponse({
          success: true,
          message: 'Log API is active. Valid actions: getJournalEntries, getTokenData'
        });
    }
  } catch (error) {
    console.error('GET Error:', error);
    return createJsonResponse({ success: false, error: error.toString() });
  }
}

/**
 * Handle POST requests - password protected writes
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    switch (action) {
      case 'verifyPassword':
        return handleVerifyPassword(data);
      case 'addJournalEntry':
        return handleAddJournalEntry(data);
      case 'addTokenEntry':
        return handleAddTokenEntry(data);
      default:
        return createJsonResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    console.error('POST Error:', error);
    return createJsonResponse({ success: false, error: error.toString() });
  }
}

/**
 * Verify password (for frontend auth check)
 */
function handleVerifyPassword(data) {
  if (!data.password) {
    return createJsonResponse({ success: false, error: 'Password required' });
  }

  const isValid = verifyPassword(data.password);
  return createJsonResponse({ success: isValid });
}

/**
 * Get all visible journal entries (newest first)
 */
function getJournalEntries() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('JournalEntries');

  if (!sheet) {
    return createJsonResponse({ success: true, entries: [] });
  }

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    // Only header row exists
    return createJsonResponse({ success: true, entries: [] });
  }

  const entries = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const hidden = row[3] === true || row[3] === 'TRUE' || row[3] === true;

    // Only include non-hidden entries with valid IDs
    if (!hidden && row[0]) {
      entries.push({
        id: escapeHtml(row[0]),
        timestamp: row[1],
        content: escapeHtml(row[2])
      });
    }
  }

  // Sort by timestamp descending (newest first)
  entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return createJsonResponse({ success: true, entries: entries });
}

/**
 * Add new journal entry
 */
function handleAddJournalEntry(data) {
  // Verify password
  if (!verifyPassword(data.password)) {
    return createJsonResponse({ success: false, error: 'Invalid password' });
  }

  // Check rate limit
  if (isRateLimited('journal_write')) {
    return createJsonResponse({
      success: false,
      error: 'Too many submissions. Please wait before trying again.'
    });
  }

  // Validate content
  const content = (data.content || '').trim();
  if (!content) {
    return createJsonResponse({ success: false, error: 'Content is required' });
  }
  if (content.length > 5000) {
    return createJsonResponse({ success: false, error: 'Content too long (max 5000 chars)' });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('JournalEntries');

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet('JournalEntries');
    sheet.appendRow(['id', 'timestamp', 'content', 'hidden']);
  }

  // Generate next ID (LOG-0001, LOG-0002, etc.)
  const lastRow = sheet.getLastRow();
  const nextNum = lastRow > 1 ? lastRow : 1;
  const id = 'LOG-' + String(nextNum).padStart(4, '0');
  const timestamp = new Date().toISOString();

  // Append entry to sheet
  sheet.appendRow([id, timestamp, content, false]);

  const newEntry = {
    id: id,
    timestamp: timestamp,
    content: escapeHtml(content)
  };

  return createJsonResponse({ success: true, entry: newEntry });
}

/**
 * Get token usage data with aggregations
 */
function getTokenData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('TokenUsage');

  if (!sheet) {
    return createJsonResponse({
      success: true,
      total: 0,
      weekly: 0,
      daily: 0,
      history: []
    });
  }

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return createJsonResponse({
      success: true,
      total: 0,
      weekly: 0,
      daily: 0,
      history: []
    });
  }

  const now = new Date();
  const today = formatDateYMD(now);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  let total = 0;
  let weekly = 0;
  let daily = 0;
  const dailyTotals = {};

  // Process all rows (skip header)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const dateVal = row[1];
    const tokens = parseInt(row[2]) || 0;

    // Convert date to string format
    let dateStr;
    if (dateVal instanceof Date) {
      dateStr = formatDateYMD(dateVal);
    } else {
      dateStr = String(dateVal);
    }

    total += tokens;

    // Aggregate by date
    if (!dailyTotals[dateStr]) {
      dailyTotals[dateStr] = 0;
    }
    dailyTotals[dateStr] += tokens;

    // Check if within last 7 days
    const entryDate = new Date(dateStr);
    if (entryDate >= weekAgo) {
      weekly += tokens;
    }

    // Check if today
    if (dateStr === today) {
      daily += tokens;
    }
  }

  // Build last 7 days history for the chart
  const history = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = formatDateYMD(d);
    history.push({
      date: dateStr,
      day: dayNames[d.getDay()],
      tokens: dailyTotals[dateStr] || 0
    });
  }

  return createJsonResponse({
    success: true,
    total: total,
    weekly: weekly,
    daily: daily,
    history: history
  });
}

/**
 * Add token usage entry
 */
function handleAddTokenEntry(data) {
  // Verify password
  if (!verifyPassword(data.password)) {
    return createJsonResponse({ success: false, error: 'Invalid password' });
  }

  // Check rate limit
  if (isRateLimited('token_write')) {
    return createJsonResponse({
      success: false,
      error: 'Too many submissions. Please wait before trying again.'
    });
  }

  // Validate tokens
  const tokens = parseInt(data.tokens);
  if (isNaN(tokens) || tokens < 0) {
    return createJsonResponse({ success: false, error: 'Invalid token count' });
  }

  // Validate date (optional, defaults to today)
  let date = data.date;
  if (!date) {
    date = formatDateYMD(new Date());
  }

  // Sanitize notes
  const notes = escapeHtml((data.notes || '').trim().substring(0, 500));

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('TokenUsage');

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet('TokenUsage');
    sheet.appendRow(['id', 'date', 'tokens', 'notes']);
  }

  // Generate ID
  const id = sheet.getLastRow();

  // Append entry
  sheet.appendRow([id, date, tokens, notes]);

  return createJsonResponse({ success: true });
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDateYMD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ===== UTILITY FUNCTIONS FOR DEVELOPMENT =====

/**
 * Test function - get journal entries
 */
function testGetJournalEntries() {
  const result = getJournalEntries();
  console.log(result.getContent());
}

/**
 * Test function - get token data
 */
function testGetTokenData() {
  const result = getTokenData();
  console.log(result.getContent());
}

/**
 * Clear all rate limits (utility function for testing)
 */
function clearRateLimits() {
  const props = PropertiesService.getScriptProperties();
  const allProps = props.getProperties();

  for (const key in allProps) {
    if (key.startsWith('rate_')) {
      props.deleteProperty(key);
    }
  }
  console.log('Rate limits cleared');
}

/**
 * View current password hash (for debugging)
 */
function viewPasswordHash() {
  const hash = PropertiesService.getScriptProperties().getProperty('PASSWORD_HASH');
  console.log('Current password hash:', hash);
}
