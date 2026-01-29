# Intelligent Workflow Automation Platform

A full-stack application for automating workflows using Excel uploads, AI, and n8n.

## Prerequisites
- Node.js (v16+)
- Firebase Project (Authentication & Firestore enabled)
- n8n Instance (Optional, for webhooks)

## Project Structure
- `frontend/`: React + Vite + Tailwind CSS
- `backend/`: Node.js + Express + Firebase Admin

## Setup

### 1. Backend Setup
1.  Navigate to `backend/`:
    ```bash
    cd backend
    npm install
    ```
2.  **Firebase Setup**:
    - Go to Firebase Console -> Project Settings -> Service Accounts.
    - Generate a new private key (`serviceAccountKey.json`).
    - Place `serviceAccountKey.json` inside the `backend/` folder.
3.  **Environment Variables**:
    - Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    - Update `N8N_WEBHOOK_URL` if you have one.
4.  Start the server:
    ```bash
    npm run dev
    ```
    Runs on `http://localhost:5000`.

### 2. Frontend Setup
1.  Navigate to `frontend/`:
    ```bash
    cd frontend
    npm install
    ```
2.  **Firebase Config**:
    - Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    - Update the `.env` file with your Firebase web app keys from Firebase Console:
      - `VITE_FIREBASE_API_KEY`
      - `VITE_FIREBASE_AUTH_DOMAIN`
      - `VITE_FIREBASE_PROJECT_ID`
      - `VITE_FIREBASE_STORAGE_BUCKET`
      - `VITE_FIREBASE_MESSAGING_SENDER_ID`
      - `VITE_FIREBASE_APP_ID`
      - `VITE_FIREBASE_MEASUREMENT_ID`
    - Optionally update `VITE_API_URL` if your backend runs on a different port.
3.  Start the app:
    ```bash
    npm run dev
    ```
    Runs on `http://localhost:5173`.

## Features
- **Google Login**: Secure access.
- **Excel Upload**: Auto-column mapping.
- **Workflow Configuration**: Select type, channels, and tone.
- **Templates**: Manage AI prompts.
- **Logs**: View history.

## Integration
- The backend sends a POST request to the configured n8n Webhook URL with the processed records and message payloads.
