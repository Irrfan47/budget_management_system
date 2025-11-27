import { Edit2, Send, FileText, Info, MessageSquare, CheckCircle, History, XCircle } from 'lucide-react';
import { authService } from '../../services/api';

interface ProgramListProps {
    programs: any[];
    isLoading?: boolean;
    onEdit?: (program: any) => void;
    onSubmit?: (program: any) => void;
    onViewDocuments?: (program: any) => void;
    onViewDetails?: (program: any) => void;
    onQuery?: (program: any) => void;
    onAccept?: (program: any) => void;
    onReject?: (program: any) => void;
    onViewHistory?: (program: any) => void;
}

const ProgramList = ({ programs, isLoading, onEdit, onSubmit, onViewDocuments, onViewDetails, onQuery, onAccept, onReject, onViewHistory }: ProgramListProps) => {
    const currentUser = authService.getCurrentUser();
    const userRole = currentUser?.role;

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading programs...</div>;
    }

    if (programs.length === 0) {
        return <div className="p-8 text-center text-slate-500">No programs found.</div>;
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'critical': return 'bg-red-100 text-red-700';
            case 'draft': return 'bg-slate-100 text-slate-700';
            case 'under review': return 'bg-blue-100 text-blue-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'query': return 'bg-amber-100 text-amber-700';
            case 'query answered': return 'bg-purple-100 text-purple-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Program Name</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Recipient Name</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reference Letter</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Budget</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Updated</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {programs.map((program) => (
                        <tr key={program._id} className="hover:bg-slate-50 transition-colors group">
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onViewDetails?.(program)}
                                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                                        title="View program details"
                                    >
                                        <Info size={18} />
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-slate-900">{program.name}</div>
                                        <div className="text-xs text-slate-500">ID: {program._id.substring(program._id.length - 6).toUpperCase()}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <span className="text-slate-700">{program.recipientName || '-'}</span>
                            </td>
                            <td className="p-4">
                                <span className="text-slate-700 font-mono text-sm">{program.referenceLetter || '-'}</span>
                            </td>
                            <td className="p-4 font-medium text-slate-700">
                                ${program.budget?.toLocaleString() || 0}
                            </td>
                            <td className="p-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                                    {program.status}
                                </span>
                            </td>
                            <td className="p-4 text-sm text-slate-500">
                                {new Date(program.updatedAt).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    {/* View Documents - Always visible for all roles */}
                                    <button
                                        onClick={() => onViewDocuments?.(program)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer font-medium"
                                        title="View documents"
                                    >
                                        <FileText size={14} />
                                        Documents
                                    </button>

                                    {/* Actions for non-terminal statuses */}
                                    {!['Completed', 'Rejected'].includes(program.status) && (
                                        <>
                                            {/* Edit and Submit - Only for user role with Draft status */}
                                            {userRole === 'user' && program.status === 'Draft' && (
                                                <>
                                                    <button
                                                        onClick={() => onEdit?.(program)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary hover:text-primary/80 hover:bg-primary/5 rounded-lg transition-colors cursor-pointer font-medium"
                                                    >
                                                        <Edit2 size={14} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => onSubmit?.(program)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer font-medium"
                                                    >
                                                        <Send size={14} />
                                                        Submit
                                                    </button>
                                                </>
                                            )}

                                            {/* Finance/Admin Actions */}
                                            {(userRole === 'finance' || userRole === 'admin') && (
                                                <>
                                                    {/* Query Button */}
                                                    {onQuery && (
                                                        <button
                                                            onClick={() => onQuery(program)}
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer font-medium ${program.status === 'Query'
                                                                    ? 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                                                                    : 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                                                                }`}
                                                            title={program.status === 'Query' ? "View Query" : "Raise Query"}
                                                        >
                                                            <MessageSquare size={14} />
                                                            {program.status === 'Query' ? 'View Query' : 'Query'}
                                                        </button>
                                                    )}

                                                    {/* Accept Button - Hide if in Query */}
                                                    {onAccept && program.status !== 'Query' && (
                                                        <button
                                                            onClick={() => onAccept(program)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer font-medium"
                                                            title="Accept Program"
                                                        >
                                                            <CheckCircle size={14} />
                                                            Accept
                                                        </button>
                                                    )}

                                                    {/* Reject Button - Only if Query Answered */}
                                                    {onReject && program.status === 'Query Answered' && (
                                                        <button
                                                            onClick={() => onReject(program)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer font-medium"
                                                            title="Reject Program"
                                                        >
                                                            <XCircle size={14} />
                                                            Reject
                                                        </button>
                                                    )}
                                                </>
                                            )}

                                            {/* User Actions for Query */}
                                            {userRole === 'user' && program.status === 'Query' && (
                                                <>
                                                    {onEdit && (
                                                        <button
                                                            onClick={() => onEdit(program)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer font-medium"
                                                            title="Edit Program Details"
                                                        >
                                                            <Edit2 size={14} />
                                                            Edit
                                                        </button>
                                                    )}
                                                    {onQuery && (
                                                        <button
                                                            onClick={() => onQuery(program)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer font-medium"
                                                            title="Reply to Query"
                                                        >
                                                            <MessageSquare size={14} />
                                                            Reply
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}

                                    {/* View History Action - Always visible if provided */}
                                    {onViewHistory && (
                                        <button
                                            onClick={() => onViewHistory(program)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer font-medium"
                                            title="View Query History"
                                        >
                                            <History size={14} />
                                            History
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProgramList;
