import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
      return;
    }
    
    // In a real app, this would fetch from the API
    // For MVP, we'll use localStorage
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(saved);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-red-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-2">Your Favorites ❤️</h1>
          <p className="text-pink-100 text-lg">
            Saved trials and publications for easy access
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-md">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">❤️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6">
              Start saving trials and publications by clicking the ❤️ Save button
            </p>
            <button
              onClick={() => navigate('/patient/dashboard')}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors font-semibold"
            >
              Browse Trials
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <button className="text-red-500 hover:text-red-600 text-xl">❤️</button>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{item.description}</p>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
