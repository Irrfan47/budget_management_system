import { useState } from 'react';
import { Camera } from 'lucide-react';
import ChangePhotoModal from '../ui/ChangePhotoModal';
import { authService } from '../../services/api';

const ProfilePhoto = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = authService.getCurrentUser();

    const handleSavePhoto = async (file: File) => {
        const formData = new FormData();
        formData.append('profilePhoto', file);

        // We'll assume authService.updateProfilePhoto handles the API call
        // and returns the updated user object with the new photo URL
        const updatedUser = await authService.updateProfilePhoto(formData);

        // Update local storage
        localStorage.setItem('user', JSON.stringify({ ...user, ...updatedUser }));

        // Force reload to show new image (or we could use a context/state for user)
        window.location.reload();
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Profile Photo</h3>
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden relative group">
                    {user?.profilePicture ? (
                        <img
                            src={`http://localhost:5000${user.profilePicture}`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = ''; // Fallback if image fails
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                            <Camera size={32} />
                        </div>
                    )}

                    {/* Fallback icon container if image fails or doesn't exist */}
                    <div className={`absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400 ${user?.profilePicture ? 'hidden' : ''}`}>
                        <Camera size={32} />
                    </div>
                </div>
                <div>
                    <p className="text-sm text-slate-500 mb-4">
                        Upload a new profile photo. The image should be at least 400×400 pixels.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <Camera size={16} />
                            Change Photo
                        </button>
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            <ChangePhotoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePhoto}
            />
        </div>
    );
};

export default ProfilePhoto;
