import { useState, useEffect } from 'react';
import StatCard from './StatCard';
import ProgramChart from './ProgramChart';
import SpendingTrendChart from './SpendingTrendChart';
import ActivityList from './ActivityList';
import NewProgramModal from '../ui/NewProgramModal';
import { Plus } from 'lucide-react';
import { programService, authService } from '../../services/api';

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [programs, setPrograms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);

    const fetchPrograms = async () => {
        try {
            const data = await programService.getPrograms();
            setPrograms(data);
        } catch (error) {
            console.error('Failed to fetch programs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        fetchPrograms();
    }, []);

    const handleCreateProgram = async (programData: FormData) => {
        await programService.createProgram(programData);
        await fetchPrograms();
    };

    // Calculate Statistics
    const totalPrograms = programs.length;

    const pendingStatuses = ['draft', 'pending', 'under review', 'query', 'query answered'];
    const pendingPrograms = programs.filter(p => pendingStatuses.includes(p.status.toLowerCase())).length;

    const acceptedPrograms = programs.filter(p => p.status.toLowerCase() === 'completed').length;
    const rejectedPrograms = programs.filter(p => p.status.toLowerCase() === 'rejected').length;

    // Chart Data
    const programChartData = [
        { name: 'Pending', value: pendingPrograms, color: '#f59e0b' }, // Amber
        { name: 'Accepted', value: acceptedPrograms, color: '#10b981' }, // Emerald
        { name: 'Rejected', value: rejectedPrograms, color: '#ef4444' }, // Red
    ].filter(item => item.value > 0);

    // Spending Trend Data (Group by Month)
    const spendingData = programs
        .filter(program => program.status.toLowerCase() === 'completed')
        .reduce((acc: any[], program) => {
            const date = new Date(program.createdAt);
            const month = date.toLocaleString('default', { month: 'short' });
            const existingMonth = acc.find(item => item.name === month);

            if (existingMonth) {
                existingMonth.value += program.budget || 0;
            } else {
                acc.push({ name: month, value: program.budget || 0 });
            }
            return acc;
        }, []);

    // Sort spending data by month order (simple approach assuming current year or sequential)
    // For a more robust solution, we'd need year handling, but for now let's rely on insertion order or basic sort if needed.
    // Actually, reduce might scramble order if not careful. Let's sort by date.
    // Better approach: Create an array of last 6 months and fill it.
    // For now, let's just sort the result by month index.
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    spendingData.sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));


    // Recent Activity
    const recentActivities = [...programs]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3)
        .map(program => ({
            title: program.name,
            description: `Status: ${program.status}`,
            time: new Date(program.updatedAt).toLocaleDateString(),
            budget: program.budget
        }));

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Analytical Dashboard</h2>
                <div className="flex items-center gap-4">
                    {currentUser?.role === 'user' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                            <Plus size={16} />
                            New Program
                        </button>
                    )}
                    <div className="flex gap-2">
                        {/* Placeholder for user avatars or other header items */}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Programs"
                    value={totalPrograms.toString()}
                    subValue="All time"
                />
                <StatCard
                    title="Pending Programs"
                    value={pendingPrograms.toString()}
                    subValue="Requires action"
                    highlight
                />
                <StatCard
                    title="Accepted Programs"
                    value={acceptedPrograms.toString()}
                    subValue="Completed"
                />
                <StatCard
                    title="Rejected Programs"
                    value={rejectedPrograms.toString()}
                    subValue="Disapproved"
                    highlight
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProgramChart data={programChartData} />
                <SpendingTrendChart data={spendingData} />
            </div>

            <ActivityList activities={recentActivities} />

            <NewProgramModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleCreateProgram}
            />
        </div>
    );
};

export default Dashboard;
