import React, { useState } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, Legend
} from 'recharts';
import { Download, Filter, Calendar } from 'lucide-react';

const performanceData = [
    { name: 'Mon', success: 400, failed: 24, pending: 15 },
    { name: 'Tue', success: 300, failed: 13, pending: 22 },
    { name: 'Wed', success: 200, failed: 48, pending: 10 },
    { name: 'Thu', success: 278, failed: 39, pending: 8 },
    { name: 'Fri', success: 189, failed: 48, pending: 12 },
    { name: 'Sat', success: 239, failed: 38, pending: 5 },
    { name: 'Sun', success: 349, failed: 43, pending: 2 },
];

export default function Reports() {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Reports & Analytics</h2>
                    <p className="text-slate-500 text-sm mt-1">Deep dive into your workflow performance metrics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium shadow-sm transition-colors text-sm">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors text-sm">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 text-sm font-medium mb-1">Total Executions</h3>
                    <p className="text-3xl font-bold text-slate-800">12,450</p>
                    <span className="text-emerald-500 text-xs font-semibold mt-2 block">+12.5% from last month</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 text-sm font-medium mb-1">Success Rate</h3>
                    <p className="text-3xl font-bold text-emerald-600">98.2%</p>
                    <span className="text-emerald-500 text-xs font-semibold mt-2 block">+0.4% from last month</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 text-sm font-medium mb-1">Average Latency</h3>
                    <p className="text-3xl font-bold text-blue-600">1.2s</p>
                    <span className="text-red-500 text-xs font-semibold mt-2 block">+0.1s from last month</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 text-sm font-medium mb-1">Credits Used</h3>
                    <p className="text-3xl font-bold text-purple-600">4,520</p>
                    <span className="text-emerald-500 text-xs font-semibold mt-2 block">-10% from last month</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 text-lg mb-6">Workflow Performance</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}/>
                                <Bar dataKey="success" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
                                <Bar dataKey="failed" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 text-lg mb-6">Execution Volume Trend</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                                <Area type="monotone" dataKey="success" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSuccess)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
