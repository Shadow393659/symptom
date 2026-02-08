
import React, { useState, useCallback } from 'react';
import { SymptomQuery, LoadingStatus } from './types';
import { getHealthEducation } from './services/geminiService';
import { ResultSection } from './components/ResultSection';

const App: React.FC = () => {
  const [formData, setFormData] = useState<SymptomQuery>({
    symptom: '',
    duration: '',
    context: ''
  });
  const [status, setStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.symptom || !formData.duration) {
      setError("Please provide at least the symptom and its duration.");
      return;
    }

    setStatus(LoadingStatus.LOADING);
    setError(null);
    setResult(null);

    try {
      const educationalContent = await getHealthEducation(formData);
      setResult(educationalContent);
      setStatus(LoadingStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setStatus(LoadingStatus.ERROR);
    }
  };

  const resetForm = () => {
    setFormData({ symptom: '', duration: '', context: '' });
    setResult(null);
    setStatus(LoadingStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 md:px-0">
      <header className="w-full max-w-3xl mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
            <i className="fa-solid fa-house-medical text-white text-2xl"></i>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Health <span className="text-blue-600">EduGuide</span>
          </h1>
        </div>
        <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
          Get structured, evidence-based educational information about common health symptoms. 
          This tool is for educational purposes only and is not a diagnostic service.
        </p>
      </header>

      <main className="w-full max-w-3xl">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                What is the primary symptom?
              </label>
              <input
                type="text"
                name="symptom"
                value={formData.symptom}
                onChange={handleInputChange}
                placeholder="e.g. Sore throat, Mild headache, Stiff neck"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  How long has it lasted?
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g. 2 days, 3 weeks"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Any general context? (Optional)
                </label>
                <input
                  type="text"
                  name="context"
                  value={formData.context}
                  onChange={handleInputChange}
                  placeholder="e.g. Occurs after meals, worse at night"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={status === LoadingStatus.LOADING}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                  status === LoadingStatus.LOADING 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-blue-200'
                }`}
              >
                {status === LoadingStatus.LOADING ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                    Searching Education Database...
                  </span>
                ) : (
                  'Generate Educational Guide'
                )}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
            <i className="fa-solid fa-circle-exclamation mt-1"></i>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {status === LoadingStatus.SUCCESS && result && (
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Educational Insights</h2>
              <button 
                onClick={resetForm}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <i className="fa-solid fa-rotate-left"></i> Start Over
              </button>
            </div>
            <ResultSection content={result} />
          </div>
        )}

        <footer className="mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
          <p className="mb-4">
            This tool is powered by AI and should be used for informational purposes only. 
            It is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <div className="flex justify-center gap-6">
            <span className="flex items-center gap-1"><i className="fa-solid fa-shield-halved"></i> Secure</span>
            <span className="flex items-center gap-1"><i className="fa-solid fa-user-secret"></i> Anonymous</span>
            <span className="flex items-center gap-1"><i className="fa-solid fa-graduation-cap"></i> Educational</span>
          </div>
        </footer>
      </main>

      {/* Persistent Emergency Callout */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm transform hover:scale-105 transition-transform cursor-help group">
          <div className="bg-white/20 p-2 rounded-full">
            <i className="fa-solid fa-truck-medical text-xl"></i>
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">In an Emergency?</p>
            <p className="text-xs opacity-90 leading-tight mt-0.5">Call your local emergency services (e.g. 911) immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
