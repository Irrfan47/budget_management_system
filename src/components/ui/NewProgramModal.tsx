import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import DocumentUpload from './DocumentUpload.tsx';

interface NewProgramModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (programData: FormData) => Promise<void>;
    initialData?: any;
}

const NewProgramModal = ({ isOpen, onClose, onSave, initialData }: NewProgramModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        budget: '',
        recipientName: '',
        referenceLetter: '',
        status: 'Draft'
    });
    const [documents, setDocuments] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                budget: initialData.budget,
                recipientName: initialData.recipientName,
                referenceLetter: initialData.referenceLetter,
                status: initialData.status
            });
        } else {
            setFormData({
                name: '',
                budget: '',
                recipientName: '',
                referenceLetter: '',
                status: 'Draft'
            });
            setDocuments([]);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

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
            setError(err.response?.data?.message || 'Failed to create program. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <h3 className="text-lg font-semibold text-slate-900">
                        {initialData ? 'Edit Program' : 'New Program'}
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
                                    <span>Creating...</span>
                                </>
                            ) : (
                                <span>{initialData ? 'Update Program' : 'Create Program'}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewProgramModal;
