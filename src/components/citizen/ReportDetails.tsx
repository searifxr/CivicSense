import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Sparkles, CheckCircle, X, Loader, Zap, TrendingUp } from 'lucide-react';
import type { Report } from '../../App';
import { getAISuggestions, type AISuggestion } from '../../services/aiService';

interface CitizenReportDetailsProps {
  photo?: string;
  onSubmit: (report: Partial<Report>) => void;
  onBack: () => void;
}

const categories = [
  { name: 'Vandalism', color: 'bg-red-500', textColor: 'text-red-700', borderColor: 'border-red-500' },
  { name: 'Litter', color: 'bg-yellow-500', textColor: 'text-yellow-700', borderColor: 'border-yellow-500' },
  { name: 'Graffiti', color: 'bg-purple-500', textColor: 'text-purple-700', borderColor: 'border-purple-500' },
  { name: 'Infrastructure Issue', color: 'bg-blue-500', textColor: 'text-blue-700', borderColor: 'border-blue-500' },
  { name: 'Overgrowth', color: 'bg-green-500', textColor: 'text-green-700', borderColor: 'border-green-500' },
  { name: 'Other', color: 'bg-gray-500', textColor: 'text-gray-700', borderColor: 'border-gray-500' }
];

export function CitizenReportDetails({ photo, onSubmit, onBack }: CitizenReportDetailsProps) {
  const [selectedCategory, setSelectedCategory] = useState('Other');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Current Location');
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);

  const handleGetAISuggestion = async () => {
    if (!description.trim()) {
      setAiError('Please describe the issue first');
      return;
    }

    setLoadingAI(true);
    setAiError('');
    try {
      const suggestion = await getAISuggestions(description);
      setAiSuggestion(suggestion);
      setShowAiPanel(true);
    } catch (err) {
      setAiError('Failed to get AI suggestion. Make sure Ollama is running on port 11434.');
      console.error('AI suggestion error:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleAcceptSuggestion = () => {
    if (aiSuggestion) {
      setSelectedCategory(aiSuggestion.category);
      setDescription(aiSuggestion.description);
      setShowAiPanel(false);
      setAiSuggestion(null);
    }
  };

  const handleRejectSuggestion = () => {
    setShowAiPanel(false);
    setAiSuggestion(null);
  };

  const handleSubmit = () => {
    onSubmit({
      photo,
      category: selectedCategory,
      description,
      location,
      coordinates: { lat: 40.7128, lng: -74.0060 }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-2xl text-green-800">Report Details</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Photo Preview */}
        {photo && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={photo} alt="Report" className="w-full h-64 object-cover" />
          </div>
        )}

        {/* Category Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-green-800">Select Category</h2>
            {selectedCategory !== 'Other' && (
              <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Selected
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                  selectedCategory === category.name
                    ? `${category.borderColor} ${category.color} bg-opacity-20 shadow-md`
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className={`w-8 h-8 ${category.color} rounded-full mx-auto mb-2 shadow-sm`} />
                <span className={`text-sm font-medium ${
                  selectedCategory === category.name ? category.textColor : 'text-gray-700'
                }`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-green-800">Describe the Issue</h2>
            {description.trim() && (
              <button
                onClick={handleGetAISuggestion}
                disabled={loadingAI}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-white rounded-lg transition-all text-sm font-medium"
              >
                {loadingAI ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    AI Suggestion
                  </>
                )}
              </button>
            )}
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows={4}
            placeholder="Describe the issue..."
          />
          {aiError && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {aiError}
            </div>
          )}
        </div>

        {/* AI Suggestion Panel */}
        {showAiPanel && aiSuggestion && (
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-xl p-6 border-2 border-green-200 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-bold text-green-800">AI Suggestion</h3>
              </div>
              <button
                onClick={handleRejectSuggestion}
                className="p-1 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Confidence Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Confidence</span>
                <span className="text-sm font-bold text-green-600">{Math.round(aiSuggestion.confidence * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${aiSuggestion.confidence * 100}%` }}
                />
              </div>
            </div>

            {/* Category Suggestion */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Suggested Category</p>
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-2 border-green-200">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="font-bold text-green-700">{aiSuggestion.category}</span>
              </div>
            </div>

            {/* Improved Description */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Improved Description</p>
              <p className="text-gray-700 bg-white p-3 rounded-xl border border-gray-200">
                {aiSuggestion.description}
              </p>
            </div>

            {/* Reasoning */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Why This Category?</p>
              <p className="text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-200 italic">
                {aiSuggestion.reasoning}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAcceptSuggestion}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition-colors font-medium"
              >
                <CheckCircle className="w-5 h-5" />
                Accept Suggestion
              </button>
              <button
                onClick={handleRejectSuggestion}
                className="flex-1 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl transition-colors font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Location */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-green-600" />
            <h2 className="text-green-800">Location</h2>
          </div>
          <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center mb-4">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-gray-600">Map Preview</p>
              <p className="text-sm text-gray-500">{location}</p>
            </div>
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter location"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl transition-colors shadow-lg"
        >
          Submit Report
        </button>
      </div>
    </div>
  );
}
