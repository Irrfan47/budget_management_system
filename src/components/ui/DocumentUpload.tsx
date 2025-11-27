import { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface DocumentUploadProps {
    documents: File[];
    onDocumentsChange: (files: File[]) => void;
}

const DocumentUpload = ({ documents, onDocumentsChange }: DocumentUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        handleFiles(files);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFiles = (newFiles: File[]) => {
        // Filter for allowed file types
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        const validFiles = newFiles.filter(file => {
            if (!allowedTypes.includes(file.type)) {
                alert(`${file.name} is not a supported file type`);
                return false;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB
                alert(`${file.name} is too large. Maximum size is 10MB`);
                return false;
            }
            return true;
        });

        onDocumentsChange([...documents, ...validFiles]);
    };

    const removeDocument = (index: number) => {
        const newDocuments = documents.filter((_, i) => i !== index);
        onDocumentsChange(newDocuments);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const getFileIcon = (file: File) => {
        if (file.type.includes('pdf')) return '📄';
        if (file.type.includes('word')) return '📝';
        if (file.type.includes('image')) return '🖼️';
        if (file.type.includes('excel') || file.type.includes('spreadsheet')) return '📊';
        return '📎';
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Documents
                </label>
                <p className="text-xs text-slate-500 mb-3">
                    Upload supporting documents (PDF, DOC, DOCX, JPG, PNG, XLS, XLSX - Max 10MB each)
                </p>
            </div>

            <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={triggerFileInput}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                    multiple
                    onChange={handleFileSelect}
                />

                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Upload size={24} className="text-slate-400" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-700">Click to upload or drag and drop</p>
                        <p className="text-xs mt-1">PDF, DOC, DOCX, JPG, PNG, XLS, XLSX</p>
                    </div>
                </div>
            </div>

            {documents.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">
                        Selected Documents ({documents.length})
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {documents.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className="text-2xl flex-shrink-0">{getFileIcon(file)}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate" title={file.name}>
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeDocument(index);
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer flex-shrink-0"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;
