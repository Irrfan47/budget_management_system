import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ProgramList from '../ProgramList';
import NewProgramModal from '../../ui/NewProgramModal';
import EditProgramModal from '../../ui/EditProgramModal';
import SubmitProgramModal from '../../ui/SubmitProgramModal';
import DocumentViewModal from '../../ui/DocumentViewModal';
import ProgramDetailModal from '../../ui/ProgramDetailModal';
import { programService } from '../../../services/api';

const UserProgramView = () => {
    const [programs, setPrograms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isDocumentViewOpen, setIsDocumentViewOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<any>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const data = await programService.getPrograms();
                setPrograms(data);
            } catch (error) {
                console.error('Failed to fetch programs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrograms();
    }, [refreshTrigger]);

    const handleCreateProgram = async (programData: FormData) => {
        try {
            await programService.createProgram(programData);
            setRefreshTrigger(prev => prev + 1);
            setIsNewModalOpen(false);
        } catch (error) {
            console.error('Failed to create program:', error);
            throw error;
        }
    };

    const handleEditProgram = async (programData: FormData) => {
        if (!selectedProgram) return;

        try {
            await programService.updateProgram(selectedProgram._id, programData);
            setRefreshTrigger(prev => prev + 1);
            setIsEditModalOpen(false);
            setSelectedProgram(null);
        } catch (error) {
            console.error('Failed to update program:', error);
            throw error;
        }
    };

    const handleOpenEditModal = (program: any) => {
        setSelectedProgram(program);
        setIsEditModalOpen(true);
    };

    const handleOpenSubmitModal = (program: any) => {
        setSelectedProgram(program);
        setIsSubmitModalOpen(true);
    };

    const handleOpenDocumentView = (program: any) => {
        setSelectedProgram(program);
        setIsDocumentViewOpen(true);
    };

    const handleOpenDetailModal = (program: any) => {
        setSelectedProgram(program);
        setIsDetailModalOpen(true);
    };

    const handleSubmitProgram = async () => {
        if (!selectedProgram) return;

        try {
            // Update program status to "Under Review"
            const formData = new FormData();
            formData.append('status', 'Under Review');

            await programService.updateProgram(selectedProgram._id, formData);
            setRefreshTrigger(prev => prev + 1);
            setIsSubmitModalOpen(false);
            setSelectedProgram(null);
        } catch (error) {
            console.error('Failed to submit program:', error);
            throw error;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">My Programs</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage your budget programs</p>
                </div>
                <button
                    onClick={() => setIsNewModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 cursor-pointer"
                >
                    <Plus size={16} />
                    New Program
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <ProgramList
                    programs={programs}
                    isLoading={isLoading}
                    onEdit={handleOpenEditModal}
                    onSubmit={handleOpenSubmitModal}
                    onViewDocuments={handleOpenDocumentView}
                    onViewDetails={handleOpenDetailModal}
                />
            </div>

            <NewProgramModal
                isOpen={isNewModalOpen}
                onClose={() => setIsNewModalOpen(false)}
                onSave={handleCreateProgram}
            />

            <EditProgramModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedProgram(null);
                }}
                onSave={handleEditProgram}
                programData={selectedProgram}
            />

            <SubmitProgramModal
                isOpen={isSubmitModalOpen}
                onClose={() => {
                    setIsSubmitModalOpen(false);
                    setSelectedProgram(null);
                }}
                onSubmit={handleSubmitProgram}
                programName={selectedProgram?.name || ''}
            />

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

export default UserProgramView;
