import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface AcceptProgramModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (remarks: string) => void;
    programName: string;
}

const AcceptProgramModal = ({ isOpen, onClose, onConfirm, programName }: AcceptProgramModalProps) => {
    const [remarks, setRemarks] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(remarks);
        setRemarks('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900">Accept Program</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg">
                        <CheckCircle size={24} className="flex-shrink-0" />
                        <p className="text-sm">
                            Are you sure you want to accept <strong>{programName}</strong>? This will mark the program as <strong>Completed</strong>.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Remarks (Optional)
                        </label>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all resize-none h-24"
                            placeholder="Add any final remarks..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                        >
                            Confirm Accept
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AcceptProgramModal;
