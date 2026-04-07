import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Upload as UploadIcon, Search, Filter, ChevronRight, ChevronDown,
    Plus, Check, MoreVertical, RefreshCw, Download, Mail, 
    MessageCircle, MessageSquare, CloudUpload, FileSpreadsheet, Paperclip
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';

export default function Dashboard() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [activeTab, setActiveTab] = useState('Dashboard');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const tabs = ['Dashboard', 'Upload Data', 'Configuration', 'Templates', 'Logs'];

    // --- File Upload Logic ---
    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) setFile(selectedFile);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleUploadDataset = async () => {
        if (!file) {
            toast.error('Please select a file first');
            return;
        }
        setUploading(true);
        try {
            const token = await currentUser.getIdToken();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post(`${API_URL}/api/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Dataset uploaded successfully!');
            navigate('/workflows', { state: { distinctId: response.data.distinctId, mapping: response.data.mapping } });
        } catch (error) {
            console.error('Upload failed', error);
            toast.error('Upload failed', { description: error.response?.data?.message || error.message });
        } finally {
            setUploading(false);
        }
    };

    // --- Mock Data ---
    const configLogs = [
        { id: '1001', workflow: 'Fee Reminder', recipient: 'student1@gma...', channel: 'Email', status: 'Completed', time: 'Mar 10, 2024' },
        { id: '1002', workflow: 'Task Followup', recipient: 'student2@gmail...', channel: 'Email', status: 'Completed', time: 'Mar 10, 2024' },
        { id: '1003', workflow: 'HR Notification', recipient: 'staff@gmail...', channel: 'Email', status: 'Failed', time: 'Mar 9, 2024' },
        { id: '1004', workflow: 'Event Invitation', recipient: 'student3@gmail...', channel: 'Email', status: 'Pending', time: 'Mar 7, 2024' },
        { id: '1005', workflow: 'Event Reminder', recipient: 'student3@gmail...', channel: 'Email', status: 'Pending', time: 'Mar 7, 2025' },
    ];

    const uploadDataItems = [
        { label: 'Upload Data', icon: Plus, iconColor: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'workflow_dataset.csv', icon: Mail, iconColor: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Event Invitation Template', icon: Mail, iconColor: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Event Reminder Template', icon: Mail, iconColor: 'text-blue-500', bg: 'bg-blue-50' },
    ];

    const StatusBadge = ({ status }) => {
        const s = String(status).toLowerCase();
        let styles = 'bg-slate-100 text-slate-700';
        if (['completed', 'sent', 'delivered'].includes(s)) styles = 'bg-[#e2faec] text-[#1e8d4a]';
        else if (['failed', 'error'].includes(s)) styles = 'bg-[#ffe4e6] text-[#e21d48]';
        else if (['pending', 'running'].includes(s)) styles = 'bg-[#ffedd5] text-[#c2410c]';
        return <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${styles}`}>{status}</span>;
    };

    return (
        <div className="w-full max-w-7xl mx-auto h-full flex flex-col">

            {/* Top Title */}
            <h1 className="text-[15px] font-semibold text-slate-800 mb-4">Dashboard</h1>

            {/* Inner Tabs */}
            <div className="flex items-center gap-1 mb-8 border-b border-slate-200">
                {tabs.map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-3 text-[14px] font-semibold transition-colors relative ${
                            tab === activeTab 
                            ? 'text-blue-600' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        {tab}
                        {tab === activeTab && (
                            <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-blue-600 rounded-t-md"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Main 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT: Upload Workflow Dataset Card */}
                <div className="lg:col-span-2 bg-white rounded-[14px] shadow-sm border border-slate-100 p-6 flex flex-col">
                    
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-xl font-bold text-slate-800">Upload Workflow Dataset</h2>
                        <div className="flex items-center gap-2">
                            <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium">
                                <Search size={14} /> Browse
                            </button>
                            <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium">
                                <Filter size={14} /> Filter
                            </button>
                            <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium">
                                CSV <ChevronDown size={14} className="opacity-50"/>
                            </button>
                        </div>
                    </div>
                    <p className="text-[13px] text-slate-500 mb-5">Upload files (.netf, .csv, .xcel) and .Qulfy of rsa. Inpe.)</p>

                    {/* Drag & Drop Zone */}
                    <div 
                        className={`border-2 border-dashed rounded-xl p-10 text-center flex flex-col items-center justify-center transition-colors mb-5 ${dragActive ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200 bg-[#f8fafc]'}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center mb-4">
                            <CloudUpload size={28} />
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Drag and drop file here</p>
                    </div>

                    {/* Browse Button */}
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-sm font-semibold transition-colors shadow-sm mx-auto flex items-center gap-2 mb-5"
                    >
                        <Plus size={16} /> Browse
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {/* File Info & Upload Button */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                            <Paperclip size={16} className="text-slate-400" />
                            <span className="text-sm text-slate-600 font-medium">{file ? file.name : 'workflow_dataset.csv'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[12px] text-slate-400">Supported format: CSV / Excel</span>
                            <span className="flex items-center gap-1.5">
                                <FileSpreadsheet size={16} className="text-green-500"/>
                                <FileSpreadsheet size={16} className="text-blue-500"/>
                            </span>
                        </div>
                        <button
                            onClick={handleUploadDataset}
                            disabled={uploading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                        >
                            {uploading ? 'Uploading...' : 'Upload Dataset'}
                        </button>
                    </div>
                </div>

                {/* RIGHT: Configuration Summary */}
                <div className="lg:col-span-1 bg-white rounded-[14px] shadow-sm border border-slate-100 p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-lg font-bold text-slate-800">Configuration</h2>
                        <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors">
                            <Check size={14} /> Confirm
                        </button>
                    </div>

                    <div className="space-y-3 flex-1">
                        {/* Config Item 1 */}
                        <div className="p-4 bg-[#f8fafc] border border-slate-100 rounded-xl relative group cursor-pointer hover:shadow-sm transition-shadow">
                            <div className="flex gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                                    <Mail size={16} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">Fee Reminder</h4>
                                    <p className="text-[13px] text-slate-500 mt-0.5 leading-snug pr-4">Lorem ipsum lhierd-corsstes aruics</p>
                                </div>
                            </div>
                            <div className="absolute top-4 right-4">
                                <ChevronRight size={16} className="text-slate-300"/>
                            </div>
                        </div>

                        {/* Config Item 2 */}
                        <div className="p-4 bg-[#f8fafc] border border-slate-100 rounded-xl relative group cursor-pointer hover:shadow-sm transition-shadow">
                            <div className="flex gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                                    <MessageCircle size={16} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">Task Followup</h4>
                                    <p className="text-[13px] text-slate-500 mt-0.5 leading-snug pr-4">Lorem ipsum bieOan dolor-sit amet.</p>
                                </div>
                            </div>
                            <div className="absolute top-4 right-4">
                                <ChevronRight size={16} className="text-slate-300"/>
                            </div>
                        </div>

                        {/* Config Item 3 */}
                        <div className="p-4 bg-[#f8fafc] border border-slate-100 rounded-xl relative group cursor-pointer hover:shadow-sm transition-shadow">
                            <div className="flex gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                                    <MessageSquare size={16} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">HR Notification</h4>
                                    <p className="text-[13px] text-slate-500 mt-0.5 leading-snug pr-4">Lorem ipsum medgaak vursdlisit due.</p>
                                </div>
                            </div>
                            <div className="absolute top-4 right-4">
                                <ChevronRight size={16} className="text-slate-300"/>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM LEFT: Upload Data Sidebar List */}
                <div className="lg:col-span-1 bg-white rounded-[14px] shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-bold text-slate-800">Upload Data</h2>
                        <button className="text-slate-400 hover:text-slate-600">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {uploadDataItems.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafc] border border-slate-50 hover:shadow-sm transition-shadow cursor-pointer">
                                <div className={`p-2 rounded-lg ${item.bg} ${item.iconColor}`}>
                                    <item.icon size={16} />
                                </div>
                                <span className="text-[14px] font-medium text-slate-700">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BOTTOM RIGHT: Configuration Table */}
                <div className="lg:col-span-2 bg-white rounded-[14px] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="p-5 flex justify-between items-center border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800">Configuration</h2>
                        <div className="flex items-center gap-2">
                            <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-xs font-medium">
                                <RefreshCw size={13} /> Refresh
                            </button>
                            <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-xs font-medium">
                                <Filter size={13} /> Filter
                            </button>
                            <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-xs font-medium">
                                <Download size={13} /> Export CSV
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[13px] text-slate-600">
                            <thead className="bg-[#f8fafc] text-slate-500 font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="px-5 py-3">Run ID</th>
                                    <th className="px-5 py-3">Workflow</th>
                                    <th className="px-5 py-3">Recipient</th>
                                    <th className="px-5 py-3">Channel</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {configLogs.map((log, idx) => (
                                    <tr key={log.id || idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-4 font-semibold text-slate-700">{log.id}</td>
                                        <td className="px-5 py-4 text-slate-700">{log.workflow}</td>
                                        <td className="px-5 py-4">{log.recipient}</td>
                                        <td className="px-5 py-4">{log.channel}</td>
                                        <td className="px-5 py-4"><StatusBadge status={log.status} /></td>
                                        <td className="px-5 py-4 text-slate-500">{log.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
