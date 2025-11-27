import { Filter, Calendar, Settings } from 'lucide-react';
import StatusBoard from './StatusBoard.tsx';

const StatusTracking = () => {
    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Status Tracking</h2>
                    <p className="text-slate-500 text-sm mt-1">Monitor program progress across stages</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        <Calendar size={16} />
                        This Month
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        <Filter size={16} />
                        Filter
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <StatusBoard />
            </div>
        </div>
    );
};

export default StatusTracking;
