# Deployment Guide

This is a **Full-Stack Application** with a React frontend and Node.js backend. We use free hosting services:

1. **Render** - Backend (Node.js/Express)
2. **Vercel** - Frontend (React/Vite)

**Live URLs:**
- **Frontend:** https://work-flow-automation-app.vercel.app
- **Backend:** https://work-flow-automation-app.onrender.com

---

## Part 1: Deploy Backend on Render

Render offers a free tier for Node.js web services.

### Steps:

1. **Sign Up**: Go to [render.com](https://render.com) and sign up with GitHub
2. **New Web Service**: Click "New +" → "Web Service"
3. **Connect Repository**: Select `Work-Flow-Automation-App`
4. **Configuration**:
   - **Name:** `work-flow-automation-app`
   - **Root Directory:** `backend` ⚠️ **IMPORTANT!**
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free

5. **Environment Variables** - Add these in the Render dashboard:

   ```
   FIREBASE_SERVICE_ACCOUNT_KEY
   ```
   Value: Paste the entire JSON content from your `serviceAccountKey.json` file
   
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM="AutoFlow" <your-email@gmail.com>
   ```

   > **Note:** For Gmail, you need to create an App Password at https://myaccount.google.com/apppasswords

6. **Deploy**: Click "Create Web Service"
7. **Copy URL**: Once deployed, you'll get a URL like `https://work-flow-automation-app.onrender.com`

---

## Part 2: Deploy Frontend on Vercel

Vercel is optimized for React/Vite applications.

### Steps:

1. **Sign Up**: Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. **Add New Project**: Click "Add New..." → "Project"
3. **Import Repository**: Select `Work-Flow-Automation-App`
4. **Configuration**:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` ⚠️ **IMPORTANT!**
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)

5. **Environment Variables** - Add ALL of these in Vercel Settings → Environment Variables:

   Select **Production, Preview, and Development** for each variable:

   ```
   VITE_FIREBASE_API_KEY=AIzaSyA1j64YYWHcTdzS33BilBXfVXV2wAhZA-o
   VITE_FIREBASE_AUTH_DOMAIN=workflowautomation-b9184.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=workflowautomation-b9184
   VITE_FIREBASE_STORAGE_BUCKET=workflowautomation-b9184.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=372956166632
   VITE_FIREBASE_APP_ID=1:372956166632:web:cb7ec36f81772227df8c5d
   VITE_FIREBASE_MEASUREMENT_ID=G-1LK276P42C
   VITE_API_URL=https://work-flow-automation-app.onrender.com
   ```

   > **Critical:** The `VITE_API_URL` must point to your Render backend URL

6. **Deploy**: Click "Deploy"

---

## Part 3: Firebase Console Setup

Before the application can work, ensure Firestore is enabled:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `workflowautomation-b9184`
3. Navigate to **Firestore Database**
4. If not created, click **Create Database**
5. Choose **Production mode** or **Test mode** (for development)
6. Select your region
7. Click **Enable**

---

## Verification

After deployment:

1. **Backend Health Check:**
   - Visit: `https://work-flow-automation-app.onrender.com`
   - Should see: "Intelligent Workflow Automation Platform API is Running"

2. **Frontend:**
   - Visit: `https://work-flow-automation-app.vercel.app`
   - Should see the login page

3. **Test Authentication:**
   - Try logging in with Google
   - Should redirect to Dashboard

---

## Troubleshooting

### Vercel shows blank page
- **Cause:** Missing environment variables
- **Fix:** Ensure all 8 `VITE_*` variables are added in Vercel Settings
- **Redeploy:** Go to Deployments tab → Redeploy latest

### Backend 500 errors
- **Cause:** Firestore not enabled or invalid service account
- **Fix:** Check Firestore is enabled in Firebase Console
- **Check logs:** View Render logs for specific error messages

### Emails not sending
- **Cause:** Invalid Gmail App Password
- **Fix:** Create new App Password at https://myaccount.google.com/apppasswords
- **Note:** 2-Step Verification must be enabled on your Google Account

### Logs page shows demo data
- **Cause:** Firestore API not enabled
- **Fix:** Enable Firestore API at the link shown in backend console logs
- **Restart:** Redeploy backend after enabling Firestore

---

## Auto-Deployment

Both Render and Vercel support automatic deployments:
- Push to `main` branch → Both services redeploy automatically
- No manual intervention needed for code updates
