# Vercel Deployment Debugging Checklist

## Issue
Workflows work on localhost but fail to send emails on Vercel deployment.

## Root Cause
CORS (Cross-Origin Resource Sharing) was blocking requests from Vercel frontend to Render backend.

---

## ✅ Fixes Applied

### 1. CORS Configuration
**File:** `backend/server.js`

Updated CORS to explicitly allow Vercel domain:
```javascript
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://work-flow-automation-app.vercel.app'  // ← Added this
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

**Status:** ✅ Committed and pushed to GitHub

---

## 🔄 Automatic Deployment

Render will automatically redeploy the backend when it detects the GitHub push.

**To verify:**
1. Go to: https://dashboard.render.com
2. Select: `work-flow-automation-app` service
3. Check the "Events" tab to see deployment progress
4. Wait for "Deploy succeeded" message (~2-3 minutes)

---

## 🧪 Testing Steps

### Step 1: Wait for Render Deployment
- Go to Render dashboard
- Wait for "Deploy succeeded" message
- Backend should restart automatically

### Step 2: Verify Backend is Running
- Visit: https://work-flow-automation-app.onrender.com
- Should see: "Intelligent Workflow Automation Platform API is Running"

### Step 3: Test on Vercel
1. Go to: https://work-flow-automation-app.vercel.app
2. Log in with Google
3. Upload Data → Choose Excel file
4. Map columns
5. Configure Workflow
   - Select workflow type
   - Enable "Email" channel
   - Click "Run Workflow"

### Step 4: Check Browser Console
Before running workflow:
1. Press F12 (open Developer Tools)
2. Go to "Console" tab
3. Look for any red errors when clicking "Run Workflow"

**Expected:** No CORS errors
**If CORS error appears:** Wait 1-2 more minutes for Render to fully deploy

### Step 5: Verify Email Sending
Check the backend logs on Render:
- Go to Render dashboard → Your service → "Logs" tab
- Look for: `[Email] ✓ Sent successfully to...`

---

## 🐛 Troubleshooting

### Issue: Still getting CORS errors
**Solution:** 
1. Verify Render has finished deploying (check Events tab)
2. Hard refresh Vercel page (Ctrl+Shift+R)
3. Try again

### Issue: API URL not found
**Solution:**
1. Check Vercel environment variables
2. Ensure `VITE_API_URL=https://work-flow-automation-app.onrender.com`
3. Redeploy Vercel if variable was just added

### Issue: Authentication fails
**Solution:**
1. Clear browser cache and cookies
2. Log in again
3. Firebase authentication should work independently of CORS

### Issue: Workflow starts but no emails
**Solution:**
1. Check Render backend logs for SMTP errors
2. Verify Gmail App Password is correct in Render environment variables
3. Check Firestore is enabled in Firebase Console

---

## 📋 Verification Checklist

- [ ] Render shows "Deploy succeeded"
- [ ] Backend health check returns success
- [ ] Vercel frontend loads without errors
- [ ] Can log in with Google
- [ ] Can upload Excel file
- [ ] Can configure workflow
- [ ] Workflow starts without CORS errors
- [ ] Emails send successfully (check Render logs)
- [ ] Logs page shows real data (not demo data)

---

**Expected Time:** 5-10 minutes for full verification after Render redeploys
