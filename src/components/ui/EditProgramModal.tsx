import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import DocumentUpload from './DocumentUpload';
import { programService } from '../../services/api';

interface EditProgramModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (programData: FormData) => Promise<void>;
    programData: any;
}

const EditProgramModal = ({ isOpen, onClose, onSave, programData }: EditProgramModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        budget: '',
        recipientName: '',
        referenceLetter: '',
        status: 'Draft'
    });
    const [documents, setDocuments] = useState<File[]>([]);
    const [existingDocuments, setExistingDocuments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (programData) {
            setFormData({
                name: programData.name || '',
                budget: programData.budget?.toString() || '',
                recipientName: programData.recipientName || '',
                referenceLetter: programData.referenceLetter || '',
                status: programData.status || 'Draft'
            });
            setExistingDocuments(programData.documents || []);
            setDocuments([]);
        }
    }, [programData, isOpen]);

    if (!isOpen) return null;

    const handleDeleteDocument = async (documentId: string) => {
        if (!confirm('Are you sure you want to delete this document?')) {
            return;
        }

        setDeletingDocId(documentId);
        try {
            await programService.deleteDocument(programData._id, documentId);
            // Remove from local state
            setExistingDocuments(prev => prev.filter(doc => doc._id !== documentId));
        } catch (err: any) {
            console.error('Failed to delete document:', err);
            alert(err.response?.data?.message || 'Failed to delete document');
        } finally {
            setDeletingDocId(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('budget', formData.budget);
            formDataToSend.append('recipientName', formData.recipientName);
            formDataToSend.append('referenceLetter', formData.referenceLetter);
            formDataToSend.append('status', formData.status);

            // Append all documents
            documents.forEach((file) => {
                formDataToSend.append('documents', file);
            });

            await onSave(formDataToSend);
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update program. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Edit Program
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Program Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                placeholder="e.g., School Renovation Project"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Budget Allocation ($) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Recipient Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.recipientName}
                                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                placeholder="e.g., John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Reference Letter <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.referenceLetter}
                                onChange={(e) => setFormData({ ...formData, referenceLetter: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                placeholder="e.g., REF-2024-001"
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-200">
                            <DocumentUpload
                                documents={documents}
                                onDocumentsChange={setDocuments}
                            />
                            {existingDocuments.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-slate-700 mb-2">Existing Documents</p>
                                    <div className="space-y-2">
                                        {existingDocuments.map((doc: any) => (
                                            <div key={doc._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <span className="text-xl">📄</span>
                                                    <span className="text-sm text-slate-700 truncate">{doc.originalName}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteDocument(doc._id)}
                                                    disabled={deletingDocId === doc._id}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer disabled:opacity-50 flex-shrink-0"
                                                    title="Delete document"
                                                >
                                                    {deletingDocId === doc._id ? (
                                                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center gap-2 cursor-pointer min-w-[140px] justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <span>Update Program</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProgramModal;
