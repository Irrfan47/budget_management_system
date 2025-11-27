import { useState } from 'react';
import { Plus } from 'lucide-react';
import UserStats from './UserStats';
import UserFilters from './UserFilters';
import UserTable from './UserTable';
import UserModal from '../ui/UserModal';
import { userService } from '../../services/api';

const UserManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleAddUser = async (userData: any) => {
        setIsLoading(true);
        try {
            if (selectedUser) {
                await userService.updateUser(selectedUser._id, userData);
            } else {
                await userService.createUser(userData);
            }
            setIsModalOpen(false);
            setSelectedUser(null);
            handleRefresh();
        } catch (error) {
            console.error('Failed to save user:', error);
            alert('Failed to save user');
        } finally {
            setIsLoading(false);
        }
    };

    const openAddModal = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user: any) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
                    <p className="text-slate-500 mt-1">Manage system users and their roles</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors shadow-sm shadow-accent/20 cursor-pointer"
                >
                    <Plus size={16} />
                    Add User
                </button>
            </div>

            <UserStats refreshTrigger={refreshTrigger} />
            <UserFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                onRefresh={handleRefresh}
            />
            <UserTable
                onEdit={openEditModal}
                refreshTrigger={refreshTrigger}
                searchQuery={searchQuery}
                roleFilter={roleFilter}
            />

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddUser}
                isLoading={isLoading}
                initialData={selectedUser}
            />
        </div>
    );
};

export default UserManagement;
