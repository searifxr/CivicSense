import React, { useRef } from 'react';
import { Camera, Upload, LogOut, Eye } from 'lucide-react';

interface CitizenHomeScreenProps {
  onPhotoCapture: (photo: string) => void;
  onLogout?: () => void;
  onBrowseReports?: () => void;
}

export function CitizenHomeScreen({ onPhotoCapture, onLogout, onBrowseReports }: CitizenHomeScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-2 text-green-800">CivicSense</h1>
          <p className="text-green-700">Report an Issue</p>
        </div>

        {/* Main Action */}
        <div className="space-y-4">
          <button
            onClick={handleTakePhoto}
            className="w-full bg-white rounded-3xl shadow-lg p-12 hover:shadow-xl transition-all group"
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Camera className="w-12 h-12 text-green-600" />
              </div>
              <span className="text-2xl text-green-800">Take a Photo</span>
            </div>
          </button>

          <button
            onClick={handleUpload}
            className="w-full bg-white rounded-3xl shadow-md p-8 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-center gap-3">
              <Upload className="w-6 h-6 text-green-600" />
              <span className="text-green-800">Upload from Device</span>
            </div>
          </button>

          <button
            onClick={onBrowseReports}
            className="w-full bg-blue-50 border-2 border-blue-200 rounded-3xl shadow-md p-8 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-center gap-3">
              <Eye className="w-6 h-6 text-blue-600" />
              <span className="text-blue-800 font-semibold">Browse Reports</span>
            </div>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-green-700">
            Help keep our city clean by reporting issues in your neighborhood
          </p>
        </div>

        {/* Logout Button */}
        {onLogout && (
          <div className="mt-4">
            <button
              onClick={onLogout}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-xl border border-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}