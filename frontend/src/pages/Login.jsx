import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CloudCog } from 'lucide-react';

export default function Login() {
    const { login, demoLogin, currentUser } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex overflow-hidden min-h-[600px]">
                
                {/* Left Side - Login Form */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-slate-800 mb-8 select-none">
                        Sign In to Manage Your Workflow
                    </h2>
                    
                    <form className="space-y-4 mb-6" onSubmit={(e) => { e.preventDefault(); demoLogin(); }}>
                        <div>
                            <input 
                                type="email" 
                                placeholder="Enter Email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <input 
                                type="password" 
                                placeholder="Enter Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                        <button 
                            type="button"
                            onClick={demoLogin}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors shadow-sm mt-2"
                        >
                            Sign In
                        </button>
                    </form>
                    
                    <button
                        onClick={login}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-lg transition-colors shadow-sm mb-4"
                    >
                        Sign in with Google
                    </button>
                    
                    <button
                        onClick={demoLogin}
                        className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition-colors shadow-sm"
                    >
                        Demo Login
                    </button>
                </div>

                {/* Right Side - Illustration / Branding */}
                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 p-12 flex-col justify-center relative overflow-hidden">
                    {/* Abstract decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full translate-y-1/3 -translate-x-1/4"></div>
                    
                    <div className="relative z-10 w-full mb-12">
                        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl flex flex-col items-center border border-white/20">
                            <CloudCog size={64} className="text-blue-500 mb-6 drop-shadow-md" />
                            <h3 className="text-2xl font-bold text-slate-800 text-center leading-tight">
                                Intelligent <br/>
                                Workflow <br/>
                                Automation
                            </h3>
                        </div>
                    </div>

                    <div className="relative z-10 text-center mt-auto">
                        <h3 className="text-2xl font-bold text-white mb-3">Workflow Automation Platform</h3>
                        <p className="text-blue-100 text-sm leading-relaxed max-w-sm mx-auto">
                            Create workflows, automate tasks and explore your data.
                        </p>
                    </div>
                </div>
                
            </div>
        </div>
    );
}
