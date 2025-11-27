import { useState } from 'react';
import StatCard from './StatCard';
import BudgetChart from './BudgetChart';
import SpendingTrendChart from './SpendingTrendChart';
import ActivityList from './ActivityList';
import NewProgramModal from '../ui/NewProgramModal';
import { Plus } from 'lucide-react';

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Analytical Dashboard</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        <Plus size={16} />
                        New Program
                    </button>
                    <div className="flex gap-2">
                        <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                        <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Budget"
                    value="$2.5B"
                    subValue="Fiscal Year 2024"
                />
                <StatCard
                    title="Allocated"
                    value="$1.8B"
                    subValue="72% of total"
                />
                <StatCard
                    title="Active Programs"
                    value="156"
                    subValue="Across 12 departments"
                    highlight
                />
                <StatCard
                    title="Pending Approvals"
                    value="23"
                    subValue="Requires action"
                    highlight
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BudgetChart />
                <SpendingTrendChart />
            </div>

            <ActivityList />

            <NewProgramModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;
