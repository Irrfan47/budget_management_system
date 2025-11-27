import { useState } from 'react';
import UserListView from './UserListView';
import UserProgramsView from './UserProgramsView';

const FinanceProgramView = () => {
    const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);

    const handleSelectUser = (userId: string, userName: string) => {
        setSelectedUser({ id: userId, name: userName });
    };

    const handleBack = () => {
        setSelectedUser(null);
    };

    if (selectedUser) {
        return (
            <UserProgramsView
                userId={selectedUser.id}
                userName={selectedUser.name}
                onBack={handleBack}
            />
        );
    }

    return <UserListView onSelectUser={handleSelectUser} />;
};

export default FinanceProgramView;
