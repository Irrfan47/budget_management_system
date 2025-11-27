import { MoreHorizontal, Clock } from 'lucide-react';

interface StatusItem {
    id: number;
    title: string;
    department: string;
    date: string;
}

interface StatusColumnProps {
    title: string;
    count: number;
    color: string;
    items: StatusItem[];
}

const StatusColumn = ({ title, count, color, items }: StatusColumnProps) => {
    return (
        <div className="flex-1 flex flex-col bg-slate-50 rounded-xl border border-slate-200 h-full max-h-full">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-slate-50 rounded-t-xl z-10">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${color}`}></div>
                    <h3 className="font-semibold text-slate-700 text-sm">{title}</h3>
                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">{count}</span>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal size={16} />
                </button>
            </div>

            <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                {items.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{item.department}</span>
                            <button className="text-slate-300 opacity-0 group-hover:opacity-100 hover:text-slate-500 transition-all">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                        <h4 className="font-medium text-slate-900 text-sm mb-3 line-clamp-2">{item.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock size={14} />
                            <span>{item.date}</span>
                        </div>
                    </div>
                ))}

                <button className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 text-sm hover:bg-slate-100 hover:border-slate-400 transition-all flex items-center justify-center gap-2">
                    + Add New
                </button>
            </div>
        </div>
    );
};

export default StatusColumn;
