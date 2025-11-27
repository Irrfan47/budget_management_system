import { X } from 'lucide-react';

interface ProgramFiltersProps {
    filters: {
        status: string;
        budget: string;
    };
    onFilterChange: (key: string, value: string) => void;
    onClearFilters: () => void;
}

const ProgramFilters = ({ filters, onFilterChange, onClearFilters }: ProgramFiltersProps) => {
    return (
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 uppercase">Status</label>
                <select
                    value={filters.status}
                    onChange={(e) => onFilterChange('status', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="critical">Critical</option>
                    <option value="draft">Draft</option>
                    <option value="under review">Under Review</option>
                    <option value="completed">Completed</option>
                    <option value="query">Query</option>
                    <option value="query answered">Query Answered</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 uppercase">Budget Range</label>
                <select
                    value={filters.budget}
                    onChange={(e) => onFilterChange('budget', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                    <option value="">Any Amount</option>
                    <option value="low">Under $10k</option>
                    <option value="medium">$10k - $100k</option>
                    <option value="high">Over $100k</option>
                </select>
            </div>
            <div className="flex items-end">
                <button
                    onClick={onClearFilters}
                    className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                    <X size={16} />
                    Clear Filters
                </button>
            </div>
        </div>
    );
};

export default ProgramFilters;
