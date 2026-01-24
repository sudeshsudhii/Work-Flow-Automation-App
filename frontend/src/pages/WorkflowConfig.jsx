import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Send, Zap, MessageCircle, Mail } from 'lucide-react';

import { toast } from 'sonner';

export default function WorkflowConfig() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // State from previous step
    const distinctId = state?.distinctId;
    const mapping = state?.mapping;

    const [config, setConfig] = useState({
        workflowType: 'Fees',
        channels: { email: true, whatsapp: false },
        tone: 'Formal',
        smartAI: true
    });

    const [loading, setLoading] = useState(false);

    if (!distinctId) {
        return <div className="p-8 text-center text-red-500">No data selected. Please upload a file first.</div>;
    }

    const handleRun = async () => {
        setLoading(true);
        try {
            const token = await currentUser.getIdToken();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.post(`${API_URL}/api/run-workflow`, {
                ...config,
                distinctId,
                mapping
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Workflow Started Successfully!', { description: 'Check the logs for progress.' });
            navigate('/logs');
        } catch (error) {
            console.error(error);
            toast.error('Failed to start workflow');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Configure Workflow</h2>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 space-y-6">
                    {/* Workflow Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Workflow Type</label>
                        <select
                            value={config.workflowType}
                            onChange={e => setConfig({ ...config, workflowType: e.target.value })}
                            className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500 border"
                        >
                            <option value="Fees">Fee Reminder</option>
                            <option value="Tasks">Task Follow-up</option>
                            <option value="HR">HR Notification</option>
                            <option value="Events">Event Invitation</option>
                        </select>
                    </div>

                    {/* Channels */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Channels</label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setConfig({ ...config, channels: { ...config.channels, email: !config.channels.email } })}
                                className={`flex-1 p-4 rounded-lg border flex items-center justify-center gap-2 transition ${config.channels.email ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white hover:bg-gray-50'}`}
                            >
                                <Mail size={20} /> Email
                            </button>
                            <button
                                onClick={() => setConfig({ ...config, channels: { ...config.channels, whatsapp: !config.channels.whatsapp } })}
                                className={`flex-1 p-4 rounded-lg border flex items-center justify-center gap-2 transition ${config.channels.whatsapp ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white hover:bg-gray-50'}`}
                            >
                                <MessageCircle size={20} /> WhatsApp
                            </button>
                        </div>
                    </div>

                    {/* Tone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message Tone</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {['Formal', 'Friendly', 'Urgent', 'Supportive'].map(voice => (
                                <button
                                    key={voice}
                                    onClick={() => setConfig({ ...config, tone: voice })}
                                    className={`py-2 px-3 rounded-md text-sm transition ${config.tone === voice ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {voice}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Smart AI */}
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded text-purple-600">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h4 className="font-medium text-purple-900">Smart AI Rules</h4>
                                <p className="text-xs text-purple-700">Auto-optimize sending time and urgency based on user profile.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={config.smartAI} onChange={e => setConfig({ ...config, smartAI: e.target.checked })} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={handleRun}
                        disabled={loading}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 shadow-md flex items-center gap-2 transform active:scale-95 transition"
                    >
                        <Send size={18} /> {loading ? 'Starting Workflow...' : 'Run Workflow'}
                    </button>
                </div>
            </div>
        </div>
    );
}
