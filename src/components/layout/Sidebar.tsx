import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Activity, User, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { authService } from '../../services/api';
import logo from '../../assets/logo.jpg';

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    onLogout: () => void;
}

const Sidebar = ({ isCollapsed, onToggle, onLogout }: SidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = authService.getCurrentUser();
    const isAdmin = user?.role === 'admin';
    const isUser = user?.role === 'user';

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', subLabel: 'Analytics Overview', path: '/dashboard' },
        ...(isAdmin ? [{ id: 'users', icon: Users, label: 'User Management', subLabel: 'Roles & Permissions', path: '/users' }] : []),
        {
            id: isUser ? 'program' : 'userlist',
            icon: Briefcase,
            label: 'Program Management',
            subLabel: 'Budget Programs',
            path: isUser ? '/program' : '/userlist'
        },
        { id: 'status', icon: Activity, label: 'Status Tracking', subLabel: 'Allocation Progress', path: '/status' },
        { id: 'profile', icon: User, label: 'Profile', subLabel: 'Account Settings', path: '/profile' },
    ];

    return (
        <div
            className={`${isCollapsed ? 'w-20' : 'w-64'
                } h-screen bg-[#474444] border-r border-slate-600 flex flex-col fixed left-0 top-0 transition-all duration-300 ease-in-out z-20`}
        >
            <div className="p-6 relative flex-1">
                <div className={`flex items-center gap-3 mb-8 ${isCollapsed ? 'justify-center' : ''}`}>
                    <img src={logo} alt="Logo" className="w-10 h-10 rounded-md flex-shrink-0 object-cover" />
                    {!isCollapsed && (
                        <div className="overflow-hidden whitespace-nowrap">
                            <h1 className="font-bold text-white text-lg leading-tight">Budget System</h1>
                            <p className="text-xs text-slate-300">Government Portal</p>
                        </div>
                    )}
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path === '/userlist' && location.pathname.startsWith('/userlist'));

                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-4 p-3 rounded-xl text-left transition-colors cursor-pointer ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-black/20'
                                    : 'text-slate-200 hover:bg-white/10'
                                    } ${isCollapsed ? 'justify-center' : ''}`}
                            >
                                <item.icon size={20} className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                {!isCollapsed && (
                                    <div className="overflow-hidden whitespace-nowrap">
                                        <div className="font-medium text-sm">{item.label}</div>
                                        <div className={`text-xs ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                                            {item.subLabel}
                                        </div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-600/50">
                <div className={`flex items-center gap-3 mb-4 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
                    <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-500">
                        {user?.profilePicture ? (
                            <>
                                <img
                                    src={`http://localhost:5000${user.profilePicture}`}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                                <User size={20} className="text-slate-300 hidden" />
                            </>
                        ) : (
                            <User size={20} className="text-slate-300" />
                        )}
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <div className="font-medium text-sm text-white truncate" title={user?.name}>{user?.name || 'User'}</div>
                            <div className="text-xs text-slate-400 capitalize">{user?.role || 'Role'}</div>
                        </div>
                    )}
                </div>

                <button
                    onClick={onLogout}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl text-left text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <LogOut size={20} className="flex-shrink-0" />
                    {!isCollapsed && (
                        <span className="font-medium text-sm">Sign Out</span>
                    )}
                </button>
            </div>

            <button
                onClick={onToggle}
                className="absolute -right-3 top-12 bg-[#474444] border border-slate-600 rounded-full p-1 shadow-sm hover:bg-slate-700 text-white cursor-pointer"
            >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
        </div>
    );
};

export default Sidebar;
