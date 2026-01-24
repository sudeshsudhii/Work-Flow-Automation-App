import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Templates() {
    const [templates, setTemplates] = useState([
        { id: 1, name: 'Fee Reminder', type: 'Fees', content: 'Generate a polite reminder.\nName: {{Name}}\nReg No: {{RegNo}}\nBalance: ₹{{Balance}}\nDue Date: {{DueDate}}\nTone: {{tone}}\nKeep under 60 words.' },
        { id: 2, name: 'Task Follow-up', type: 'Tasks', content: 'Generate a task follow-up.\nEmployee: {{Name}}\nTask: {{TaskName}}\nDeadline: {{Deadline}}\nTone: {{tone}}\nKeep under 50 words.' }
    ]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Prompt Templates</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <Plus size={18} /> New Template
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map(tpl => (
                    <div key={tpl.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{tpl.name}</h3>
                                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mt-1">{tpl.type}</span>
                            </div>
                            <div className="flex gap-2 text-gray-400">
                                <button className="hover:text-blue-600"><Edit2 size={16} /></button>
                                <button className="hover:text-red-600"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <pre className="bg-slate-50 p-4 rounded text-sm text-slate-700 whitespace-pre-wrap font-mono">
                            {tpl.content}
                        </pre>
                    </div>
                ))}
            </div>
        </div>
    );
}
