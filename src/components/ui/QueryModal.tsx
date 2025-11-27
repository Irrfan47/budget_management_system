import { useState, useEffect } from 'react';
import { X, Send, MessageSquare, History } from 'lucide-react';
import { authService } from '../../services/api';

interface QueryModalProps {
    isOpen: boolean;
    onClose: () => void;
    program: any;
    mode: 'view' | 'reply' | 'ask';
    onSubmit?: (message: string) => void;
}

const QueryModal = ({ isOpen, onClose, program, mode, onSubmit }: QueryModalProps) => {
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState<any[]>([]);
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        if (program && program.history) {
            // Sort history by date ascending (oldest first, latest at bottom)
            const sortedHistory = [...program.history].sort((a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            );
            setHistory(sortedHistory);
        }
    }, [program]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit && message.trim()) {
            onSubmit(message);
            setMessage('');
        }
    };

    const getTitle = () => {
        switch (mode) {
            case 'ask': return 'Raise Query';
            case 'reply': return 'Reply to Query';
            case 'view': return 'Query History';
            default: return 'Query';
        }
    };

    const getButtonText = () => {
        switch (mode) {
            case 'ask': return 'Submit Query';
            case 'reply': return 'Submit Reply';
            default: return 'Submit';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">{getTitle()}</h3>
                            <p className="text-sm text-slate-500">Program: {program?.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* History Section */}
                    {history.length > 0 ? (
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                <History size={16} />
                                History
                            </h4>
                            <div className="space-y-4">
                                {history.map((item, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${item.updatedBy === currentUser?.id || item.updatedBy?._id === currentUser?.id
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {item.updatedBy === currentUser?.id || item.updatedBy?._id === currentUser?.id ? 'ME' : 'OP'}
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-medium text-slate-500">
                                                    Status: <span className="text-slate-900">{item.status}</span>
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {new Date(item.date).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-slate-700 text-sm whitespace-pre-wrap">{item.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            No history available.
                        </div>
                    )}
                </div>

                {/* Input Section - Only for ask/reply modes */}
                {(mode === 'ask' || mode === 'reply') && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    {mode === 'ask' ? 'Query Message' : 'Your Reply'}
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none h-32"
                                    placeholder={mode === 'ask' ? "Describe the issue or question..." : "Type your response here..."}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                >
                                    <Send size={18} />
                                    {getButtonText()}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QueryModal;
