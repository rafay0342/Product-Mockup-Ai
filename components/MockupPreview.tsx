
import React, { useState } from 'react';
import { AppStatus, MockupResult } from '../types';

interface MockupPreviewProps {
  status: AppStatus;
  mockup: MockupResult | null;
  onEdit: (prompt: string) => void;
}

export const MockupPreview: React.FC<MockupPreviewProps> = ({ status, mockup, onEdit }) => {
  const [editPrompt, setEditPrompt] = useState('');

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPrompt.trim() && (status === AppStatus.IDLE || status === AppStatus.ERROR)) {
      onEdit(editPrompt);
      setEditPrompt('');
    }
  };

  const downloadImage = () => {
    if (!mockup) return;
    const link = document.createElement('a');
    link.href = mockup.imageUrl;
    link.download = `merch-mockup-${mockup.productId}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[500px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">3. Preview & Edit</h3>
        {mockup && (
          <button
            onClick={downloadImage}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>📥 Export PNG</span>
          </button>
        )}
      </div>

      <div className="flex-grow relative rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center mb-6">
        {status === AppStatus.GENERATING || status === AppStatus.EDITING ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500 font-medium">
              {status === AppStatus.GENERATING ? "AI is weaving your merch..." : "Applying your edits..."}
            </p>
            <p className="text-xs text-gray-400 mt-1 italic">This usually takes 10-20 seconds</p>
          </div>
        ) : mockup ? (
          <img
            src={mockup.imageUrl}
            alt="Product mockup"
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <div className="text-center px-10">
            <div className="text-5xl mb-4 opacity-20">👕</div>
            <p className="text-gray-400 text-sm">Upload a logo and pick a product to see the magic happen</p>
          </div>
        )}
      </div>

      {mockup && (
        <form onSubmit={handleEditSubmit} className="relative">
          <input
            type="text"
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            disabled={status !== AppStatus.IDLE && status !== AppStatus.ERROR}
            placeholder="Try: 'Change to a sunset background' or 'Add retro filter'..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!editPrompt.trim() || (status !== AppStatus.IDLE && status !== AppStatus.ERROR)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-600 disabled:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </form>
      )}
    </div>
  );
};
