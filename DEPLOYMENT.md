# Free Hosting Guide

Since this is a **Full-Stack Application** (React Frontend + Node.js Backend), you cannot host the entire thing on GitHub Pages (which only supports static sites).

However, you can host it for **FREE** using a combination of two services:

1.  **Vercel** (for the Frontend)
2.  **Render** (for the Backend)

---

## Part 1: Deploy Backend (Render)
Render offers a free tier for Node.js web services.

1.  **Sign Up**: Go to [render.com](https://render.com) and sign up with GitHub.
2.  **New Web Service**: Click "New +" -> "Web Service".
3.  **Connect Repo**: Select your `Work-Flow-Automation-App` repository.
4.  **Configuration**:
    -   **Root Directory**: `backend` (Important! Check this setting visually)
    -   **Build Command**: `npm install`
    -   **Start Command**: `node server.js`
    -   **Instance Type**: Free
5.  **Environment Variables**:
    Scroll down to "Environment Variables" and add:
    -   `FIREBASE_SERVICE_ACCOUNT_KEY`: (You will need to paste the *content* of your json file here, or use the Mock mode by skipping this)
    -   `SMTP_HOST`, `SMTP_USER`, etc. (if using email)
6.  **Deploy**: Click "Create Web Service".
7.  **Copy URL**: Once deployed, Render will give you a URL (e.g., `https://wap-backend.onrender.com`). **Copy this URL.**

---

## Part 2: Deploy Frontend (Vercel)
Vercel is optimized for React/Vite apps.

1.  **Sign Up**: Go to [vercel.com](https://vercel.com) and sign up with GitHub.
2.  **Add New Project**: Click "Add New..." -> "Project".
3.  **Import Repo**: Import `Work-Flow-Automation-App`.
4.  **Framework Preset**: Select **Vite**.
5.  **Root Directory**: Click "Edit" and select `frontend`.
6.  **Environment Variables**:
    We need to tell the frontend where the backend lives.
    *Note: We need to update the frontend code slightly to use an Env Var first (see Step 3 below).*
    
    Add variable:
    -   `VITE_API_URL`: Paste your Render Backend URL (e.g., `https://wap-backend.onrender.com`)
7.  **Deploy**: Click "Deploy".

---

## Part 3: Connect Frontend to Backend (Code Update)
Currently, the frontend hardcodes `http://localhost:5000`. We need to make this dynamic.

1.  I have updated `src/context/AuthContext.jsx`, `UploadData.jsx`, `WorkflowConfig.jsx`, and `Logs.jsx` to use `import.meta.env.VITE_API_URL || 'http://localhost:5000'`.
2.  **Push these changes** to GitHub.
3.  Vercel will automatically redeploy with the new code.
