import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Login() {
    const { login, demoLogin, currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Intelligent Workflow Platform</h1>
                <p className="mb-8 text-gray-600">Sign in to manage workflows and explore data.</p>
                <button
                    onClick={login}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 mb-4"
                >
                    Sign in with Google
                </button>
                <button
                    onClick={demoLogin}
                    className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2"
                >
                    Demo Login (No Auth Required)
                </button>
            </div>
        </div>
    );
}
