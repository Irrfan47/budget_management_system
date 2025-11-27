import StatusColumn from './StatusColumn.tsx';

const StatusBoard = () => {
    const columns = [
        {
            id: 'draft',
            title: 'Draft',
            count: 4,
            color: 'bg-slate-500',
            items: [
                { id: 1, title: 'Q3 Budget Review', department: 'Finance', date: 'Oct 24' },
                { id: 2, title: 'New Park Proposal', department: 'Environment', date: 'Oct 25' },
                { id: 3, title: 'IT Equipment Upgrade', department: 'Technology', date: 'Oct 26' },
                { id: 4, title: 'Staff Training', department: 'HR', date: 'Oct 27' },
            ]
        },
        {
            id: 'review',
            title: 'Under Review',
            count: 2,
            color: 'bg-blue-500',
            items: [
                { id: 5, title: 'Road Safety Campaign', department: 'Transport', date: 'Oct 20' },
                { id: 6, title: 'Library Books', department: 'Education', date: 'Oct 22' },
            ]
        },
        {
            id: 'approved',
            title: 'Approved',
            count: 3,
            color: 'bg-green-500',
            items: [
                { id: 7, title: 'School Lunch Program', department: 'Education', date: 'Oct 15' },
                { id: 8, title: 'City Hall Repairs', department: 'Infrastructure', date: 'Oct 18' },
                { id: 9, title: 'Winter Festival', department: 'Culture', date: 'Oct 19' },
            ]
        },
        {
            id: 'rejected',
            title: 'Rejected',
            count: 1,
            color: 'bg-red-500',
            items: [
                { id: 10, title: 'Office Party', department: 'Admin', date: 'Oct 10' },
            ]
        }
    ];

    return (
        <div className="flex gap-6 h-full min-w-[1000px]">
            {columns.map((column) => (
                <StatusColumn key={column.id} {...column} />
            ))}
        </div>
    );
};

export default StatusBoard;
