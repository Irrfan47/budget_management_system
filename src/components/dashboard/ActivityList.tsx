

const activities = [
    {
        title: 'Budget Request Approved',
        description: 'Healthcare Program - $450,000 approved by Finance Director',
        time: '2 hours ago',
    },
    {
        title: 'New Program Created',
        description: 'Infrastructure Development - Education Department',
        time: '5 hours ago',
    },
    {
        title: 'Quarterly Report Generated',
        description: 'Q1 2024 Financial Summary available for review',
        time: '1 day ago',
    },
];

const ActivityList = () => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
                {activities.map((activity, index) => (
                    <div key={index} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0"></div>
                        <div>
                            <h4 className="font-medium text-slate-900">{activity.title}</h4>
                            <p className="text-sm text-slate-500 mt-1">{activity.description}</p>
                            <p className="text-xs text-slate-400 mt-2">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityList;
