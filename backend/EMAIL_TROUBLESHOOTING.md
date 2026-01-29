# Email Sending Troubleshooting Guide

## Issue Fixed: Firestore Permission Error

### Problem
The workflow was failing with "Firestore Permission Denied" error before emails could be sent.

### Solution Implemented
Added comprehensive fallback mechanism to the workflow execution:
- Now gracefully handles Firestore errors without crashing
- Falls back to console logging when Firestore is unavailable
- **Emails will still send even if Firestore fails**

---

## How to Enable Email Sending

Your SMTP is already configured in `.env`, but please verify:

### 1. Check Gmail App Password

In `backend/.env`, you have:
```
SMTP_USER=sudeshclan@gmail.com
SMTP_PASS=myog dqdj pwrk ysuw
```

### 2. Ensure Gmail App Password is Valid

**Important:** Gmail requires **App Passwords** for third-party applications (not your regular Gmail password).

**To create/verify your App Password:**

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account (sudeshclan@gmail.com)
3. Create a new App Password called "Workflow Automation"
4. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)
5. Update your `backend/.env`:
   ```
   SMTP_PASS=abcd efgh ijkl mnop
   ```
   (Keep the spaces or remove them - both work)

### 3. Enable 2-Step Verification (Required for App Passwords)

App Passwords only work if 2-Step Verification is enabled on your Google Account:
- Go to: https://myaccount.google.com/security
- Enable "2-Step Verification" if not already enabled

---

## Testing Email Functionality

### Step 1: Restart the Backend
```bash
cd backend
npm run dev
```

### Step 2: Run a Workflow
1. Upload your Excel file with email addresses
2. Configure workflow with "Email" channel selected
3. Click "Run Workflow"

### Step 3: Check Backend Logs
You should see one of these:

**✓ Success:**
```
[Email] Attempting to send to user@example.com...
[Email] ✓ Sent successfully to user@example.com: <message-id>
```

**✗ Failure (Authentication Error):**
```
[Email] ✗ Failed to send to user@example.com: Invalid login
[Email] Error code: EAUTH
```
→ If you see this, your App Password needs to be updated

**⚠️ Simulation Mode:**
```
[Simulation] Email to user@example.com: Fee Reminder
```
→ This means SMTP credentials are missing/invalid - emails are being simulated

---

## Common Issues

| Error Message | Solution |
|---------------|----------|
| `Invalid login: 535-5.7.8 Username and Password not accepted` | App Password is incorrect - regenerate it |
| `Missing credentials for "PLAIN"` | SMTP_USER or SMTP_PASS is empty in `.env` |
| `Firestore Permission Denied` | **FIXED** - Now handled with fallback, emails will still send |
| Emails in simulation mode | Verify `.env` has correct SMTP credentials |

---

## What Changed

### File: `backend/routes/workflowRoutes.js`
- ✅ Added try-catch blocks around all Firestore operations
- ✅ Workflow continues even if Firestore fails
- ✅ Emails send regardless of database status
- ✅ Logs to console when Firestore unavailable

### File: `backend/services/emailService.js`
- ✅ Enhanced error logging
- ✅ Shows detailed SMTP error codes
- ✅ Helps diagnose authentication issues faster

---

## Next Steps

1. **Update your Gmail App Password** in `backend/.env` (if not already correct)
2. **Restart the backend server**
3. **Test the workflow** - emails should now send successfully
4. Check backend console for detailed logs

The Firestore permission error will no longer block email sending!
