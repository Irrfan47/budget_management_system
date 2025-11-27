import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Clock } from 'lucide-react';
import { userService, programService } from '../../../services/api';

interface UserListViewProps {
    onSelectUser?: (userId: string, userName: string) => void;
}

const UserListView = ({ onSelectUser }: UserListViewProps) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);
    const [programs, setPrograms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, programsData] = await Promise.all([
                    userService.getUsers(),
                    programService.getPrograms()
                ]);

                // Filter to show only users with 'user' role (exclude admin and finance)
                const regularUsers = usersData.filter((user: any) => user.role === 'user');
                setUsers(regularUsers);
                setPrograms(programsData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getUserStats = (userId: string) => {
        const userPrograms = programs.filter(p => {
            const creator = p.createdBy || p.user;
            const creatorId = creator?._id || creator;
            return creatorId === userId;
        });
        const total = userPrograms.length;

        const pendingStatuses = ['draft', 'pending', 'under review', 'query', 'query answered'];
        const pending = userPrograms.filter(p => pendingStatuses.includes(p.status.toLowerCase())).length;

        return { total, pending };
    };

    const handleSelectUser = (userId: string, userName: string) => {
        if (onSelectUser) {
            onSelectUser(userId, userName);
        } else {
            navigate('/userlist/program', { state: { userId, userName } });
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading users...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Program Management</h2>
                <p className="text-slate-500 text-sm mt-1">Select a user to view and manage their programs</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                </div>

                <div className="divide-y divide-slate-200">
                    {filteredUsers.map((user) => {
                        const stats = getUserStats(user._id);
                        return (
                            <button
                                key={user._id}
                                onClick={() => handleSelectUser(user._id, user.name)}
                                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                                        {user.profilePicture ? (
                                            <img
                                                src={`http://localhost:5000${user.profilePicture}`}
                                                alt={user.name}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <span className="text-lg font-bold text-slate-500">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-slate-900 truncate">{user.name}</div>
                                        <div className="text-sm text-slate-500 truncate">{user.email}</div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-6 mr-4">
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                <FileText size={14} />
                                                Total
                                            </div>
                                            <span className="text-lg font-semibold text-slate-900">{stats.total}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 uppercase tracking-wider">
                                                <Clock size={14} />
                                                Pending
                                            </div>
                                            <span className="text-lg font-semibold text-amber-600">{stats.pending}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-slate-400 pl-4 border-l border-slate-100">
                                    <ArrowLeft size={20} className="rotate-180" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default UserListView;
