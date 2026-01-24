# 🔍 Where to find your Keys & URLs

### 1. The Backend URL (on Render.com)
If you can't find the link to your backend to put into Vercel:
- **Step 1**: Go to your **Render Dashboard**.
- **Step 2**: Click on your **Web Service** (e.g., `wap-backend`).
- **Step 3**: Look at the **Top Left** of the page, right under the big title.
- **Visual Marker**: You will see a link in blue text called `https://...onrender.com`.
- **Action**: Right-click it and select **"Copy Link Address"**.

---

### 2. The Environment Variables (on Vercel.com)
If you can't find where to paste the `VITE_API_URL`:
- **Step 1**: Open your Project on **Vercel**.
- **Step 2**: Click the **"Settings"** tab (third tab at the top).
- **Step 3**: Look at the **Left Sidebar**.
- **Visual Marker**: Click on **"Environment Variables"** (usually the 4th item down).
- **Step 4**: You will see two boxes: **Key** and **Value**.
    - **Key**: `VITE_API_URL`
    - **Value**: (Paste the link you copied from Render here).
- **Step 5**: Click **"Add"**.

---

### 3. The Firebase Secret (for Render.com)
If Render is asking for `FIREBASE_SERVICE_ACCOUNT_KEY`:
- **Step 1**: Open your project in VS Code.
- **Step 2**: Open `e:\WAP\backend\serviceAccountKey.json`.
- **Step 3**: Copy **all the text** (everything between `{` and `}`).
- **Step 4**: Go to **Render** -> **Environment Variables**.
- **Step 5**: Click **"Add Environment Variable"**.
    - **Key**: `FIREBASE_SERVICE_ACCOUNT_KEY`
    - **Value**: (Paste the entire JSON text here).
- **Step 6**: Click **"Save Changes"**.
