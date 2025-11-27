import { useState, useEffect } from 'react';
import { Filter, Calendar, Settings, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import StatusBoard from './StatusBoard';
import { programService } from '../../services/api';

const StatusTracking = () => {
    const [programs, setPrograms] = useState<any[]>([]);
    const [filteredPrograms, setFilteredPrograms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPrograms();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [programs, selectedDate, searchQuery]);

    const fetchPrograms = async () => {
        try {
            setIsLoading(true);
            const data = await programService.getPrograms();
            setPrograms(data);
        } catch (error) {
            console.error('Failed to fetch programs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrevMonth = () => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() - 1);
            return newDate;
        });
    };

    const handleNextMonth = () => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + 1);
            return newDate;
        });
    };

    const applyFilters = () => {
        let result = [...programs];

        // Filter by Selected Month
        const targetMonth = selectedDate.getMonth();
        const targetYear = selectedDate.getFullYear();

        result = result.filter(program => {
            const date = new Date(program.createdAt || program.updatedAt); // Use createdAt or updatedAt
            return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
        });

        // Filter by Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(program =>
                program.name.toLowerCase().includes(query) ||
                program.programId?.toLowerCase().includes(query) ||
                program.department?.toLowerCase().includes(query)
            );
        }

        setFilteredPrograms(result);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Status Tracking</h2>
                    <p className="text-slate-500 text-sm mt-1">Monitor program progress across stages</p>
                </div>
                <div className="flex items-center gap-3">
                    {showSearch ? (
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 animate-in fade-in slide-in-from-right-5">
                            <Search size={16} className="text-slate-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Search programs..."
                                className="outline-none text-sm text-slate-700 w-48"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="text-slate-400 hover:text-slate-600 ml-2">
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
                                    title="Previous Month"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <div className="flex items-center gap-2 px-3 min-w-[140px] justify-center border-x border-slate-100">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span className="text-sm font-medium text-slate-700">
                                        {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
                                    title="Next Month"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            <button
                                onClick={() => setShowSearch(true)}
                                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                            >
                                <Filter size={16} />
                                Filter
                            </button>
                        </>
                    )}
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full text-slate-500">Loading programs...</div>
                ) : (
                    <StatusBoard programs={filteredPrograms} />
                )}
            </div>
        </div>
    );
};

export default StatusTracking;
