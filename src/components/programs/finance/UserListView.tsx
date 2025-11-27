import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { userService } from '../../../services/api';

interface UserListViewProps {
    onSelectUser?: (userId: string, userName: string) => void;
}

const UserListView = ({ onSelectUser }: UserListViewProps) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.getUsers();
                // Filter to show only users with 'user' role (exclude admin and finance)
                const regularUsers = data.filter((user: any) => user.role === 'user');
                setUsers(regularUsers);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    {filteredUsers.map((user) => (
                        <button
                            key={user._id}
                            onClick={() => handleSelectUser(user._id, user.name)}
                            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                    {user.profilePicture ? (
                                        <img
                                            src={`http://localhost:5000${user.profilePicture}`}
                                            alt={user.name}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <span className="text-sm font-bold text-slate-500">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <div className="font-medium text-slate-900">{user.name}</div>
                                    <div className="text-xs text-slate-500">{user.email}</div>
                                </div>
                            </div>
                            <div className="text-slate-400">
                                <ArrowLeft size={20} className="rotate-180" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserListView;
