import { useState } from 'react';
import { X, Send } from 'lucide-react';

interface SubmitProgramModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => Promise<void>;
    programName: string;
}

const SubmitProgramModal = ({ isOpen, onClose, onSubmit, programName }: SubmitProgramModalProps) => {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await onSubmit();
            onClose();
        } catch (error) {
            console.error('Failed to submit program:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Submit Program for Review
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Send size={24} className="text-primary" />
                        </div>
                        <div>
                            <h4 className="font-medium text-slate-900 mb-2">Confirm Submission</h4>
                            <p className="text-sm text-slate-600">
                                Are you sure you want to submit <span className="font-semibold">"{programName}"</span> for review?
                            </p>
                            <p className="text-sm text-slate-500 mt-2">
                                Once submitted, the program status will change to "Under Review" and will be reviewed by the finance team.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center gap-2 cursor-pointer min-w-[120px] justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    <span>Submit</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitProgramModal;
