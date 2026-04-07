import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';
import { toast } from 'sonner';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);
    const isDemoRef = useRef(false);

    // Sync user with backend to get role
    const syncUserWithBackend = async (user) => {
        try {
            const token = await user.getIdToken();
            const response = await axios.post(`${API_URL}/api/auth/login`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRole(response.data.user?.role || 'Viewer');
        } catch (error) {
            console.error("Failed to sync user with backend", error);
            setRole('Viewer');
        }
    };

    // Google OAuth Login
    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            await syncUserWithBackend(result.user);
            toast.success('Successfully logged in with Google!');
        } catch (error) {
            console.error("Google Login Failed", error);
            if (error.code === 'auth/popup-closed-by-user') {
                toast.info("Login popup was closed");
            } else if (error.code === 'auth/unauthorized-domain') {
                toast.error("Domain not authorized", { description: "Add this domain to Firebase Auth authorized domains." });
            } else {
                toast.error("Google Login Failed", { description: error.message });
            }
        }
    };

    // Email/Password Login
    const loginWithEmail = async (email, password) => {
        if (!email || !password) {
            toast.error("Please enter email and password");
            return;
        }
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            await syncUserWithBackend(result.user);
            toast.success('Successfully logged in!');
        } catch (error) {
            console.error("Email Login Failed", error);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                toast.error("Invalid credentials", { description: "Email or password is incorrect." });
            } else if (error.code === 'auth/invalid-email') {
                toast.error("Invalid email format");
            } else {
                toast.error("Login failed", { description: error.message });
            }
        }
    };

    // Email/Password Register
    const registerWithEmail = async (email, password) => {
        if (!email || !password) {
            toast.error("Please enter email and password");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await syncUserWithBackend(result.user);
            toast.success('Account created successfully!');
        } catch (error) {
            console.error("Registration Failed", error);
            if (error.code === 'auth/email-already-in-use') {
                toast.error("Email already in use", { description: "Try logging in instead." });
            } else {
                toast.error("Registration failed", { description: error.message });
            }
        }
    };

    // Demo Login (requires demo password)
    const demoLogin = (password) => {
        if (password !== 'demo1234') {
            toast.error("Invalid demo password", { description: "Use 'demo1234' to access demo mode." });
            return;
        }
        const mockUser = {
            uid: 'demo-123',
            email: 'demo@autoflow.app',
            displayName: 'Demo User',
            photoURL: null,
            getIdToken: async () => 'demo-token-valid-2024'
        };
        isDemoRef.current = true;
        setCurrentUser(mockUser);
        setRole('Admin');
        toast.success("Welcome to Demo Mode!", { description: "Explore all features with sample data." });
    };

    const logout = async () => {
        try {
            if (!isDemoRef.current) {
                await signOut(auth);
            }
        } catch (e) {
            // ignore if not logged in via firebase
        }
        isDemoRef.current = false;
        setCurrentUser(null);
        setRole(null);
        toast.info("Signed out");
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                await syncUserWithBackend(user);
            } else if (!isDemoRef.current) {
                setCurrentUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []); // Remove currentUser from deps to prevent infinite loop

    const value = {
        currentUser,
        role,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        demoLogin,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
