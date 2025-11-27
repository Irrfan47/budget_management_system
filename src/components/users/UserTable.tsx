import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { userService } from '../../services/api';

interface UserTableProps {
    onEdit?: (user: any) => void;
    refreshTrigger?: number;
    searchQuery?: string;
    roleFilter?: string;
}

const UserTable = ({ onEdit, refreshTrigger = 0, searchQuery = '', roleFilter = 'all' }: UserTableProps) => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.getUsers();
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [refreshTrigger]);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.deleteUser(id);
                setUsers(users.filter(user => user._id !== id));
            } catch (error) {
                console.error('Failed to delete user:', error);
            }
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-blue-100 text-blue-700';
            case 'finance': return 'bg-slate-100 text-slate-700';
            default: return 'bg-green-100 text-green-700';
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading users...</div>;
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Users ({filteredUsers.length})</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-700 uppercase bg-[#bdbdbf] border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 font-medium">Name</th>
                            <th className="px-6 py-3 font-medium">Email</th>
                            <th className="px-6 py-3 font-medium">Phone</th>
                            <th className="px-6 py-3 font-medium">Role</th>
                            <th className="px-6 py-3 font-medium">Department</th>
                            <th className="px-6 py-3 font-medium">Created</th>
                            <th className="px-6 py-3 font-medium">Last Login</th>
                            <th className="px-6 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 max-w-[200px]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200">
                                            {user.profilePicture ? (
                                                <img
                                                    src={`http://localhost:5000${user.profilePicture}`}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-xs font-bold text-slate-500">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                            {/* Fallback for image error */}
                                            <span className={`text-xs font-bold text-slate-500 hidden`}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="truncate" title={user.name}>{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                <td className="px-6 py-4 text-slate-600">{user.phone || '-'}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{user.department || '-'}</td>
                                <td className="px-6 py-4 text-slate-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-slate-600">
                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onEdit && onEdit(user)}
                                            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md transition-colors border border-slate-200 cursor-pointer"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors border border-red-100 cursor-pointer"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
