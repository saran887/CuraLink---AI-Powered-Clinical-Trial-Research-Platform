import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

function HealthExperts() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchCondition, setSearchCondition] = useState('');
  const [showMeetingForm, setShowMeetingForm] = useState(null);
  const [meetingData, setMeetingData] = useState({
    message: '',
    contact_info: ''
  });
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.role !== 'patient') {
      navigate('/');
      return;
    }
    setUser(userData);
    loadExperts(userData.condition);
  }, [navigate]);

  const loadExperts = async (condition = null) => {
    try {
      const data = await api.getHealthExperts(condition);
      setExperts(data);
    } catch (error) {
      console.error('Error loading experts:', error);
      setToast({ message: 'Failed to load experts', type: 'error' });
    }
    setLoading(false);
  };

  const handleAIMatch = async () => {
    if (!user.condition) {
      setToast({ message: 'Please set your condition in profile', type: 'error' });
      return;
    }

    setAiLoading(true);
    try {
      const result = await api.matchExperts(user.condition, user.symptoms || '');
      setAiRecommendation(result);
      setToast({ 
        message: '🤖 AI generated specialty recommendations!', 
        type: 'success' 
      });
    } catch (error) {
      console.error('AI matching failed:', error);
      setToast({ 
        message: 'AI matching unavailable', 
        type: 'info' 
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    loadExperts(searchCondition);
  };

  const handleFollow = async (expertId) => {
    try {
      await api.createConnection({
        requester_id: user.id,
        receiver_id: expertId,
        connection_type: 'follow'
      });
      setToast({ message: 'Follow request sent!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to send follow request', type: 'error' });
    }
  };

  const handleMeetingRequest = async (expertId) => {
    try {
      await api.createMeetingRequest({
        requester_id: user.id,
        expert_id: expertId,
        message: meetingData.message,
        contact_info: meetingData.contact_info
      });
      setToast({ message: 'Meeting request sent!', type: 'success' });
      setShowMeetingForm(null);
      setMeetingData({ message: '', contact_info: '' });
    } catch (error) {
      setToast({ message: error.response?.data?.detail || 'Failed to send meeting request', type: 'error' });
    }
  };

  if (loading) {
    return <Loader text="Loading health experts..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-2">Health Experts 👨‍⚕️</h1>
          <p className="text-teal-100 text-lg">
            Connect with leading researchers and specialists
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by condition or specialty..."
              value={searchCondition}
              onChange={(e) => setSearchCondition(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-teal-600 text-white px-8 py-3 rounded-xl hover:bg-teal-700 transition-colors font-semibold"
            >
              Search
            </button>
          </div>

          {/* AI Recommendation Button */}
          <div className="border-t pt-4">
            <button
              onClick={handleAIMatch}
              disabled={aiLoading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {aiLoading ? (
                <>
                  <span className="animate-spin">⚡</span>
                  AI Analyzing...
                </>
              ) : (
                <>
                  <span>🤖</span>
                  Get AI Expert Recommendations
                </>
              )}
            </button>
            
            {aiRecommendation && (
              <div className="mt-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
                <p className="font-semibold text-purple-900 mb-2">
                  🎯 AI Recommended Specialties:
                </p>
                <p className="text-purple-800 font-medium mb-2">
                  {aiRecommendation.recommended_specialties}
                </p>
                {aiRecommendation.explanation && (
                  <p className="text-sm text-purple-600">
                    💡 {aiRecommendation.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Experts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map(expert => (
            <div key={expert.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">👨‍⚕️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{expert.name}</h3>
                  <p className="text-sm text-gray-500">{expert.location || 'Global'}</p>
                </div>
              </div>

              {expert.specialties && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Specialties:</p>
                  <p className="text-sm text-gray-600">{expert.specialties}</p>
                </div>
              )}

              {expert.research_interests && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Research Interests:</p>
                  <p className="text-sm text-gray-600">{expert.research_interests}</p>
                </div>
              )}

              {expert.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{expert.bio}</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleFollow(expert.id)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  ➕ Follow
                </button>
                {expert.meeting_availability && (
                  <button
                    onClick={() => setShowMeetingForm(expert.id)}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    📅 Request Meeting
                  </button>
                )}
              </div>

              {/* Meeting Request Form */}
              {showMeetingForm === expert.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Request Meeting</h4>
                  <textarea
                    placeholder="Your message..."
                    value={meetingData.message}
                    onChange={(e) => setMeetingData({...meetingData, message: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Your contact info (email/phone)"
                    value={meetingData.contact_info}
                    onChange={(e) => setMeetingData({...meetingData, contact_info: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMeetingRequest(expert.id)}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors text-sm"
                    >
                      Send Request
                    </button>
                    <button
                      onClick={() => setShowMeetingForm(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {experts.length === 0 && (
            <div className="col-span-3 bg-white rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <p className="text-gray-600">No experts found. Try a different search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HealthExperts;
