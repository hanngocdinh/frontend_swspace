import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import TestimonialSection from './components/sections/TestimonialSection';
import WhyChooseSection from './components/sections/WhyChooseSection';
import GallerySection from './components/sections/GallerySection';
import CustomerExperienceSection from './components/sections/CustomerExperienceSection';
import ContactSection from './components/sections/ContactSection';
import UtilityPage from './pages/UtilityPage';
import ServicePage from './pages/ServicePage';
import PrivateOfficeDetailPage from './pages/PrivateOfficeDetailPage';

// HomePage component to consolidate the main landing page sections
const HomePage = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TestimonialSection />
        <WhyChooseSection />
        <GallerySection />
        <CustomerExperienceSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/utility" element={<UtilityPage />} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/service/private-office" element={<PrivateOfficeDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
