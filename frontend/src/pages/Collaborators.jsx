import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

function Collaborators() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchSpecialty, setSearchSpecialty] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.role !== 'researcher') {
      navigate('/');
      return;
    }
    setUser(userData);
    loadData(userData);
  }, [navigate]);

  const loadData = async (userData) => {
    try {
      const [collabData, connData] = await Promise.all([
        api.getCollaborators(userData.id),
        api.getConnections(userData.id)
      ]);
      setCollaborators(collabData);
      setConnections(connData);
    } catch (error) {
      console.error('Error loading data:', error);
      setToast({ message: 'Failed to load collaborators', type: 'error' });
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getCollaborators(user.id, searchSpecialty);
      setCollaborators(data);
    } catch (error) {
      setToast({ message: 'Search failed', type: 'error' });
    }
    setLoading(false);
  };

  const handleConnect = async (collaboratorId) => {
    try {
      await api.createConnection({
        requester_id: user.id,
        receiver_id: collaboratorId,
        connection_type: 'collaborate'
      });
      setToast({ message: 'Connection request sent!', type: 'success' });
      loadData(user);
    } catch (error) {
      setToast({ message: 'Failed to send request', type: 'error' });
    }
  };

  const getConnectionStatus = (collaboratorId) => {
    const conn = connections.find(c => 
      (c.requester_id === collaboratorId || c.receiver_id === collaboratorId)
    );
    return conn?.status;
  };

  if (loading) {
    return <Loader text="Loading collaborators..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-2">Find Collaborators 🤝</h1>
          <p className="text-purple-100 text-lg">
            Connect with researchers worldwide to advance your research
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by specialty or research interest..."
              value={searchSpecialty}
              onChange={(e) => setSearchSpecialty(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-semibold"
            >
              🔍 Search
            </button>
          </div>
        </div>

        {/* My Connections */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Connections</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {connections.filter(c => c.status === 'accepted').map(conn => {
              const collabId = conn.requester_id === user.id ? conn.receiver_id : conn.requester_id;
              const collab = collaborators.find(c => c.id === collabId);
              return collab ? (
                <div key={conn.id} className="bg-white rounded-xl p-4 shadow-md">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">✓</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{collab.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{collab.specialties}</p>
                </div>
              ) : null;
            })}
            {connections.filter(c => c.status === 'accepted').length === 0 && (
              <p className="text-gray-600 col-span-4">No connections yet</p>
            )}
          </div>
        </div>

        {/* All Collaborators */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Potential Collaborators</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collaborators.map(collab => {
            const status = getConnectionStatus(collab.id);
            return (
              <div key={collab.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">🔬</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{collab.name}</h3>
                    {status && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        status === 'accepted' ? 'bg-green-100 text-green-700' :
                        status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {status}
                      </span>
                    )}
                  </div>
                </div>

                {collab.specialties && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Specialties:</p>
                    <p className="text-sm text-gray-600">{collab.specialties}</p>
                  </div>
                )}

                {collab.research_interests && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Research Interests:</p>
                    <p className="text-sm text-gray-600">{collab.research_interests}</p>
                  </div>
                )}

                {collab.bio && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{collab.bio}</p>
                )}

                {!status && (
                  <button
                    onClick={() => handleConnect(collab.id)}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-medium"
                  >
                    🤝 Connect
                  </button>
                )}

                {status === 'accepted' && (
                  <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-medium cursor-default">
                    ✓ Connected
                  </button>
                )}

                {status === 'pending' && (
                  <button className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium cursor-default">
                    ⏳ Pending
                  </button>
                )}
              </div>
            );
          })}

          {collaborators.length === 0 && (
            <div className="col-span-3 bg-white rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <p className="text-gray-600">No collaborators found. Try a different search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Collaborators;
