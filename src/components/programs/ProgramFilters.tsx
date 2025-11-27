import { X } from 'lucide-react';

const ProgramFilters = () => {
    return (
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 uppercase">Department</label>
                <select className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="">All Departments</option>
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="infrastructure">Infrastructure</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 uppercase">Status</label>
                <select className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 uppercase">Budget Range</label>
                <select className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="">Any Amount</option>
                    <option value="low">Under $10k</option>
                    <option value="medium">$10k - $100k</option>
                    <option value="high">Over $100k</option>
                </select>
            </div>
            <div className="flex items-end">
                <button className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <X size={16} />
                    Clear Filters
                </button>
            </div>
        </div>
    );
};

export default ProgramFilters;
