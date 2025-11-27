import { useState, useRef, useCallback } from 'react';
import { X, Upload, Image as ImageIcon, Loader2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';

interface ChangePhotoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (file: File) => Promise<void>;
}

const ChangePhotoModal = ({ isOpen, onClose, onSave }: ChangePhotoModalProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        processFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        processFile(file);
    };

    const processFile = (file: File | undefined) => {
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('File size must be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file');
                return;
            }

            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setZoom(1);
            setCrop({ x: 0, y: 0 });
            setError('');
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile || !previewUrl || !croppedAreaPixels) return;

        setIsLoading(true);
        try {
            const croppedImageBlob = await getCroppedImg(previewUrl, croppedAreaPixels);

            if (croppedImageBlob) {
                const file = new File([croppedImageBlob], "profile_photo.jpg", { type: "image/jpeg" });
                await onSave(file);
                handleClose();
            }
        } catch (err) {
            console.error(err);
            setError('Failed to process and upload photo. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setError('');
        onClose();
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <h3 className="text-lg font-semibold text-slate-900">Change Profile Photo</h3>
                    <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {!previewUrl ? (
                        <div
                            className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={triggerFileInput}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />

                            <div className="flex flex-col items-center gap-3 text-slate-500">
                                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                                    <ImageIcon size={32} className="text-slate-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-700">Click to upload</p>
                                    <p className="text-xs mt-1">or drag and drop SVG, PNG, JPG or GIF</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="relative w-full h-64 bg-slate-900 rounded-xl overflow-hidden">
                                <Cropper
                                    image={previewUrl}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    showGrid={false}
                                    cropShape="round"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-slate-500 font-medium">
                                    <span className="flex items-center gap-1"><ZoomOut size={14} /> Zoom</span>
                                    <span className="flex items-center gap-1"><ZoomIn size={14} /></span>
                                </div>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div className="flex justify-center">
                                <button
                                    onClick={() => setPreviewUrl(null)}
                                    className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                                >
                                    <RotateCcw size={14} /> Choose different image
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedFile || isLoading}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                            Upload Photo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePhotoModal;
