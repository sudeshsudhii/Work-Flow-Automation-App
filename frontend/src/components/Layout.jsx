import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  UploadCloud,
  Settings,
  FileText,
  Activity,
  LogOut,
  GitMerge,
  BarChart2,
  Search,
  Bell,
  Moon,
  Menu,
  Cpu
} from 'lucide-react';
import { Toaster } from 'sonner';
import LanguageSwitcher from './LanguageSwitcher';

export default function Layout() {
    const { logout, currentUser, role } = useAuth();
    const { t } = useTranslation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const navItems = [
        { name: t('nav_dashboard'), path: '/', icon: LayoutDashboard },
        { name: t('nav_upload'), path: '/upload', icon: UploadCloud },
        { name: t('nav_config'), path: '/workflows', icon: Settings },
        { name: t('nav_templates'), path: '/templates', icon: FileText },
        { name: t('nav_logs'), path: '/logs', icon: Activity },
        { name: t('nav_reports'), path: '/reports', icon: BarChart2 },
        { name: t('nav_ai_monitor'), path: '/ai-monitor', icon: Cpu },
    ];

    return (
        <div className="flex h-screen bg-[#f4f7fe] text-slate-800 font-sans overflow-hidden">
            <Toaster position="top-right" richColors />
            
            {/* Sidebar */}
            <aside className={`bg-[#111827] text-slate-400 flex flex-col transition-all duration-300 z-20 ${isSidebarOpen ? 'w-[260px]' : 'w-20'} flex-shrink-0`}>
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 text-white font-bold text-xl tracking-wide shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mr-3 shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    {isSidebarOpen && <span>{t('app_name')}</span>}
                </div>

                <div className="px-6 py-4">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="h-1 bg-slate-800 rounded-full"></div>
                        <div className="h-1 bg-slate-800 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="h-1 bg-slate-800 rounded-full"></div>
                        <div className="h-1 bg-slate-800 rounded-full"></div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                    <ul className="space-y-1 px-4">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-3 rounded-lg transition-all group font-medium text-sm ${
                                            isActive
                                                ? 'bg-[#1e293b] text-white border-l-2 border-blue-500 rounded-l-none -ml-4 pl-7'
                                                : 'text-slate-400 hover:bg-[#1e293b] hover:text-slate-200'
                                        }`
                                    }
                                >
                                    <item.icon size={18} className="shrink-0" />
                                    {isSidebarOpen && <span className="truncate">{item.name}</span>}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout Button */}
                {isSidebarOpen && (
                    <div className="px-4 pb-2">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 px-3 py-3 rounded-lg w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium text-sm"
                        >
                            <LogOut size={18} className="shrink-0" />
                            <span>{t('sign_out')}</span>
                        </button>
                    </div>
                )}

                {/* User Profile Area */}
                <div className="p-4 mt-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold shrink-0">
                            {currentUser?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        {isSidebarOpen && (
                            <div className="overflow-hidden flex-1">
                                <div className="text-sm font-semibold text-white truncate">{currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}</div>
                                <div className="text-xs text-slate-500">{role || t('viewer')}</div>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                
                {/* Top Nav */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 shrink-0 z-10 w-full">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSidebarOpen(!isSidebarOpen)} 
                            className="p-1.5 -ml-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="text-[15px] font-semibold text-slate-800 hidden sm:block">
                            {t('workspace')}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search Bar */}
                        <div className="hidden md:flex relative items-center">
                            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder={`${t('search')}...`}
                                className="pl-9 pr-4 py-2 w-64 bg-slate-100/80 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none rounded-full text-sm transition-all"
                            />
                        </div>

                        {/* Language Switcher */}
                        <LanguageSwitcher />

                        {/* Icons */}
                        <div className="flex items-center gap-1.5">
                            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                                <Bell size={18} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-[1.5px] border-white rounded-full"></span>
                            </button>
                            
                            {/* Top Nav Avatar */}
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold cursor-pointer shadow-sm">
                                {currentUser?.email?.[0]?.toUpperCase() || 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar relative">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
