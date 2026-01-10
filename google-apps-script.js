/**
 * Google Apps Script for Contact Form Submissions
 * WITH RATE LIMITING AND HONEYPOT PROTECTION
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Create a new Google Sheet:
 *    - Go to https://sheets.google.com
 *    - Create a new spreadsheet
 *    - Name it "Contact Form Submissions" (or any name you prefer)
 *    - In Row 1, add these headers: Timestamp | First Name | Last Name | Email | Phone | Comment
 *
 * 2. Open the Script Editor:
 *    - In Google Sheets, go to Extensions > Apps Script
 *    - Delete any existing code in the editor
 *    - Paste this entire script
 *
 * 3. Configure the email address:
 *    - Update the NOTIFICATION_EMAIL variable below to: cameron@caspersons.com
 *
 * 4. Deploy as Web App:
 *    - Click "Deploy" > "New deployment"
 *    - Click the gear icon next to "Select type" and choose "Web app"
 *    - Set "Execute as" to "Me"
 *    - Set "Who has access" to "Anyone"
 *    - Click "Deploy"
 *    - Authorize the app when prompted (click through the security warnings)
 *    - Copy the Web App URL
 *
 * 5. Update your contact.html:
 *    - Find the line: const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
 *    - Replace 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' with your Web App URL
 *
 * 6. Test the form to ensure submissions appear in your sheet and you receive emails
 *
 * SECURITY FEATURES:
 * - Rate limiting: Max 3 submissions per email per hour
 * - Honeypot field: Rejects submissions where hidden field is filled (bots)
 * - HTML escaping: Prevents XSS in email notifications
 */

// ===== CONFIGURATION =====
const NOTIFICATION_EMAIL = 'cameron@caspersons.com';  // Email to receive notifications
const EMAIL_SUBJECT = 'New Contact Form Submission';   // Email subject line

// Rate limiting settings
const RATE_LIMIT_WINDOW_MINUTES = 60;  // Time window for rate limiting
const MAX_SUBMISSIONS_PER_WINDOW = 3;   // Max submissions per email in the window
// =========================

/**
 * Escapes HTML entities to prevent XSS attacks
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
 * Checks if submission is rate limited
 * Uses Script Properties to track submissions
 */
function isRateLimited(email) {
  const props = PropertiesService.getScriptProperties();
  const now = new Date().getTime();
  const windowMs = RATE_LIMIT_WINDOW_MINUTES * 60 * 1000;

  // Get existing submissions for this email
  const key = 'rate_' + email.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const existingData = props.getProperty(key);

  let submissions = [];
  if (existingData) {
    try {
      submissions = JSON.parse(existingData);
      // Filter to only submissions within the time window
      submissions = submissions.filter(timestamp => (now - timestamp) < windowMs);
    } catch (e) {
      submissions = [];
    }
  }

  // Check if over limit
  if (submissions.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    console.log(`Rate limited: ${email} has ${submissions.length} submissions in window`);
    return true;
  }

  // Add this submission and save
  submissions.push(now);
  props.setProperty(key, JSON.stringify(submissions));

  return false;
}

/**
 * Handles GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Contact form handler is active' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handles POST requests from the contact form
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);

    // SECURITY CHECK 1: Honeypot field
    // If the hidden "website" field has any value, it's a bot
    if (data.website && data.website.trim() !== '') {
      console.log('Honeypot triggered - rejecting submission');
      // Return success to not alert the bot, but don't process
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'success', message: 'Form submitted successfully' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // SECURITY CHECK 2: Rate limiting
    if (isRateLimited(data.email)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Too many submissions. Please try again later.'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // SECURITY CHECK 3: Basic validation
    if (!data.email || !data.firstName || !data.comment) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Missing required fields'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Get the active spreadsheet and sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();

    // Format timestamp for readability
    const timestamp = new Date(data.timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Append the data to the sheet (escaped for safety)
    sheet.appendRow([
      timestamp,
      escapeHtml(data.firstName),
      escapeHtml(data.lastName),
      escapeHtml(data.email),
      escapeHtml(data.phone) || 'Not provided',
      escapeHtml(data.comment)
    ]);

    // Send email notification
    sendNotificationEmail(data, timestamp);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Form submitted successfully' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log the error
    console.error('Error processing form submission:', error);

    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Sends an email notification for new form submissions
 */
function sendNotificationEmail(data, timestamp) {
  // Escape all user input for safe HTML display
  const safeFirstName = escapeHtml(data.firstName);
  const safeLastName = escapeHtml(data.lastName);
  const safeEmail = escapeHtml(data.email);
  const safePhone = escapeHtml(data.phone) || 'Not provided';
  const safeComment = escapeHtml(data.comment).replace(/\n/g, '<br>');

  const fullName = `${safeFirstName} ${safeLastName}`;

  // HTML email template (with escaped content)
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1a1715;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: #4a6d5c;
          color: white;
          padding: 24px 32px;
          margin: -20px -20px 24px -20px;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 500;
        }
        .content {
          background: #faf8f5;
          padding: 24px;
          border-radius: 4px;
        }
        .field {
          margin-bottom: 16px;
        }
        .label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #7a7572;
          margin-bottom: 4px;
        }
        .value {
          font-size: 16px;
          color: #1a1715;
        }
        .message-box {
          background: white;
          border-left: 3px solid #4a6d5c;
          padding: 16px;
          margin-top: 8px;
        }
        .footer {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e0dcd6;
          font-size: 13px;
          color: #7a7572;
        }
        .reply-btn {
          display: inline-block;
          background: #4a6d5c;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          margin-top: 16px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>New Contact Form Submission</h1>
      </div>

      <div class="content">
        <div class="field">
          <div class="label">Name</div>
          <div class="value">${fullName}</div>
        </div>

        <div class="field">
          <div class="label">Email</div>
          <div class="value"><a href="mailto:${safeEmail}">${safeEmail}</a></div>
        </div>

        <div class="field">
          <div class="label">Phone</div>
          <div class="value">${safePhone}</div>
        </div>

        <div class="field">
          <div class="label">Message</div>
          <div class="message-box">${safeComment}</div>
        </div>

        <a href="mailto:${safeEmail}?subject=Re: Your inquiry" class="reply-btn">Reply to ${safeFirstName}</a>
      </div>

      <div class="footer">
        Submitted on ${timestamp}
      </div>
    </body>
    </html>
  `;

  // Plain text version
  const plainBody = `
New Contact Form Submission

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}

Message:
${data.comment}

---
Submitted on ${timestamp}
  `;

  // Send the email
  GmailApp.sendEmail(
    NOTIFICATION_EMAIL,
    `${EMAIL_SUBJECT} from ${data.firstName} ${data.lastName}`,
    plainBody,
    {
      htmlBody: htmlBody,
      replyTo: data.email,
      name: 'Website Contact Form'
    }
  );
}

/**
 * Test function - Run this to verify your setup
 * Go to Run > testSubmission to test
 */
function testSubmission() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+1 (555) 123-4567',
        comment: 'This is a test submission to verify the form is working correctly.',
        website: '',  // Honeypot field - should be empty
        timestamp: new Date().toISOString()
      })
    }
  };

  const result = doPost(testData);
  console.log(result.getContent());
}

/**
 * Clear rate limiting data (run manually if needed)
 */
function clearRateLimits() {
  const props = PropertiesService.getScriptProperties();
  const allProps = props.getProperties();

  for (const key in allProps) {
    if (key.startsWith('rate_')) {
      props.deleteProperty(key);
    }
  }

  console.log('Rate limiting data cleared');
}
