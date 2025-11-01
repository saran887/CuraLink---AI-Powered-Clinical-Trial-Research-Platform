import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary">CuraLink</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Connecting patients and researchers to discover clinical trials, 
            publications, and health experts worldwide.
          </p>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
            {/* Patient Card */}
            <div 
              onClick={() => navigate('/patient/onboard')}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">👤</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">I'm a Patient</h2>
              <p className="text-gray-600 mb-6">
                Find clinical trials, connect with researchers, and stay informed about the latest treatments.
              </p>
              <button className="w-full bg-primary text-white px-6 py-3 rounded-xl hover:bg-secondary transition-colors font-semibold text-lg">
                Get Started →
              </button>
            </div>

            {/* Researcher Card */}
            <div 
              onClick={() => navigate('/researcher/onboard')}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔬</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">I'm a Researcher</h2>
              <p className="text-gray-600 mb-6">
                Manage clinical trials, publish research, and collaborate with other experts in the field.
              </p>
              <button className="w-full bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold text-lg">
                Get Started →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose CuraLink?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Discover Trials</h3>
              <p className="text-gray-600">
                Find clinical trials tailored to your condition and location.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Access Research</h3>
              <p className="text-gray-600">
                Read the latest publications and stay informed about breakthroughs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connect & Collaborate</h3>
              <p className="text-gray-600">
                Join our community forum and engage with experts worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
