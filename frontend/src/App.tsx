import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ServiceDirectory from './pages/ServiceDirectory';
import ApplyNow from './pages/Apply/ApplyNow';
import EsewaMock from './pages/Apply/EsewaMock';
import Login from './pages/Login';
import DashboardCustomer from './pages/DashboardCustomer';
import DashboardStaff from './pages/DashboardStaff';
import DashboardAdmin from './pages/DashboardAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import TrackApplication from './pages/TrackApplication';
import SignUp from './pages/Signup';
import SmartPalikaAI from './components/SmartPalikaAI';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white font-sans">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/services" element={<ServiceDirectory />} />
            <Route path="/track-application" element={<TrackApplication />} />
            <Route path="/smart-palika-ai" element={<SmartPalikaAI />} />
            <Route path="/apply/:id" element={<ApplyNow />} />
            <Route path="/esewa-mock" element={<EsewaMock />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['citizen']}><DashboardCustomer /></ProtectedRoute>
            } />
            <Route path="/staff" element={
              <ProtectedRoute allowedRoles={['ward']}><DashboardStaff /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}><DashboardAdmin /></ProtectedRoute>
            } />

            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
