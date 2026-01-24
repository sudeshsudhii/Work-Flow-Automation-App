import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Upload, Settings, FileText, Activity, LogOut } from 'lucide-react';
import { Toaster } from 'sonner';

export default function Layout() {
    const { logout, currentUser } = useAuth();

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Toaster position="top-right" richColors />
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 text-xl font-bold border-b border-slate-700">
                    AutoFlow
                </div>
                <nav className="flex-1 p-4 espacio-y-2">
                    <Link to="/" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/upload" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg">
                        <Upload size={20} /> Upload Data
                    </Link>
                    <Link to="/workflows" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg">
                        <Settings size={20} /> Configuration
                    </Link>
                    <Link to="/templates" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg">
                        <FileText size={20} /> Templates
                    </Link>
                    <Link to="/logs" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg">
                        <Activity size={20} /> Logs
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs">
                            {currentUser?.email?.[0].toUpperCase()}
                        </div>
                        <div className="text-sm truncate w-32">{currentUser?.email}</div>
                    </div>
                    <button onClick={logout} className="flex items-center gap-2 text-red-400 hover:text-red-300 w-full text-sm">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <h2 className="text-gray-700 font-semibold">Workspace</h2>
                </header>
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
