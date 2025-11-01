import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import PatientOnboard from './pages/PatientOnboard';
import ResearcherOnboard from './pages/ResearcherOnboard';
import PatientDashboard from './pages/PatientDashboard';
import ResearcherDashboard from './pages/ResearcherDashboard';
import Forum from './pages/Forum';
import Favorites from './pages/Favorites';
import HealthExperts from './pages/HealthExperts';
import Collaborators from './pages/Collaborators';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/patient/onboard" element={<PatientOnboard />} />
          <Route path="/researcher/onboard" element={<ResearcherOnboard />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/experts" element={<HealthExperts />} />
          <Route path="/researcher/dashboard" element={<ResearcherDashboard />} />
          <Route path="/researcher/collaborators" element={<Collaborators />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
