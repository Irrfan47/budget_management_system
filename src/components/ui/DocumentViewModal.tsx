import { X, Eye, Download, FileText } from 'lucide-react';

interface DocumentViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    documents: any[];
    programName: string;
}

const DocumentViewModal = ({ isOpen, onClose, documents, programName }: DocumentViewModalProps) => {
    if (!isOpen) return null;

    const handleViewDocument = (documentPath: string) => {
        // Open document in new tab
        const fullUrl = `http://localhost:5000${documentPath}`;
        window.open(fullUrl, '_blank');
    };

    const handleDownloadDocument = (documentPath: string, originalName: string) => {
        // Download document
        const fullUrl = `http://localhost:5000${documentPath}`;
        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            Program Documents
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">{programName}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {documents.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText size={48} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-slate-500">No documents available</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {documents.map((doc, index) => (
                                <div
                                    key={doc._id || index}
                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <FileText size={20} className="text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 truncate">
                                                {doc.originalName}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                        <button
                                            onClick={() => handleViewDocument(doc.path)}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer font-medium"
                                            title="View in new tab"
                                        >
                                            <Eye size={16} />
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDownloadDocument(doc.path, doc.originalName)}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer font-medium"
                                            title="Download document"
                                        >
                                            <Download size={16} />
                                            Download
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentViewModal;
