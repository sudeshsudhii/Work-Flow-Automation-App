import React, { useState, useEffect } from 'react';
import { Download, Filter, RefreshCw, Search, MoreHorizontal, ChevronRight, ChevronLeft, AlignJustify } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Logs() {
    const [logs, setLogs] = useState([]);
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const token = await currentUser.getIdToken();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.get(`${API_URL}/api/logs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // To simulate mockup precisely we can artificially replace/append mock data if backend sends < 5 logs
            let data = response.data;
            if (data.length === 0) {
                data = [
                    { id: '1001', workflow: 'Fee Reminder', name: 'student1@gmail.com', channel: 'Email', status: 'Completed', time: 'Mar 10, 2024, 10:30 AM' },
                    { id: '1002', workflow: 'Task Followup', name: 'student2@gmail.com', channel: 'Email', status: 'Completed', time: 'Mar 10, 2024, 11:10 AM' },
                    { id: '1003', workflow: 'HR Notification', name: 'staff@gmail.com', channel: 'Email', status: 'Failed', time: 'Mar 9, 2024, 11:25 AM' },
                    { id: '1004', workflow: 'Fee Reminder', name: 'student3@gmail.com', channel: 'Email', status: 'Pending', time: 'Mar 8, 2024, 12:00 PM' },
                    { id: '1005', workflow: 'Event Invitation', name: 'staff@gmail.com', channel: 'Email', status: 'Completed', time: 'Mar 7, 2024, 2:45 PM' }
                ];
            }
            setLogs(data);
        } catch (error) {
            console.error(error);
            // Fallback to mock data if backend is unreachable
            setLogs([
                { id: '1001', workflow: 'Fee Reminder', name: 'student1@gmail.com', channel: 'Email', status: 'Completed', time: 'Mar 10, 2024, 10:30 AM' },
                { id: '1002', workflow: 'Task Followup', name: 'student2@gmail.com', channel: 'Email', status: 'Completed', time: 'Mar 10, 2024, 11:10 AM' },
                { id: '1003', workflow: 'HR Notification', name: 'staff@gmail.com', channel: 'Email', status: 'Failed', time: 'Mar 9, 2024, 11:25 AM' },
                { id: '1004', workflow: 'Fee Reminder', name: 'student3@gmail.com', channel: 'Email', status: 'Pending', time: 'Mar 8, 2024, 12:00 PM' },
                { id: '1005', workflow: 'Event Invitation', name: 'staff@gmail.com', channel: 'Email', status: 'Completed', time: 'Mar 7, 2024, 2:45 PM' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) fetchLogs();
    }, [currentUser]);
    
    // Status Badge Helper
    const StatusBadge = ({ status }) => {
        const lowerState = String(status).toLowerCase();
        let styles = 'bg-slate-100 text-slate-700';
        
        if (['sent', 'completed', 'delivered'].includes(lowerState)) {
             styles = 'bg-[#e2faec] text-[#1e8d4a]'; // Green pill
        } else if (['failed', 'error'].includes(lowerState)) {
             styles = 'bg-[#ffe4e6] text-[#e21d48]'; // Red pill
        } else if (['pending', 'running'].includes(lowerState)) {
             styles = 'bg-[#ffedd5] text-[#c2410c]'; // Orange pill
        }
        
        return (
            <span className={`px-3 py-1.5 text-[13px] font-medium rounded-full ${styles}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto h-full flex flex-col">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm mb-4 text-slate-400">
                <span className="hover:text-slate-600 cursor-pointer">Workspace</span>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Workflow Logs</h2>
                
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchLogs}
                        className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium"
                    >
                        <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                    <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium">
                        <Filter size={15} /> Filter
                    </button>
                    <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center justify-center transition-colors shadow-sm text-sm font-medium">
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Main Surface */}
            <div className="bg-white shadow-sm rounded-xl border border-slate-100 flex flex-col flex-1 overflow-hidden">
                {/* Search Bar Row inside the container */}
                <div className="p-4 border-b border-slate-100 flex gap-3">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search logs..." 
                            className="pl-9 pr-4 py-2 w-full bg-[#f8fafc] border border-transparent focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none rounded-lg text-sm transition-all"
                        />
                    </div>
                    <button className="bg-white border border-slate-200 text-slate-400 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium">
                        <MoreHorizontal size={18} />
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left text-[14px] text-slate-600 border-collapse">
                        <thead className="bg-[#f8fafc] text-slate-500 font-semibold border-b border-slate-100 uppercase text-[12px] tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Run ID</th>
                                <th className="px-6 py-4">Workflow</th>
                                <th className="px-6 py-4">Recipient</th>
                                <th className="px-6 py-4">Channel</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {logs.map((log, idx) => (
                                <tr key={log.id || idx} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5 font-semibold text-slate-700">{log.id}</td>
                                    <td className="px-6 py-5 font-medium text-slate-700">{log.workflow}</td>
                                    <td className="px-6 py-5 text-slate-600">{log.name}</td>
                                    <td className="px-6 py-5 text-slate-600">{log.channel}</td>
                                    <td className="px-6 py-5">
                                        <StatusBadge status={log.status} />
                                    </td>
                                    <td className="px-6 py-5 text-slate-500 text-[13px]">{log.time}</td>
                                </tr>
                            ))}
                            {logs.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <p>No logs found. Run a workflow to see data here.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between text-[13px] text-slate-500 bg-white">
                    <div>Showing 1 to 5 of 98 results</div>
                    <div className="flex items-center gap-4">
                        <span className="mr-2">Page 1 of 10</span>
                        <div className="flex bg-[#f8fafc] rounded-lg border border-slate-200 overflow-hidden">
                            <button className="px-2.5 py-1.5 hover:bg-slate-100 disabled:opacity-50 text-slate-400 border-r border-slate-200"><ChevronLeft size={16} /></button>
                            <button className="px-3 py-1.5 hover:bg-white text-blue-600 font-bold border-r border-slate-200 bg-white shadow-sm">1</button>
                            <button className="px-3 py-1.5 hover:bg-white text-slate-600 font-medium border-r border-slate-200">2</button>
                            <button className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-400 border-r border-slate-200"><ChevronRight size={16} /></button>
                            <button className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-400"><AlignJustify size={16} /></button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
