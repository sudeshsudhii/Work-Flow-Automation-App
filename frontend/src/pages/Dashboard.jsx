import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';

const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];

export default function Dashboard() {
    const { currentUser } = useAuth();
    const [metrics, setMetrics] = useState({ totalRuns: 0, totalSent: 0, totalFailed: 0 });
    const [activityData, setActivityData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const fetchData = async () => {
            try {
                const token = await currentUser.getIdToken();
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const headers = { Authorization: `Bearer ${token}` };

                const [metricsRes, activityRes, statusRes, summaryRes] = await Promise.all([
                    axios.get(`${API_URL}/api/dashboard/metrics`, { headers }),
                    axios.get(`${API_URL}/api/dashboard/weekly-activity`, { headers }),
                    axios.get(`${API_URL}/api/dashboard/delivery-status`, { headers }),
                    axios.get(`${API_URL}/api/dashboard/ai-summary`, { headers })
                ]);

                setMetrics(metricsRes.data);
                setActivityData(activityRes.data.length > 0 ? activityRes.data : [{ name: 'No Data', sent: 0, failed: 0 }]);
                setStatusData(statusRes.data);
                setSummary(summaryRes.data);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);

    if (loading) {
        return <div className="p-10 text-center text-gray-400">Loading Dashboard Metrics...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Overview</h1>

            {/* AI Summary Widget */}
            {summary && (
                <div className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100 flex items-start gap-4 shadow-sm animate-fade-in-up">
                    <div className="p-3 bg-white rounded-full text-purple-600 shadow-sm">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h3 className="text-purple-900 font-semibold mb-1">AI Insight (Last Run: {summary.workflowType})</h3>
                        <p className="text-purple-800 text-sm leading-relaxed">"{summary.summaryText}"</p>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transform hover:scale-105 transition duration-300">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Total Workflows Run</h3>
                    <p className="text-4xl font-extrabold text-gray-900">{metrics.totalRuns}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transform hover:scale-105 transition duration-300">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Messages Sent</h3>
                    <p className="text-4xl font-extrabold text-blue-600">{metrics.totalSent}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transform hover:scale-105 transition duration-300">
                    <h3 className="text-red-400 text-sm font-medium uppercase tracking-wider mb-2">Failed Messages</h3>
                    <p className="text-4xl font-extrabold text-red-500">{metrics.totalFailed}</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Activity Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-6 text-gray-800">Weekly Activity</h3>
                    <div className="h-80">
                        {activityData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-400">No activity yet</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={activityData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', color: '#fff', borderRadius: '8px', border: 'none' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Line type="monotone" dataKey="sent" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="failed" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, fill: '#EF4444', strokeWidth: 2, stroke: '#fff' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Success Comparison */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 self-start w-full">Delivery Status</h3>
                    <div className="h-80 w-full">
                        {statusData.reduce((acc, curr) => acc + curr.value, 0) === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                    <div className="flex gap-4 mt-4">
                        {statusData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="text-sm text-gray-600">{entry.name} ({entry.value})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
