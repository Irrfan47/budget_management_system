import { X, Eye, Download, FileText } from 'lucide-react';

interface ProgramDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    program: any;
}

const ProgramDetailModal = ({ isOpen, onClose, program }: ProgramDetailModalProps) => {
    if (!isOpen || !program) return null;

    const handleViewDocument = (documentPath: string) => {
        const fullUrl = `http://localhost:5000${documentPath}`;
        window.open(fullUrl, '_blank');
    };

    const handleDownloadDocument = (documentPath: string, originalName: string) => {
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
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex justify-between items-center shrink-0">
                    <h3 className="text-2xl font-bold text-slate-900">
                        {program.name}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-2 hover:bg-slate-100 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Two Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Program Name */}
                            <div>
                                <label className="text-sm text-slate-500 mb-1 block">Program Name</label>
                                <p className="text-base text-slate-900 font-medium">{program.name}</p>
                            </div>

                            {/* Recipient Name */}
                            <div>
                                <label className="text-sm text-slate-500 mb-1 block">Recipient Name</label>
                                <p className="text-base text-slate-900 font-medium">{program.recipientName || '-'}</p>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-sm text-slate-500 mb-1 block">Status</label>
                                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded text-sm font-medium">
                                    {program.status}
                                </span>
                            </div>

                            {/* Created Date */}
                            <div>
                                <label className="text-sm text-slate-500 mb-1 block">Created Date</label>
                                <p className="text-base text-slate-900 font-medium">
                                    {new Date(program.createdAt).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Budget */}
                            <div>
                                <label className="text-sm text-slate-500 mb-1 block">Budget (RM)</label>
                                <p className="text-base text-slate-900 font-medium">
                                    RM {program.budget?.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                </p>
                            </div>

                            {/* EXCO Letter Reference */}
                            <div>
                                <label className="text-sm text-slate-500 mb-1 block">EXCO Letter Reference</label>
                                <p className="text-base text-slate-900 font-medium">{program.referenceLetter || '-'}</p>
                            </div>

                            {/* Created By */}
                            <div>
                                <label className="text-sm text-slate-500 mb-1 block">Created By</label>
                                <p className="text-base text-slate-900 font-medium">{program.createdBy?.name || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Documents Section */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <h4 className="text-lg font-semibold text-slate-900 mb-4">Documents</h4>

                        {/* Tab Header */}
                        <div className="border-b border-slate-200 mb-4">
                            <div className="flex items-center gap-2 pb-2 border-b-2 border-primary w-fit">
                                <span className="text-sm font-medium text-primary">Original Documents</span>
                                <span className="text-xs bg-primary text-white rounded-full px-2 py-0.5">
                                    {program.documents?.length || 0}
                                </span>
                            </div>
                        </div>

                        {/* Documents List */}
                        {program.documents && program.documents.length > 0 ? (
                            <div className="space-y-3">
                                {program.documents.map((doc: any, index: number) => (
                                    <div
                                        key={doc._id || index}
                                        className="flex items-start justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                                    >
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <FileText size={20} className="text-slate-400 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900 break-words">
                                                    {doc.originalName}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Uploaded by: {program.createdBy?.name || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                            <button
                                                onClick={() => handleViewDocument(doc.path)}
                                                className="p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                                title="View document"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDownloadDocument(doc.path, doc.originalName)}
                                                className="p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                                title="Download document"
                                            >
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <FileText size={48} className="mx-auto text-slate-300 mb-2" />
                                <p>No documents uploaded</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 flex justify-end shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProgramDetailModal;
