import React from 'react';

interface Activity {
    title: string;
    description: string;
    time: string;
    budget?: string | number;
}

interface ActivityListProps {
    activities: Activity[];
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
                {activities.length === 0 ? (
                    <p className="text-slate-500 text-sm">No recent activity.</p>
                ) : (
                    activities.map((activity, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold text-xs">
                                {activity.title.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-900">
                                    {activity.title}
                                    {activity.budget && (
                                        <span className="ml-2 text-sm font-normal text-slate-500">
                                            (${Number(activity.budget).toLocaleString()})
                                        </span>
                                    )}
                                </h4>
                                <p className="text-sm text-slate-500 mt-1">{activity.description}</p>
                                <p className="text-xs text-slate-400 mt-2">{activity.time}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ActivityList;
