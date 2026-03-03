# Required Keys and Configuration for Running WAP Application

This document lists all the required API keys, credentials, and configuration needed to run the Workflow Automation Platform (WAP) application on another laptop.

---

## 🔑 Backend Environment Variables

Create a `.env` file in the `backend` folder with the following:

### **1. Server Configuration**
```env
PORT=5000
```

### **2. Firebase Configuration**
```env
FIREBASE_SERVICE_ACCOUNT_KEY=./serviceAccountKey.json
```
> [!IMPORTANT]
> You need the actual `serviceAccountKey.json` file from Firebase Console:
> - Go to [Firebase Console](https://console.firebase.google.com/)
> - Select your project
> - Go to **Project Settings** → **Service Accounts**
> - Click **Generate New Private Key**
> - Download and save as `serviceAccountKey.json` in the `backend` folder

### **3. N8N Webhook Configuration** (Optional)
```env
N8N_WEBHOOK_URL=http://n8n-instance.com/webhook/test
N8N_WEBHOOK_SECRET=your-secret
```

### **4. Email Configuration (Gmail SMTP)**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="WAP System" <your-email@gmail.com>
```
> [!WARNING]
> **Don't use your regular Gmail password!** Create an App Password:
> 1. Go to Google Account → Security
> 2. Enable 2-Step Verification
> 3. Go to **App Passwords**
> 4. Generate a new app password for "Mail"
> 5. Use that 16-character password as `SMTP_PASS`

### **5. AI Configuration (Google Gemini)**
```env
GEMINI_API_KEY=your-gemini-api-key-here
```
> [!IMPORTANT]
> Get your Gemini API key from: [Google AI Studio](https://aistudio.google.com/apikey)

---

## 🌐 Frontend Environment Variables

Create a `.env` file in the `frontend` folder with the following:

### **1. Firebase Configuration**
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```
> [!NOTE]
> Get all Firebase frontend keys from:
> - [Firebase Console](https://console.firebase.google.com/)
> - Select your project
> - Go to **Project Settings** → **General**
> - Under "Your apps" → **Web app** → Click the config icon
> - Copy all the config values

### **2. Backend API URL**
```env
VITE_API_URL=http://localhost:5000
```
> [!TIP]
> If deploying to production, change this to your deployed backend URL

---

## 📋 Complete Checklist for New Laptop Setup

- [ ] **Install Node.js** (v18 or higher recommended)
- [ ] **Clone the repository** to your laptop
- [ ] **Backend Setup:**
  - [ ] Navigate to `backend` folder
  - [ ] Run `npm install`
  - [ ] Create `.env` file with all backend variables
  - [ ] Download `serviceAccountKey.json` from Firebase
  - [ ] Get Gemini API key from Google AI Studio
  - [ ] Set up Gmail App Password
- [ ] **Frontend Setup:**
  - [ ] Navigate to `frontend` folder
  - [ ] Run `npm install`
  - [ ] Create `.env` file with all frontend variables
  - [ ] Get Firebase Web App config values
- [ ] **Test the application:**
  - [ ] Run backend: `npm start` (in backend folder)
  - [ ] Run frontend: `npm run dev` (in frontend folder)
  - [ ] Visit `http://localhost:5173` in browser
  - [ ] Test health check: `http://localhost:5000/api/health`
  - [ ] Test AI: `http://localhost:5000/api/test-ai`

---

## 🔐 Summary of All API Keys Required

| Service | Key/Credential | Where to Get It |
|---------|---------------|-----------------|
| **Firebase** | Service Account JSON | [Firebase Console](https://console.firebase.google.com/) → Project Settings → Service Accounts |
| **Firebase** | Web App Config (7 keys) | [Firebase Console](https://console.firebase.google.com/) → Project Settings → General → Web App |
| **Google Gemini** | API Key | [Google AI Studio](https://aistudio.google.com/apikey) |
| **Gmail SMTP** | App Password | Google Account → Security → App Passwords |
| **N8N** | Webhook URL & Secret | Your N8N instance (Optional) |

---

## 📞 Important Notes

> [!CAUTION]
> **Never commit `.env` files or `serviceAccountKey.json` to Git!** They contain sensitive credentials.

> [!TIP]
> Use the `.env.example` files as templates. They're already in the repo for reference.

---

## 🚀 Quick Start Commands

```bash
# Backend
cd backend
npm install
# Create .env file with all keys
npm start

# Frontend (in a new terminal)
cd frontend
npm install
# Create .env file with all keys
npm run dev
```

Your application should now be running at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
