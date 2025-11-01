import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

function ResearcherDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trials, setTrials] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showTrialForm, setShowTrialForm] = useState(false);
  const [showPubForm, setShowPubForm] = useState(false);

  const [trialForm, setTrialForm] = useState({
    title: '',
    condition: '',
    phase: 'Phase I',
    location: '',
    description: ''
  });

  const [pubForm, setPubForm] = useState({
    title: '',
    summary: ''
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      // Create a default researcher for demo
      const defaultUser = { id: 1, name: 'Dr. Smith', role: 'researcher' };
      localStorage.setItem('user', JSON.stringify(defaultUser));
      setUser(defaultUser);
      loadData(defaultUser);
    } else {
      setUser(userData);
      loadData(userData);
    }
  }, []);

  const loadData = async (userData) => {
    try {
      const [trialsData, pubsData] = await Promise.all([
        api.getTrials(),
        api.getPublications()
      ]);
      
      // Filter by researcher if they have an ID
      setTrials(userData.id ? trialsData.filter(t => t.researcher_id === userData.id) : trialsData);
      setPublications(userData.id ? pubsData.filter(p => p.researcher_id === userData.id) : pubsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleCreateTrial = async (e) => {
    e.preventDefault();
    try {
      await api.createTrial({
        ...trialForm,
        researcher_id: user.id
      });
      setToast({ message: 'Trial created successfully!', type: 'success' });
      setShowTrialForm(false);
      setTrialForm({ title: '', condition: '', phase: 'Phase I', location: '', description: '' });
      loadData(user);
    } catch (error) {
      setToast({ message: 'Failed to create trial', type: 'error' });
    }
  };

  const handleCreatePublication = async (e) => {
    e.preventDefault();
    try {
      await api.createPublication({
        ...pubForm,
        researcher_id: user.id
      });
      setToast({ message: 'Publication created successfully!', type: 'success' });
      setShowPubForm(false);
      setPubForm({ title: '', summary: '' });
      loadData(user);
    } catch (error) {
      setToast({ message: 'Failed to create publication', type: 'error' });
    }
  };

  if (loading) {
    return <Loader text="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-2">Researcher Dashboard 🔬</h1>
          <p className="text-green-100 text-lg">
            Welcome, {user?.name}! Manage your trials and publications.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowTrialForm(!showTrialForm)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-semibold"
          >
            ➕ Create New Trial
          </button>
          <button
            onClick={() => setShowPubForm(!showPubForm)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            ➕ Create New Publication
          </button>
        </div>

        {/* Create Trial Form */}
        {showTrialForm && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Clinical Trial</h2>
            <form onSubmit={handleCreateTrial} className="space-y-4">
              <input
                type="text"
                placeholder="Trial Title"
                value={trialForm.title}
                onChange={(e) => setTrialForm({...trialForm, title: e.target.value})}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="Condition"
                value={trialForm.condition}
                onChange={(e) => setTrialForm({...trialForm, condition: e.target.value})}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
              <select
                value={trialForm.phase}
                onChange={(e) => setTrialForm({...trialForm, phase: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              >
                <option>Phase I</option>
                <option>Phase II</option>
                <option>Phase III</option>
                <option>Phase IV</option>
              </select>
              <input
                type="text"
                placeholder="Location"
                value={trialForm.location}
                onChange={(e) => setTrialForm({...trialForm, location: e.target.value})}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
              <textarea
                placeholder="Description"
                value={trialForm.description}
                onChange={(e) => setTrialForm({...trialForm, description: e.target.value})}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
              <button type="submit" className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors font-semibold">
                Create Trial
              </button>
            </form>
          </div>
        )}

        {/* Create Publication Form */}
        {showPubForm && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Publication</h2>
            <form onSubmit={handleCreatePublication} className="space-y-4">
              <input
                type="text"
                placeholder="Publication Title"
                value={pubForm.title}
                onChange={(e) => setPubForm({...pubForm, title: e.target.value})}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
              <textarea
                placeholder="Summary"
                value={pubForm.summary}
                onChange={(e) => setPubForm({...pubForm, summary: e.target.value})}
                required
                rows="6"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
              <button type="submit" className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                Publish
              </button>
            </form>
          </div>
        )}

        {/* My Trials */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">🔬 My Clinical Trials ({trials.length})</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trials.map(trial => (
              <div key={trial.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{trial.title}</h3>
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{trial.phase}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{trial.location}</span>
                </div>
                <p className="text-gray-600 text-sm">{trial.description}</p>
              </div>
            ))}
            {trials.length === 0 && (
              <div className="col-span-3 bg-white rounded-2xl p-8 text-center">
                <p className="text-gray-600">No trials created yet. Create your first trial!</p>
              </div>
            )}
          </div>
        </div>

        {/* My Publications */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">📚 My Publications ({publications.length})</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map(pub => (
              <div key={pub.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pub.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{pub.summary}</p>
              </div>
            ))}
            {publications.length === 0 && (
              <div className="col-span-3 bg-white rounded-2xl p-8 text-center">
                <p className="text-gray-600">No publications yet. Share your research!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResearcherDashboard;
