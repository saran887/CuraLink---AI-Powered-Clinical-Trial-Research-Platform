import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import Toast from '../components/Toast';

function PatientOnboard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    city: '',
    country: '',
    condition: '',
    symptoms: ''
  });
  const [toast, setToast] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAIAnalysis = async () => {
    if (!formData.symptoms || formData.symptoms.trim().length < 10) {
      setToast({ message: 'Please describe your symptoms in more detail', type: 'error' });
      return;
    }

    setAiLoading(true);
    try {
      const result = await api.extractConditions(formData.symptoms);
      setAiSuggestion(result.conditions);
      
      // Auto-fill condition if empty
      if (!formData.condition && result.conditions) {
        setFormData({ ...formData, condition: result.conditions });
      }
      
      setToast({ 
        message: `🤖 AI detected: ${result.conditions}`, 
        type: 'success' 
      });
    } catch (error) {
      console.error('AI analysis failed:', error);
      setToast({ 
        message: 'AI analysis unavailable. Please enter condition manually.', 
        type: 'info' 
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await api.createUser({
        ...formData,
        role: 'patient'
      });
      localStorage.setItem('user', JSON.stringify(user));
      setToast({ message: 'Welcome to CuraLink!', type: 'success' });
      setTimeout(() => navigate('/patient/dashboard'), 1500);
    } catch (error) {
      setToast({ message: 'Failed to create account', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👤</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Onboarding</h1>
            <p className="text-gray-600">Let's personalize your experience</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Your Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email (Optional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors"
                placeholder="john@example.com"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors"
                  placeholder="USA"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Primary Condition/Interest *</label>
              <input
                type="text"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors"
                placeholder="e.g., Diabetes, Cancer, Alzheimer's, Heart Disease"
              />
              <p className="text-sm text-gray-500 mt-1">This helps us personalize your recommendations</p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Symptoms (Optional - Natural Language)</label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors"
                placeholder="Describe your symptoms or medical history in your own words..."
              />
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAIAnalysis}
                  disabled={aiLoading || !formData.symptoms}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {aiLoading ? (
                    <>
                      <span className="animate-spin">⚡</span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <span>🤖</span>
                      AI: Detect Condition
                    </>
                  )}
                </button>
                {aiSuggestion && (
                  <span className="text-sm text-green-600 font-medium">
                    ✅ Detected: {aiSuggestion}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Try AI to automatically detect your condition from symptoms
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white px-6 py-4 rounded-xl hover:bg-secondary transition-colors font-bold text-lg shadow-lg hover:shadow-xl"
            >
              Continue to Dashboard →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PatientOnboard;
