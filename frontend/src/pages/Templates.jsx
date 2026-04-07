import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Copy, FileText, Download, MoreHorizontal, Search, ChevronRight, ChevronLeft, CalendarClock, Briefcase, MessageSquare, ListTodo, AlignJustify } from 'lucide-react';

export default function Templates() {
    const templatesList = [
        { 
            id: 1, 
            name: 'Fee Reminder', 
            description: 'Send reminders about pending fees.',
            usageCount: 30,
            lastModified: 'Mar 10, 2024',
            icon: Briefcase,
            iconColor: 'text-blue-500',
            bg: 'bg-blue-50',
        },
        { 
            id: 2, 
            name: 'Task Followup', 
            description: 'Follow up on incomplete tasks.',
            usageCount: 25,
            lastModified: 'Mar 10, 2024',
            icon: ListTodo,
            iconColor: 'text-indigo-500',
            bg: 'bg-indigo-50',
        },
        { 
            id: 3, 
            name: 'Event Invitation', 
            description: 'Invite users to upcoming events.',
            usageCount: 20,
            lastModified: 'Mar 8, 2024',
            icon: CalendarClock,
            iconColor: 'text-orange-500',
            bg: 'bg-orange-50',
        },
        { 
            id: 4, 
            name: 'HR Notification', 
            description: 'Send important HR updates and announcements.',
            usageCount: 10,
            lastModified: 'Mar 7, 2024',
            icon: MessageSquare,
            iconColor: 'text-blue-500',
            bg: 'bg-blue-50',
        },
        { 
            id: 5, 
            name: 'Meeting Reminder', 
            description: 'Remind users about upcoming meetings.',
            usageCount: 12,
            lastModified: 'Mar 5, 2024',
            icon: CalendarClock,
            iconColor: 'text-blue-500',
            bg: 'bg-blue-50',
        },
        { 
            id: 6, 
            name: 'Payment Receipt', 
            description: 'Send receipts for received payments.',
            usageCount: 15,
            lastModified: 'Mar 3, 2024',
            icon: Briefcase,
            iconColor: 'text-blue-500',
            bg: 'bg-blue-50',
        },
        { 
            id: 7, 
            name: 'Survey Request', 
            description: 'Request feedback through surveys.',
            usageCount: 8,
            lastModified: 'Mar 1, 2024',
            icon: FileText,
            iconColor: 'text-blue-500',
            bg: 'bg-blue-50',
        },
        { 
            id: 8, 
            name: 'Newsletter', 
            description: 'Send regular newsletters to subscribers.',
            usageCount: 15,
            lastModified: 'Feb 23, 2024',
            icon: MessageSquare,
            iconColor: 'text-blue-500',
            bg: 'bg-blue-50',
        }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto h-full flex flex-col">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm mb-4 text-slate-400">
                <span className="hover:text-slate-600 cursor-pointer">Workspace</span>
                <ChevronRight size={14} className="mx-1" />
                <span className="text-slate-700">Templates</span>
            </div>

            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Templates</h1>
                
                <div className="flex items-center gap-3">
                    <button className="bg-white border text-slate-600 border-slate-200 px-3 py-1.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium">
                        <Download size={16} /> Export <ChevronRight size={14} className="rotate-90 ml-1 opacity-50"/>
                    </button>
                    <button className="bg-white border text-slate-600 border-slate-200 p-1.5 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm text-[13px]">
                    <Plus size={16} /> Create New Template
                </button>
                <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search templates..." 
                        className="pl-9 pr-4 py-2.5 w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none rounded-lg text-sm transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 content-start relative">
                {templatesList.map(tpl => (
                    <div key={tpl.id} className="bg-white rounded-[14px] shadow-sm border border-slate-100 flex flex-col pt-5 hover:shadow-md transition-shadow">
                        <div className="px-5 mb-3 flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${tpl.bg} ${tpl.iconColor}`}>
                                <tpl.icon size={18} />
                            </div>
                            <h3 className="text-[15px] font-semibold text-slate-800 leading-tight mt-0.5">{tpl.name}</h3>
                        </div>
                        
                        <p className="text-[13px] text-slate-500 px-5 mb-5 leading-relaxed line-clamp-2">
                            {tpl.description}
                        </p>
                        
                        <div className="mt-auto px-5 mb-4 text-[11px] text-slate-400 font-medium">
                            {tpl.usageCount} uses · Modified {tpl.lastModified}
                        </div>

                        {/* Actions Row */}
                        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-50/80 bg-slate-50/30 rounded-b-[14px]">
                            <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors"><Edit2 size={15} strokeWidth={2.5}/></button>
                            <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors"><AlignJustify size={15} strokeWidth={2.5}/></button>
                            <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors"><Copy size={15} strokeWidth={2.5}/></button>
                            <button className="p-1.5 text-red-400 hover:bg-red-50 rounded transition-colors ml-auto"><Trash2 size={15} strokeWidth={2.5}/></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between text-[13px] text-slate-500">
                <div>Showing 1 to 8 of 8 results</div>
                <div className="flex items-center gap-3">
                    <span className="mr-2">1 to 1 8</span>
                    <div className="flex bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        <button className="px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 text-slate-400 border-r border-slate-200"><ChevronLeft size={16} /></button>
                        <button className="px-3 py-1.5 hover:bg-slate-50 text-blue-600 font-medium border-r border-slate-200 bg-blue-50/50">1</button>
                        <button className="px-3 py-1.5 hover:bg-slate-50 text-slate-600 font-medium border-r border-slate-200">2</button>
                        <button className="px-3 py-1.5 hover:bg-slate-50 text-slate-400 border-r border-slate-200"><ChevronRight size={16} /></button>
                        <button className="px-3 py-1.5 hover:bg-slate-50 text-slate-400"><AlignJustify size={16} /></button>
                    </div>
                </div>
            </div>

        </div>
    );
}
