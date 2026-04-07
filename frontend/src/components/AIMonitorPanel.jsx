import React, { useEffect, useState, useRef } from 'react';

const AIMonitorPanel = () => {
    const [logs, setLogs] = useState([]);
    const [connected, setConnected] = useState(false);
    const logsEndRef = useRef(null);

    useEffect(() => {
        let eventSource;

        const connectToStream = () => {
            eventSource = new EventSource('http://localhost:5000/api/logs/stream');

            eventSource.onopen = () => {
                setConnected(true);
            };

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setLogs((prev) => [...prev, data]);
                } catch (error) {
                    console.error('Failed to parse SSE data', error);
                }
            };

            eventSource.onerror = (error) => {
                console.error('SSE Error:', error);
                setConnected(false);
                eventSource.close();
                // Attempt to reconnect after 5 seconds
                setTimeout(connectToStream, 5000);
            };
        };

        connectToStream();

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, []);

    useEffect(() => {
        // Auto-scroll to bottom
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour12: false });
    };

    const getColorForSource = (source) => {
        switch (source) {
            case 'AI ENGINE STARTED': return 'text-blue-400';
            case 'AI REQUEST SENT': return 'text-yellow-400';
            case 'AI RESPONSE RECEIVED': return 'text-green-400';
            case 'EMAIL SERVICE': return 'text-purple-400';
            case 'EMAIL SUCCESS': return 'text-green-500 font-bold';
            case 'EMAIL FAILED': return 'text-red-500 font-bold';
            case 'SMART RULES': return 'text-cyan-400';
            case 'SYSTEM': return 'text-gray-400';
            case 'AI ERROR': return 'text-red-500 font-bold';
            case 'TEMPLATE FALLBACK': return 'text-orange-400';
            default: return 'text-gray-300';
        }
    };

    return (
        <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden flex flex-col h-[600px] shadow-2xl font-mono text-sm relative">
            {/* Terminal Header */}
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-gray-400 text-xs ml-4">ai-monitor-process ~ /worker</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-gray-400 text-xs">{connected ? 'Live' : 'Disconnected'}</span>
                </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                {logs.length === 0 ? (
                    <div className="text-gray-500 italic">Waiting for workflow execution...</div>
                ) : (
                    <div className="space-y-1">
                        {logs.map((log, index) => (
                            <div key={index} className="flex">
                                <span className="text-gray-500 mr-4 shrink-0 hover:text-gray-400 transition-colors">
                                    {formatTime(log.timestamp)}
                                </span>
                                <span className={`${getColorForSource(log.source)} mr-2 shrink-0 w-48 truncate`}>
                                    [{log.source}]
                                </span>
                                <span className="text-gray-300 break-words flex-1">
                                    {log.message}
                                </span>
                            </div>
                        ))}
                        <div ref={logsEndRef} />
                    </div>
                )}
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #4B5563;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
};

export default AIMonitorPanel;
