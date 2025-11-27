import React from 'react';
import { User, Lock } from 'lucide-react';

interface ProfileTabsProps {
    activeTab: 'info' | 'password';
    onTabChange: (tab: 'info' | 'password') => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex gap-4 mb-8 border-b border-slate-200">
            <button
                onClick={() => onTabChange('info')}
                className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'info'
                        ? 'text-primary'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
            >
                <User size={18} />
                Profile Information
                {activeTab === 'info' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
                )}
            </button>
            <button
                onClick={() => onTabChange('password')}
                className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'password'
                        ? 'text-primary'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
            >
                <Lock size={18} />
                Change Password
                {activeTab === 'password' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
                )}
            </button>
        </div>
    );
};

export default ProfileTabs;
