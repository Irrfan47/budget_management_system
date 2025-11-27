import { authService } from '../../services/api';
import UserProgramView from './user/UserProgramView';
import FinanceProgramView from './finance/FinanceProgramView';

const ProgramManagement = () => {
    const currentUser = authService.getCurrentUser();
    const userRole = currentUser?.role;

    // User role: sees only their own programs with ability to create
    if (userRole === 'user') {
        return <UserProgramView />;
    }

    // Finance and Admin roles: see user list first, then user's programs
    // Admin will have fewer actions (to be implemented later)
    if (userRole === 'finance' || userRole === 'admin') {
        return <FinanceProgramView />;
    }

    return (
        <div className="p-8 text-center text-slate-500">
            Unauthorized access
        </div>
    );
};

export default ProgramManagement;
