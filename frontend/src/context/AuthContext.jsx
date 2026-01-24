import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';
import { toast } from 'sonner';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null); // 'Admin', 'Viewer'

    const login = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            // After login, sync with backend to get role
            try {
                const token = await result.user.getIdToken();
                const response = await axios.post('http://localhost:5000/api/auth/login', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRole(response.data.user.role);
                toast.success('Successfully logged in!');
            } catch (error) {
                console.error("Failed to sync user", error);
            }
        } catch (error) {
            console.error("Firebase Login Failed", error);
            toast.error("Google Login Failed", { description: "You need to configure Firebase keys in src/firebase.js" });
        }
    };

    const demoLogin = () => {
        const mockUser = {
            uid: 'demo-123',
            email: 'demo@example.com',
            displayName: 'Demo User',
            photoURL: 'https://via.placeholder.com/150',
            getIdToken: async () => 'mock-token-123'
        };
        setCurrentUser(mockUser);
        setRole('Admin');
        toast.success("Welcome, Demo User!");
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (e) {
            // ignore if not logged in via firebase
        }
        setCurrentUser(null);
        setRole(null);
        toast.info("Signed out");
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                try {
                    const token = await user.getIdToken();
                } catch (e) {
                    console.error(e);
                }
            }
            // Don't clear if it's our mock user
            if (!user && currentUser?.uid !== 'demo-123') {
                setCurrentUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    const value = {
        currentUser,
        role,
        login,
        demoLogin,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
