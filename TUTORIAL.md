# Workflow Automation App - specific Step-by-Step Tutorial

This guide covers how to build, setup, and run the Workflow Automation App from scratch.

## 📺 Phase 1: Concept & Architecture
**Goal**: Build a system that reads Excel files, generates personalized emails/messages using AI (Gemini), and sends them via Email/WhatsApp.

**Tech Stack**:
- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Firebase Firestore (for logs/history)
- **AI**: Google Gemini API
- **Services**: Nodemailer (Email), Multer (File Upload), XLSX (Excel Parsing)

---

## 🛠️ Phase 2: Project Setup

### 1. Initialize Project
Create the folder structure:
```bash
mkdir workflow-app
cd workflow-app
mkdir backend frontend
```

### 2. Backend Setup
1.  Navigate to `backend`: `cd backend`
2.  Initialize Node: `npm init -y`
3.  Install dependencies:
    ```bash
    npm install express cors dotenv multer xlsx @google/generative-ai firebase-admin nodemailer nodemon
    ```
4.  Create `server.js` (Main entry point).

### 3. Frontend Setup
1.  Navigate to root: `cd ..`
2.  Create Vite app: `npm create vite@latest frontend -- --template react`
3.  Install dependencies:
    ```bash
    cd frontend
    npm install axios react-router-dom firebase tailwindcss postcss autoprefixer lucide-react sonner
    ```
4.  Setup Tailwind: `npx tailwindcss init -p`

---

## 💻 Phase 3: key Implementation Steps

### Step 1: Excel Upload & Parsing
**Backend**:
- Use `multer` to handle file uploads to a `/uploads` directory.
- Use `xlsx` to read the uploaded file and convert the first sheet to JSON.
- **Endpoint**: `POST /api/upload`

### Step 2: AI Message Generation
**Backend (`services/aiService.js`)**:
- Configure Google Gemini API.
- Create a prompt that accepts: `Name`, `Workflow Type` (e.g., Fees, Hiring), `Balance`.
- **Critical Rule**: Instruct AI to output **JSON only** (`{ "subject": "...", "body": "..." }`).
- **Error Handling**: If AI fails or returns invalid JSON, throw an error (do NOT use hardcoded templates).

### Step 3: Workflow Execution Engine
**Backend (`routes/workflowRoutes.js`)**:
- **Loop** through each row of the uploaded Excel data.
- Call **AI Service** for every row to generate unique content.
- If AI generation succeeds:
    - Send Email via `nodemailer`.
    - Log success to Firebase.
- If AI generation fails:
    - Log error ("AI Generation Failed").
    - Skip sending email.

### Step 4: Frontend UI
**Pages**:
- **Upload**: specific Drag & drop zone for Excel files.
- **Mapping**: Map Excel columns (e.g., "Name", "Email") to system fields.
- **Preview**: Show AI-generated samples before sending.
- **Dashboard**: View past runs and logs.

---

## 🔑 Phase 4: API & Environment Setup

### 1. Google Gemini API
1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Create a new API Key.
3.  Save it.

### 2. Firebase Setup (Optional for Logging)
1.  Go to [Firebase Console](https://console.firebase.google.com/).
2.  Create a project -> Project Settings -> Service Accounts.
3.  Generate new private key (`serviceAccountKey.json`).
4.  Place this file in `backend/`.

### 3. Environment Variables (.env)
Create `backend/.env`:
```env
PORT=5000
# AI
GEMINI_API_KEY=your_gemini_key_here

# Firebase
FIREBASE_SERVICE_ACCOUNT_KEY=./serviceAccountKey.json

# Email (Gmail Example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## 🚀 Phase 5: How to Run & Use

### 1. Start Support Servers
**Backend**:
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

**Frontend**:
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

### 2. User Flow (Demo)
1.  **Open Browser**: Go to `http://localhost:5173`.
2.  **Upload Data**: Drag `test_data.xlsx` (must have Name, Email columns).
3.  **Map Columns**: Select which column is "Name", "Email", "Balance".
4.  **Configure**:
    - Select "Fee Reminder" or "Event Invite".
    - Choose Tone: "Friendly" or "Formal".
5.  **Run**: Click "Run Workflow".
    - Watch the logs as AI generates unique emails for each row.
    - Emails are sent automatically.

---

**End of Tutorial**
