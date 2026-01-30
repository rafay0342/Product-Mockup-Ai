
import React, { useState, useCallback } from 'react';
import { LogoUploader } from './components/LogoUploader';
import { ProductGrid } from './components/ProductGrid';
import { MockupPreview } from './components/MockupPreview';
import { generateMockup, editMockup } from './services/geminiService';
import { AppStatus, MockupResult, ProductType } from './types';
import { APP_TITLE, APP_SUBTITLE } from './constants';

const App: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [mockup, setMockup] = useState<MockupResult | null>(null);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleLogoUpload = (base64: string) => {
    setLogo(base64);
    setMockup(null); // Clear previous results when logo changes
    setError(null);
  };

  const handleProductSelect = async (product: ProductType) => {
    setSelectedProduct(product);
    if (!logo) {
      setError("Please upload a logo first!");
      return;
    }

    setStatus(AppStatus.GENERATING);
    setError(null);
    
    try {
      const imageUrl = await generateMockup(logo, product.name);
      setMockup({
        id: crypto.randomUUID(),
        productId: product.id,
        imageUrl,
        prompt: product.name,
        timestamp: Date.now()
      });
      setStatus(AppStatus.IDLE);
    } catch (err) {
      console.error(err);
      setError("Failed to generate mockup. Please try again.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleAIEmit = async (editPrompt: string) => {
    if (!mockup) return;

    setStatus(AppStatus.EDITING);
    setError(null);

    try {
      const updatedImageUrl = await editMockup(mockup.imageUrl, editPrompt);
      setMockup({
        ...mockup,
        imageUrl: updatedImageUrl,
        timestamp: Date.now()
      });
      setStatus(AppStatus.IDLE);
    } catch (err) {
      console.error(err);
      setError("Failed to edit mockup. Please try again.");
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">{APP_TITLE}</h1>
          </div>
          <div className="hidden md:block text-sm text-gray-500 font-medium">
            Powered by <span className="text-blue-500 font-semibold">Gemini 2.5 Flash Image</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">{APP_SUBTITLE}</h2>
          <p className="text-gray-500 mt-2">Create, customize, and export high-quality merch mockups in seconds.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-6">
            <LogoUploader onUpload={handleLogoUpload} currentLogo={logo} />
            <ProductGrid 
              selectedId={selectedProduct?.id || null} 
              onSelect={handleProductSelect} 
            />
          </div>

          {/* Right Column: Preview Area */}
          <div className="lg:col-span-8">
            <MockupPreview 
              status={status} 
              mockup={mockup} 
              onEdit={handleAIEmit} 
            />
            
            {/* Features Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-blue-500 mb-1">✨ Realistic Lighting</div>
                <p className="text-xs text-gray-500">AI automatically calculates shadows and reflections for your logo.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-purple-500 mb-1">🪄 AI Smart Edits</div>
                <p className="text-xs text-gray-500">Change backgrounds, add filters, or modify scenes with simple text prompts.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-green-500 mb-1">🚀 High Res Output</div>
                <p className="text-xs text-gray-500">Export crystal clear mockups ready for your social media or online store.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-400 text-sm">
        <p>© 2024 {APP_TITLE} • Created with Google Gemini SDK</p>
      </footer>
    </div>
  );
};

export default App;
