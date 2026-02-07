# How to Redeploy on Vercel

## Why You Need to Redeploy

Your environment variables (VITE_API_URL, Firebase configs) were added **AFTER** the last deployment was built. The current live version was built **before** these variables existed, so it's trying to connect to `localhost:5000` instead of your Render backend.

---

## Redeploy Instructions

### Method 1: From Deployment Overview Page

1. On the deployment overview page (where you are now)
2. Look at the **top right corner**
3. Find the **"Redeploy"** button
4. Click it

### Method 2: From Deployments List

1. Click **"Deployments"** in the left sidebar
2. Find the deployment marked **"Current"** (top of the list)
3. Click the **3-dot menu (•••)** on the right side
4. Select **"Redeploy"**
5. Click **"Redeploy"** again to confirm

---

## What Happens Next

1. **Build starts** - Vercel rebuilds your app (~1-2 minutes)
2. **Environment variables included** - This build will have VITE_API_URL
3. **Deployment completes** - New version goes live
4. **Test workflow** - Try running a workflow again

---

## After Redeployment

1. Go to: https://work-flow-automation-app.vercel.app
2. Hard refresh: **Ctrl + Shift + R** (to clear cache)
3. Log in with Google
4. Upload Data → Configure Workflow → Run Workflow
5. **Emails should send successfully!** ✅

---

## Verify It Worked

Open browser console (F12) and type:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

**Should show:** `https://work-flow-automation-app.onrender.com`

**If still undefined:** Wait another minute for deployment to fully complete, then hard refresh again.
