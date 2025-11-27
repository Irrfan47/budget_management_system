import { useState, useRef, useEffect } from 'react';
import { Search, Filter, RefreshCw, ChevronDown, Check } from 'lucide-react';

interface UserFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    roleFilter: string;
    setRoleFilter: (role: string) => void;
    onRefresh: () => void;
}

const UserFilters = ({ searchQuery, setSearchQuery, roleFilter, setRoleFilter, onRefresh }: UserFiltersProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const roles = [
        { value: 'all', label: 'All Roles' },
        { value: 'admin', label: 'Admin' },
        { value: 'finance', label: 'Finance' },
        { value: 'user', label: 'User' },
    ];

    const selectedRoleLabel = roles.find(r => r.value === roleFilter)?.label || 'All Roles';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer min-w-[140px] justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-slate-400" />
                            <span>{selectedRoleLabel}</span>
                        </div>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                            {roles.map((role) => (
                                <button
                                    key={role.value}
                                    onClick={() => {
                                        setRoleFilter(role.value);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${roleFilter === role.value ? 'text-primary font-medium bg-primary/5' : 'text-slate-600'
                                        }`}
                                >
                                    {role.label}
                                    {roleFilter === role.value && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={onRefresh}
                    className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>
        </div>
    );
};

export default UserFilters;
