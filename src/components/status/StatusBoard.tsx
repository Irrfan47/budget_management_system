import StatusColumn from './StatusColumn.tsx';

interface StatusBoardProps {
    programs: any[];
}

const StatusBoard = ({ programs }: StatusBoardProps) => {
    // Helper to format date
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Categorize programs
    const pendingPrograms = programs.filter(p =>
        !['completed', 'rejected'].includes(p.status.toLowerCase())
    ).map(p => ({
        id: p._id || p.id,
        title: p.name,
        department: p.department || 'General',
        date: formatDate(p.updatedAt || p.createdAt),
        status: p.status
    }));

    const acceptedPrograms = programs.filter(p =>
        p.status.toLowerCase() === 'completed'
    ).map(p => ({
        id: p._id || p.id,
        title: p.name,
        department: p.department || 'General',
        date: formatDate(p.updatedAt || p.createdAt),
        status: p.status
    }));

    const rejectedPrograms = programs.filter(p =>
        p.status.toLowerCase() === 'rejected'
    ).map(p => ({
        id: p._id || p.id,
        title: p.name,
        department: p.department || 'General',
        date: formatDate(p.updatedAt || p.createdAt),
        status: p.status
    }));

    const columns = [
        {
            id: 'pending',
            title: 'Pending',
            count: pendingPrograms.length,
            color: 'bg-amber-500',
            items: pendingPrograms
        },
        {
            id: 'accepted',
            title: 'Accepted',
            count: acceptedPrograms.length,
            color: 'bg-emerald-500',
            items: acceptedPrograms
        },
        {
            id: 'rejected',
            title: 'Rejected',
            count: rejectedPrograms.length,
            color: 'bg-red-500',
            items: rejectedPrograms
        }
    ];

    return (
        <div className="flex gap-6 h-full min-w-[1000px] pb-4">
            {columns.map((column) => (
                <StatusColumn key={column.id} {...column} />
            ))}
        </div>
    );
};

export default StatusBoard;
