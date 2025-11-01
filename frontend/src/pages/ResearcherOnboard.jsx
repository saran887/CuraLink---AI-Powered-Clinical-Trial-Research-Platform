import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';

function ResearcherOnboard() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    city: '',
    country: '',
    specialties: '',
    research_interests: '',
    orcid: '',
    researchgate_url: '',
    bio: '',
    meeting_availability: false
  });
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await api.createUser({
        ...formData,
        role: 'researcher'
      });
      localStorage.setItem('user', JSON.stringify(user));
      setToast({ message: 'Welcome to CuraLink!', type: 'success' });
      setTimeout(() => navigate('/researcher/dashboard'), 1500);
    } catch (error) {
      setToast({ message: error.response?.data?.detail || 'Failed to create account', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-12 px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔬</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Researcher Profile Setup</h1>
            <p className="text-gray-600">Help us understand your expertise and research interests</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="Dr. Jane Smith"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="jane.smith@university.edu"
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="Boston"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="USA"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Specialties *</label>
                  <input
                    type="text"
                    name="specialties"
                    value={formData.specialties}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="Oncology, Neurology, Cardiology"
                  />
                  <p className="text-sm text-gray-500 mt-1">Separate multiple specialties with commas</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Research Interests *</label>
                  <input
                    type="text"
                    name="research_interests"
                    value={formData.research_interests}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="Immunotherapy, Clinical AI, Gene Therapy"
                  />
                  <p className="text-sm text-gray-500 mt-1">Separate multiple interests with commas</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="Brief description of your background, research focus, and achievements..."
                  />
                </div>
              </div>
            </div>

            {/* External Profiles (Optional) */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">External Profiles (Optional)</h2>
              <p className="text-sm text-gray-600 mb-4">Link your profiles to auto-import publications</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">ORCID ID</label>
                  <input
                    type="text"
                    name="orcid"
                    value={formData.orcid}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="0000-0002-1825-0097"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">ResearchGate URL</label>
                  <input
                    type="url"
                    name="researchgate_url"
                    value={formData.researchgate_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="https://www.researchgate.net/profile/..."
                  />
                </div>
              </div>
            </div>

            {/* Meeting Availability */}
            <div className="bg-gray-50 rounded-xl p-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="meeting_availability"
                  checked={formData.meeting_availability}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary"
                />
                <div>
                  <span className="font-semibold text-gray-900">Available for patient meetings</span>
                  <p className="text-sm text-gray-600">Allow patients to request meetings with you</p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white px-6 py-4 rounded-xl hover:bg-green-700 transition-colors font-bold text-lg shadow-lg hover:shadow-xl"
            >
              Create Profile & Continue →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResearcherOnboard;
