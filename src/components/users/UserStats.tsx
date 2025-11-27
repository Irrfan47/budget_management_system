import { useState, useEffect } from 'react';
import { Users, Shield, UserCheck, UserX, Lock } from 'lucide-react';
import { userService } from '../../services/api';

interface UserStatsProps {
    refreshTrigger?: number;
}

const UserStats = ({ refreshTrigger = 0 }: UserStatsProps) => {
    const [stats, setStats] = useState({
        total: 0,
        admins: 0,
        active: 0,
        inactive: 0,
        locked: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const users = await userService.getUsers();
                setStats({
                    total: users.length,
                    admins: users.filter((u: any) => u.role === 'admin').length,
                    active: users.length, // Assuming all are active for now
                    inactive: 0, // Placeholder
                    locked: 0 // Placeholder
                });
            } catch (error) {
                console.error('Failed to fetch user stats:', error);
            }
        };

        fetchStats();
    }, [refreshTrigger]);

    const statCards = [
        {
            label: 'Total Users',
            value: stats.total,
            icon: Users,
            color: 'bg-blue-100 text-blue-600',
        },
        {
            label: 'Admins',
            value: stats.admins,
            icon: Shield,
            color: 'bg-purple-100 text-purple-600',
        },
        {
            label: 'Active Users',
            value: stats.active,
            icon: UserCheck,
            color: 'bg-green-100 text-green-600',
        },
        {
            label: 'Inactive Users',
            value: stats.inactive,
            icon: UserX,
            color: 'bg-red-100 text-red-600',
        },
        {
            label: 'Locked Accounts',
            value: stats.locked,
            subtext: `${stats.locked} with failed attempts`,
            icon: Lock,
            color: 'bg-orange-100 text-orange-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {statCards.map((stat, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                        {stat.subtext && <p className="text-[10px] text-slate-400 mt-1">{stat.subtext}</p>}
                    </div>
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                        <stat.icon size={20} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserStats;
