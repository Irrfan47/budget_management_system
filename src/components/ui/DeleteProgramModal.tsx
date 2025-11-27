import { X, AlertTriangle } from 'lucide-react';

interface DeleteProgramModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    programName: string;
    isDeleting?: boolean;
}

const DeleteProgramModal = ({ isOpen, onClose, onConfirm, programName, isDeleting }: DeleteProgramModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3 text-red-600">
                            <div className="p-2 bg-red-50 rounded-lg">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Delete Program</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="mb-6">
                        <p className="text-slate-600">
                            Are you sure you want to delete <span className="font-semibold text-slate-900">"{programName}"</span>?
                        </p>
                        <p className="text-slate-500 text-sm mt-2">
                            This action cannot be undone. All associated data and documents will be permanently removed.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center gap-2"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Program'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteProgramModal;
