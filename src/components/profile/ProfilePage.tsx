import { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import ProfilePhoto from './ProfilePhoto';
import BasicInfo from './BasicInfo';

import ChangePassword from './ChangePassword';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');

    return (
        <div className="">
            <ProfileHeader />
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'info' ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ProfilePhoto />
                    <BasicInfo />
                </div>
            ) : (
                <ChangePassword />
            )}
        </div>
    );
};

export default ProfilePage;
