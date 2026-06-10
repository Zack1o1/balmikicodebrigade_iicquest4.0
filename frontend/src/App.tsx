import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ServiceDirectory from './pages/ServiceDirectory';
import ApplyNow from './pages/Apply/ApplyNow';
import EsewaMock from './pages/Apply/EsewaMock';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/services" element={<ServiceDirectory />} />
            <Route path="/apply/:id" element={<ApplyNow />} />
            <Route path="/esewa-mock" element={<EsewaMock />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
