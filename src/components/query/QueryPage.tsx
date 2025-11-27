import { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle } from 'lucide-react';
import ProgramList from '../programs/ProgramList';
import EditProgramModal from '../ui/EditProgramModal';
import QueryModal from '../ui/QueryModal';
import ProgramDetailModal from '../ui/ProgramDetailModal';
import DocumentViewModal from '../ui/DocumentViewModal';
import { programService } from '../../services/api';

const QueryPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeQueries, setActiveQueries] = useState<any[]>([]);
    const [queryHistory, setQueryHistory] = useState<any[]>([]);

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDocumentViewOpen, setIsDocumentViewOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<any>(null);
    const [queryMode, setQueryMode] = useState<'view' | 'reply'>('view');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const data = await programService.getPrograms();

                // Filter programs
                const active = data.filter((p: any) => p.status === 'Query');
                const history = data.filter((p: any) =>
                    p.status !== 'Query' &&
                    p.history &&
                    p.history.some((h: any) => h.status === 'Query')
                );

                setActiveQueries(active);
                setQueryHistory(history);
            } catch (error) {
                console.error('Failed to fetch programs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrograms();
    }, [refreshTrigger]);

    const handleResolveQuery = (program: any) => {
        setSelectedProgram(program);
        // First open edit modal to fix issues
        setIsEditModalOpen(true);
    };

    const handleEditSave = async (programData: FormData) => {
        if (!selectedProgram) return;

        try {
            // Update program details
            await programService.updateProgram(selectedProgram._id, programData);
            setIsEditModalOpen(false);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Failed to update program:', error);
        }
    };

    const handleQuerySubmit = async (message: string) => {
        if (!selectedProgram) return;

        try {
            const formData = new FormData();
            formData.append('status', 'Query Answered');
            formData.append('message', message);

            await programService.updateProgram(selectedProgram._id, formData);
            setRefreshTrigger(prev => prev + 1);
            setIsQueryModalOpen(false);
            setSelectedProgram(null);
        } catch (error) {
            console.error('Failed to submit query response:', error);
        }
    };

    const handleViewHistory = (program: any) => {
        setSelectedProgram(program);
        setQueryMode('view');
        setIsQueryModalOpen(true);
    };

    const handleViewDetails = (program: any) => {
        setSelectedProgram(program);
        setIsDetailModalOpen(true);
    };

    const handleViewDocuments = (program: any) => {
        setSelectedProgram(program);
        setIsDocumentViewOpen(true);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Query Management</h2>
                <p className="text-slate-500 text-sm mt-1">Respond to queries and view history</p>
            </div>

            {/* Active Queries Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-600">
                    <MessageSquare size={20} />
                    <h3 className="text-lg font-semibold">Active Queries</h3>
                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {activeQueries.length}
                    </span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {activeQueries.length > 0 ? (
                        <ProgramList
                            programs={activeQueries}
                            isLoading={isLoading}
                            onEdit={handleResolveQuery} // "Resolve" action -> Edit Program
                            onQuery={(program) => {
                                setSelectedProgram(program);
                                setQueryMode('reply');
                                setIsQueryModalOpen(true);
                            }}
                            onViewDetails={handleViewDetails}
                            onViewDocuments={handleViewDocuments}
                        />
                    ) : (
                        <div className="p-8 text-center text-slate-500">
                            No active queries found. Great job!
                        </div>
                    )}
                </div>
            </div>

            {/* Query History Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-600">
                    <CheckCircle size={20} />
                    <h3 className="text-lg font-semibold">Query History</h3>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <ProgramList
                        programs={queryHistory}
                        isLoading={isLoading}
                        onViewDetails={handleViewDetails}
                        onViewDocuments={handleViewDocuments}
                        onViewHistory={handleViewHistory}
                    />
                </div>
            </div>

            {/* Modals */}
            <EditProgramModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedProgram(null);
                }}
                onSave={handleEditSave}
                programData={selectedProgram}
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

            <ProgramDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedProgram(null);
                }}
                program={selectedProgram}
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
        </div>
    );
};

export default QueryPage;
