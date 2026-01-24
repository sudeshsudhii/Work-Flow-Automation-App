import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
    { name: 'Mon', sent: 400, failed: 24 },
    { name: 'Tue', sent: 300, failed: 13 },
    { name: 'Wed', sent: 200, failed: 98 },
    { name: 'Thu', sent: 278, failed: 39 },
    { name: 'Fri', sent: 189, failed: 48 },
    { name: 'Sat', sent: 239, failed: 38 },
    { name: 'Sun', sent: 349, failed: 43 },
];

const pieData = [
    { name: 'Sent', value: 5678 },
    { name: 'Failed', value: 12 },
    { name: 'Pending', value: 300 },
];

const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];

export default function Dashboard() {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transform hover:scale-105 transition duration-300">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Total Workflows Run</h3>
                    <p className="text-4xl font-extrabold text-gray-900">1,234</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transform hover:scale-105 transition duration-300">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Messages Sent</h3>
                    <p className="text-4xl font-extrabold text-blue-600">5,678</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transform hover:scale-105 transition duration-300">
                    <h3 className="text-red-400 text-sm font-medium uppercase tracking-wider mb-2">Failed Messages</h3>
                    <p className="text-4xl font-extrabold text-red-500">12</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Activity Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-6 text-gray-800">Weekly Activity</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
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
                    </div>
                </div>

                {/* Success Comparison */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 self-start w-full">Delivery Status</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex gap-4 mt-4">
                        {pieData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                <span className="text-sm text-gray-600">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
