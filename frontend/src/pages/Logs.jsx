import { useState, useEffect } from 'react';
import { Download, Filter, RefreshCw } from 'lucide-react';
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
            const response = await axios.get('http://localhost:5000/api/logs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) fetchLogs();
    }, [currentUser]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Workflow Logs</h2>
                <div className="flex gap-3">
                    <button
                        onClick={fetchLogs}
                        className="bg-white border text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50"
                    >
                        <RefreshCw size={18} className={loading && "animate-spin"} /> Refresh
                    </button>
                    <button className="bg-white border text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50">
                        <Filter size={18} /> Filter
                    </button>
                    <button className="bg-white border text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50">
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 uppercase text-xs font-semibold text-gray-500">
                        <tr>
                            <th className="px-6 py-4">Run ID</th>
                            <th className="px-6 py-4">Workflow</th>
                            <th className="px-6 py-4">Recipient</th>
                            <th className="px-6 py-4">Channel</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {logs.map(log => (
                            <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-xs text-gray-400">{log.id}</td>
                                <td className="px-6 py-4 font-medium text-blue-600">{log.workflow}</td>
                                <td className="px-6 py-4 text-gray-900">{log.name}</td>
                                <td className="px-6 py-4">{log.channel}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${log.status === 'Sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-xs">{log.time}</td>
                            </tr>
                        ))}
                        {logs.length === 0 && !loading && (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                                    No logs found. Run a workflow to see data here.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
