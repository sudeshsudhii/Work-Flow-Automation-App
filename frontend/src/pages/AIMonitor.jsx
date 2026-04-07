import React from 'react';
import AIMonitorPanel from '../components/AIMonitorPanel';

const AIMonitor = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in shadow-xl mt-4">
            <div className="mb-8 font-sans">
                <h1 className="text-3xl font-bold text-gray-900 drop-shadow-sm flex items-center">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mr-3 hidden sm:inline-block">
                       ⚡
                    </span>
                    AI Process Monitor
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                    Real-time debugging terminal for the intelligent message generation and delivery engine. 
                </p>
                <div className="flex gap-4 mt-6">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex-1">
                         <h3 className="text-indigo-800 font-semibold mb-1">Live Execution</h3>
                         <p className="text-sm text-indigo-600">Watch the AI construct messages dynamically as the workflow runs.</p>
                    </div>
                     <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex-1">
                         <h3 className="text-emerald-800 font-semibold mb-1">Smart Rules Engine</h3>
                         <p className="text-sm text-emerald-600">Track dynamic tone and parameter adjustments based on recipient context.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-6">
                    <AIMonitorPanel />
                </div>
            </div>
        </div>
    );
};

export default AIMonitor;
