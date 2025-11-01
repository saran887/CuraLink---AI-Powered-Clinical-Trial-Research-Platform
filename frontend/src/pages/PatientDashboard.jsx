import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';

function PatientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trials, setTrials] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.role !== 'patient') {
      navigate('/');
      return;
    }
    setUser(userData);
    loadData(userData);
  }, [navigate]);

  const loadData = async (userData) => {
    try {
      // Load both internal and external trials
      const [internalTrials, externalTrials, internalPubs, externalPubs] = await Promise.all([
        api.getTrials(userData.condition),
        api.searchClinicalTrials(userData.condition, 'Recruiting', 6),
        api.getPublications(),
        api.searchPubMed(userData.condition, 6)
      ]);
      
      // Combine and format trials
      const formattedExternalTrials = externalTrials.map((trial, index) => ({
        id: `ext-trial-${trial.nct_id || index}`,
        title: trial.title,
        condition: trial.condition,
        phase: trial.phase,
        location: trial.location,
        description: trial.description,
        url: trial.url,
        external: true
      }));
      
      setTrials([...internalTrials, ...formattedExternalTrials]);
      
      // Combine and format publications
      const formattedExternalPubs = externalPubs.map((pub, index) => ({
        id: `ext-pub-${pub.pmid || index}`,
        title: pub.title,
        summary: pub.abstract || 'No abstract available',
        authors: pub.authors,
        journal: pub.journal,
        url: pub.url,
        external: true
      }));
      
      setPublications([...internalPubs, ...formattedExternalPubs]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleSummarize = async (text) => {
    const result = await api.summarizeText(text);
    return result.summary;
  };

  if (loading) {
    return <Loader text="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-blue-100 text-lg">
            Here are personalized clinical trials and research for <span className="font-semibold">{user?.condition}</span>
          </p>
        </div>

        {/* Clinical Trials Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">🔬 Recommended Clinical Trials</h2>
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
              {trials.length} trials found
            </span>
          </div>
          
          {trials.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <p className="text-gray-600">No trials found for your condition yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trials.map(trial => (
                <Card 
                  key={trial.id} 
                  item={trial} 
                  type="trial" 
                  onSummarize={handleSummarize}
                />
              ))}
            </div>
          )}
        </div>

        {/* Publications Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">📚 Latest Research Publications</h2>
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold">
              {publications.length} publications
            </span>
          </div>
          
          {publications.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <p className="text-gray-600">No publications available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications.slice(0, 6).map(pub => (
                <Card 
                  key={pub.id} 
                  item={pub} 
                  type="publication" 
                  onSummarize={handleSummarize}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/patient/experts')}
              className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
            >
              👨‍⚕️ Find Health Experts
            </button>
            <button 
              onClick={() => navigate('/forum')}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              💬 Join Forum Discussion
            </button>
            <button 
              onClick={() => navigate('/favorites')}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              ❤️ View Saved Items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
