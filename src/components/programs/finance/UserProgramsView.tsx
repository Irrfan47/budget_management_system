import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProgramList from '../ProgramList';
import DocumentViewModal from '../../ui/DocumentViewModal';
import ProgramDetailModal from '../../ui/ProgramDetailModal';
import QueryModal from '../../ui/QueryModal';
import AcceptProgramModal from '../../ui/AcceptProgramModal';
import RejectProgramModal from '../../ui/RejectProgramModal';
import ProgramFilters from '../ProgramFilters';
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
    const [filteredPrograms, setFilteredPrograms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDocumentViewOpen, setIsDocumentViewOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<any>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [queryMode, setQueryMode] = useState<'view' | 'reply' | 'ask'>('ask');

    // Filter states
    const [filters, setFilters] = useState({
        status: '',
        budget: ''
    });

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
                // Sort by createdAt descending (newest first)
                const sortedData = data.sort((a: any, b: any) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setPrograms(sortedData);
                setFilteredPrograms(sortedData);
            } catch (error) {
                console.error('Failed to fetch programs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrograms();
    }, [userId, userName, navigate, refreshTrigger]);

    // Apply filters
    useEffect(() => {
        let result = [...programs];

        if (filters.status) {
            result = result.filter(p => p.status.toLowerCase() === filters.status.toLowerCase());
        }

        if (filters.budget) {
            result = result.filter(p => {
                const budget = p.budget || 0;
                if (filters.budget === 'low') return budget < 10000;
                if (filters.budget === 'medium') return budget >= 10000 && budget <= 100000;
                if (filters.budget === 'high') return budget > 100000;
                return true;
            });
        }

        setFilteredPrograms(result);
    }, [programs, filters]);

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

    const handleQuery = (program: any) => {
        setSelectedProgram(program);
        if (program.status === 'Query') {
            setQueryMode('view');
        } else {
            setQueryMode('ask');
        }
        setIsQueryModalOpen(true);
    };

    const handleQuerySubmit = async (message: string) => {
        if (!selectedProgram) return;

        try {
            const formData = new FormData();
            formData.append('status', 'Query');
            formData.append('message', message);

            await programService.updateProgram(selectedProgram._id, formData);
            setRefreshTrigger(prev => prev + 1);
            setIsQueryModalOpen(false);
            setSelectedProgram(null);
        } catch (error) {
            console.error('Failed to submit query:', error);
        }
    };

    const handleAccept = (program: any) => {
        setSelectedProgram(program);
        setIsAcceptModalOpen(true);
    };

    const handleConfirmAccept = async (remarks: string) => {
        if (!selectedProgram) return;

        try {
            const formData = new FormData();
            formData.append('status', 'Completed');
            formData.append('message', remarks || 'Program accepted by Finance');

            await programService.updateProgram(selectedProgram._id, formData);
            setRefreshTrigger(prev => prev + 1);
            setIsAcceptModalOpen(false);
            setSelectedProgram(null);
        } catch (error) {
            console.error('Failed to accept program:', error);
        }
    };

    const handleReject = (program: any) => {
        setSelectedProgram(program);
        setIsRejectModalOpen(true);
    };

    const handleConfirmReject = async (reason: string) => {
        if (!selectedProgram) return;

        try {
            const formData = new FormData();
            formData.append('status', 'Rejected');
            formData.append('message', reason);

            await programService.updateProgram(selectedProgram._id, formData);
            setRefreshTrigger(prev => prev + 1);
            setIsRejectModalOpen(false);
            setSelectedProgram(null);
        } catch (error) {
            console.error('Failed to reject program:', error);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
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
                <ProgramFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={() => setFilters({ status: '', budget: '' })}
                />
                <ProgramList
                    programs={filteredPrograms}
                    isLoading={isLoading}
                    onViewDocuments={handleOpenDocumentView}
                    onViewDetails={handleOpenDetailModal}
                    onQuery={handleQuery}
                    onAccept={handleAccept}
                    onReject={handleReject}
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

            <QueryModal
                isOpen={isQueryModalOpen}
                onClose={() => {
                    setIsQueryModalOpen(false);
                    setSelectedProgram(null);
                }}
                program={selectedProgram}
                mode={queryMode}
                onSubmit={handleQuerySubmit}
            />

            <AcceptProgramModal
                isOpen={isAcceptModalOpen}
                onClose={() => {
                    setIsAcceptModalOpen(false);
                    setSelectedProgram(null);
                }}
                onConfirm={handleConfirmAccept}
                programName={selectedProgram?.name || ''}
            />

            <RejectProgramModal
                isOpen={isRejectModalOpen}
                onClose={() => {
                    setIsRejectModalOpen(false);
                    setSelectedProgram(null);
                }}
                onConfirm={handleConfirmReject}
                programName={selectedProgram?.name || ''}
            />
        </div>
    );
};

export default UserProgramsView;
