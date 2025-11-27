import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProgramList from '../ProgramList';
import DocumentViewModal from '../../ui/DocumentViewModal';
import ProgramDetailModal from '../../ui/ProgramDetailModal';
import { programService } from '../../../services/api';

interface UserProgramsViewProps {
    userId?: string;
    userName?: string;
    onBack?: () => void;
}

const UserProgramsView = ({ userId: propUserId, userName: propUserName, onBack }: UserProgramsViewProps = {}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state || {};

    const userId = propUserId || state.userId;
    const userName = propUserName || state.userName;

    const [programs, setPrograms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDocumentViewOpen, setIsDocumentViewOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<any>(null);

    useEffect(() => {
        // Redirect back if no user data
        if (!userId || !userName) {
            navigate('/userlist');
            return;
        }

        const fetchPrograms = async () => {
            setIsLoading(true);
            try {
                const data = await programService.getPrograms(userId);
                setPrograms(data);
            } catch (error) {
                console.error('Failed to fetch programs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrograms();
    }, [userId, userName, navigate]);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/userlist');
        }
    };

    const handleOpenDocumentView = (program: any) => {
        setSelectedProgram(program);
        setIsDocumentViewOpen(true);
    };

    const handleOpenDetailModal = (program: any) => {
        setSelectedProgram(program);
        setIsDetailModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={handleBack}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                    <ArrowLeft size={20} className="text-slate-600" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">{userName}'s Programs</h2>
                    <p className="text-slate-500 text-sm mt-1">View and manage program statuses</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <ProgramList
                    programs={programs}
                    isLoading={isLoading}
                    onViewDocuments={handleOpenDocumentView}
                    onViewDetails={handleOpenDetailModal}
                />
            </div>

            <DocumentViewModal
                isOpen={isDocumentViewOpen}
                onClose={() => {
                    setIsDocumentViewOpen(false);
                    setSelectedProgram(null);
                }}
                documents={selectedProgram?.documents || []}
                programName={selectedProgram?.name || ''}
            />

            <ProgramDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedProgram(null);
                }}
                program={selectedProgram}
            />
        </div>
    );
};

export default UserProgramsView;
