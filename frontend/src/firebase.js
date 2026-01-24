import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics"; // Optional

const firebaseConfig = {
    apiKey: "AIzaSyA1j64YYWHcTdzS33BilBXfVXV2wAhZA-o",
    authDomain: "workflowautomation-b9184.firebaseapp.com",
    projectId: "workflowautomation-b9184",
    storageBucket: "workflowautomation-b9184.firebasestorage.app",
    messagingSenderId: "372956166632",
    appId: "1:372956166632:web:cb7ec36f81772227df8c5d",
    measurementId: "G-1LK276P42C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
