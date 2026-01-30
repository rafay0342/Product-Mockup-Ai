
import React from 'react';

interface LogoUploaderProps {
  onUpload: (base64: string) => void;
  currentLogo: string | null;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({ onUpload, currentLogo }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onUpload(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">1. Upload Your Logo</h3>
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 transition-colors cursor-pointer relative">
        {currentLogo ? (
          <div className="relative group">
            <img src={currentLogo} alt="Logo preview" className="max-h-32 object-contain" />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition-opacity">
              <span className="text-white text-xs font-medium">Change Logo</span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2 text-gray-300">🖼️</div>
            <p className="text-sm text-gray-500">Drop your PNG/JPG logo here or click to browse</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <p className="mt-2 text-xs text-gray-400 text-center">Best results with high-resolution transparent PNGs</p>
    </div>
  );
};
