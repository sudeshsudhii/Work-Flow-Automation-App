import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Mail, MessageCircle, Send, Check, MoreVertical, RefreshCw, Filter, Download, MessageSquare, Bell, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function WorkflowConfig() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // Support rendering even without explicit state for layout demonstration
    const distinctId = state?.distinctId || 'demo-id';
    const mapping = state?.mapping || {};

    const [config, setConfig] = useState({
        workflowType: 'Fee Reminder',
        channels: 'Email',
        tone: 'Formal',
        smartAI: true
    });

    const [loading, setLoading] = useState(false);

    const handleRun = async () => {
        if (distinctId === 'demo-id') {
            toast.error('No Data Uploaded', { description: 'Please process a file in Upload Data first.'});
            // Don't actually run, just show UI validation
            return;
        }

        setLoading(true);
        try {
            const token = await currentUser.getIdToken();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            
            // Map single channel string to object
            const channelsObj = { email: config.channels === 'Email', whatsapp: config.channels === 'WhatsApp' };

            await axios.post(`${API_URL}/api/run-workflow`, {
                workflowType: config.workflowType,
                channels: channelsObj,
                tone: config.tone,
                smartRulesEnabled: config.smartAI,
                distinctId,
                mapping
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Workflow Started Successfully!', { description: 'Check the logs for progress.' });
            navigate('/logs');
        } catch (error) {
            console.error("Workflow failed to start:", error);
            toast.error('Workflow Execution Failed');
        } finally {
            setLoading(false);
        }
    };

    const tabs = ['Dashboard', 'Upload Data', 'Configuration', 'Templates', 'Logs'];

    return (
        <div className="w-full max-w-7xl mx-auto h-full flex flex-col pt-2">
            
            {/* Inner Dashboard Tabs */}
            <div className="flex items-center gap-2 mb-8 border-b border-slate-200">
                {tabs.map((tab) => (
                    <button 
                        key={tab}
                        className={`px-5 py-3 text-[14px] font-semibold transition-colors relative ${
                            tab === 'Configuration' 
                            ? 'text-blue-600' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        {tab}
                        {tab === 'Configuration' && (
                            <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-blue-600 rounded-t-md"></div>
                        )}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column - Main Config */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Workflow Configuration Card */}
                    <div className="bg-white rounded-[14px] shadow-sm border border-slate-100 p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Workflow Configuration</h2>
                            <p className="text-[13px] text-slate-500 mt-1">Adjust settings for your workflows and automation rules.</p>
                        </div>

                        <div className="bg-[#f8fafc] rounded-xl border border-slate-100 p-6">
                            <h3 className="font-semibold text-slate-800 mb-4">Workflow Settings</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Workflow Type</label>
                                    <select 
                                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-700 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        value={config.workflowType}
                                        onChange={e => setConfig({...config, workflowType: e.target.value})}
                                    >
                                        <option>Fee Reminder</option>
                                        <option>Task Followup</option>
                                        <option>HR Notification</option>
                                        <option>Event Invitation</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <select 
                                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-700 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        value={config.tone}
                                        onChange={e => setConfig({...config, tone: e.target.value})}
                                    >
                                        <option>Formal</option>
                                        <option>Friendly</option>
                                        <option>Urgent</option>
                                    </select>
                                </div>
                            </div>

                            <div className="w-1/2 pr-2 mb-6 text-left">
                                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Send Channel</label>
                                <select 
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-700 focus:ring-blue-500 focus:border-blue-500 outline-none inline-block max-w-[50%]"
                                    value={config.channels}
                                    onChange={e => setConfig({...config, channels: e.target.value})}
                                >
                                    <option>Email</option>
                                    <option>WhatsApp</option>
                                </select>
                            </div>

                            <button 
                                onClick={handleRun}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm mx-auto block w-64 mt-8"
                            >
                                {loading ? 'Running...' : 'Save Configuration'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[14px] shadow-sm border border-slate-100 p-6 h-full flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-lg font-bold text-slate-800">Configuration Summary</h2>
                            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors object-right">
                                <Check size={14} /> Confirm
                            </button>
                        </div>

                        <div className="space-y-3 flex-1">
                            {/* Summary Item 1 */}
                            <div className="p-4 bg-[#f8fafc] border border-slate-100 rounded-xl relative group">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                                        <Mail size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">Fee Reminder</h4>
                                        <p className="text-[13px] text-slate-500 mt-0.5 leading-snug pr-4">Hunt down outstanding student payments with clear reminders.</p>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 text-slate-400 group-hover:text-slate-600 cursor-pointer">
                                    <ChevronRight size={16} className="text-slate-300"/>
                                </div>
                            </div>

                            {/* Summary Item 2 */}
                            <div className="p-4 bg-[#f8fafc] border border-slate-100 rounded-xl relative group">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                                        <MessageCircle size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">Formal Tone</h4>
                                        <p className="text-[13px] text-slate-500 mt-0.5 leading-snug pr-4">Messages are set to a formal and professional tone.</p>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 text-slate-400 group-hover:text-slate-600 cursor-pointer">
                                    <ChevronRight size={16} className="text-slate-300"/>
                                </div>
                            </div>

                            {/* Summary Item 3 */}
                            <div className="p-4 bg-[#f8fafc] border border-slate-100 rounded-xl relative group">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                                        <MessageSquare size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">HR Notification</h4>
                                        <p className="text-[13px] text-slate-500 mt-0.5 leading-snug pr-4">Messages are sent to recipients via email platform.</p>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 text-slate-400 group-hover:text-slate-600 cursor-pointer">
                                    <ChevronRight size={16} className="text-slate-300"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row - Logs & Saved Templates */}
                
                {/* System Logs Miniature */}
                <div className="lg:col-span-1 bg-white rounded-[14px] shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-slate-800">System Logs</h2>
                        <button className="text-slate-400 hover:text-slate-600">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {['Upload Data', 'Fee Reminder', 'Task Followup', 'HR Notification'].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#f8fafc] border border-slate-50">
                                <div className="text-blue-500 bg-white p-1.5 rounded-md border border-slate-100 shadow-sm">
                                    <Mail size={16} />
                                </div>
                                <span className="text-[14px] font-medium text-slate-600">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Saved Templates Miniature Table */}
                <div className="lg:col-span-2 bg-white rounded-[14px] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="p-5 flex justify-between items-center border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800">Saved Temp..</h2>
                        
                        <div className="flex items-center gap-2">
                            <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-xs font-medium">
                                <RefreshCw size={13} /> Refresh
                            </button>
                            <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-xs font-medium">
                                <Filter size={13} /> Filter
                            </button>
                            <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-xs font-medium">
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
                                <tr className="hover:bg-slate-50/50">
                                    <td className="px-5 py-4 font-semibold text-slate-700">1001</td>
                                    <td className="px-5 py-4 text-slate-700">Fee Reminder</td>
                                    <td className="px-5 py-4">student1@gma...</td>
                                    <td className="px-5 py-4">Email</td>
                                    <td className="px-5 py-4"><span className="bg-[#e2faec] text-[#1e8d4a] px-2.5 py-1 rounded-full text-xs font-bold">Completed</span></td>
                                    <td className="px-5 py-4 text-slate-500">Mar 10, 2024, 10:30</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50">
                                    <td className="px-5 py-4 font-semibold text-slate-700">1002</td>
                                    <td className="px-5 py-4 text-slate-700">Task Followup</td>
                                    <td className="px-5 py-4">student2@gmai...</td>
                                    <td className="px-5 py-4">Email</td>
                                    <td className="px-5 py-4"><span className="bg-[#e2faec] text-[#1e8d4a] px-2.5 py-1 rounded-full text-xs font-bold">Completed</span></td>
                                    <td className="px-5 py-4 text-slate-500">Mar 10, 2024, 11:10</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50">
                                    <td className="px-5 py-4 font-semibold text-slate-700">1003</td>
                                    <td className="px-5 py-4 text-slate-700">HR Notification</td>
                                    <td className="px-5 py-4">staff@gmail...</td>
                                    <td className="px-5 py-4">Email</td>
                                    <td className="px-5 py-4"><span className="bg-[#ffe4e6] text-[#e21d48] px-2.5 py-1 rounded-full text-xs font-bold">Failed</span></td>
                                    <td className="px-5 py-4 text-slate-500">Mar 9, 2024, 11:25</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50">
                                    <td className="px-5 py-4 font-semibold text-slate-700">1004</td>
                                    <td className="px-5 py-4 text-slate-700">Event Reminder</td>
                                    <td className="px-5 py-4">student3@gmail...</td>
                                    <td className="px-5 py-4">Email</td>
                                    <td className="px-5 py-4"><span className="bg-[#ffedd5] text-[#c2410c] px-2.5 py-1 rounded-full text-xs font-bold">Pending</span></td>
                                    <td className="px-5 py-4 text-slate-500">Mar 7, 2024, 11:25</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 border-b-transparent">
                                    <td className="px-5 py-4 font-semibold text-slate-700">1005</td>
                                    <td className="px-5 py-4 text-slate-700">Event Reminder</td>
                                    <td className="px-5 py-4">student3@gmail...</td>
                                    <td className="px-5 py-4">Email</td>
                                    <td className="px-5 py-4"><span className="bg-[#ffedd5] text-[#c2410c] px-2.5 py-1 rounded-full text-xs font-bold">Pending</span></td>
                                    <td className="px-5 py-4 text-slate-500">Mar 7, 2024, 11:25</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
