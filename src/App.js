import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import TestimonialSection from './components/sections/TestimonialSection';
import WhyChooseSection from './components/sections/WhyChooseSection';
import GallerySection from './components/sections/GallerySection';
import CustomerExperienceSection from './components/sections/CustomerExperienceSection';
import ContactSection from './components/sections/ContactSection';
import UtilityPage from './pages/UtilityPage';
import MainServicePage from './pages/ServicePage';
import PrivateOfficeDetailPage from './pages/PrivateOfficeDetailPage';
import FixedDeskDetailPage from './pages/FixedDeskDetailPage';
import HotDeskDetailPage from './pages/HotDeskDetailPage';
import LoginPage from './pages/auth/LoginPage';
import ServicePage from './pages/booking/ServicePage';
import PackageDurationPage from './pages/booking/PackageDurationPage';
import DatePage from './pages/booking/DatePage';
import SeatPage from './pages/booking/SeatPage';
import PaymentPage from './pages/booking/PaymentPage';
import BookingConfirmationPage from './pages/booking/BookingConfirmationPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';

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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/utility" element={<UtilityPage />} />
              <Route path="/service" element={<MainServicePage />} />
              <Route path="/service/private-office" element={<PrivateOfficeDetailPage />} />
              <Route path="/service/fixed-desk" element={<FixedDeskDetailPage />} />
              <Route path="/service/hot-desk" element={<HotDeskDetailPage />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Booking routes - Protected */}
              <Route path="/booking/service" element={
                <ProtectedRoute>
                  <ServicePage />
                </ProtectedRoute>
              } />
              <Route path="/booking/package-duration" element={
                <ProtectedRoute>
                  <PackageDurationPage />
                </ProtectedRoute>
              } />
              <Route path="/booking/date" element={
                <ProtectedRoute>
                  <DatePage />
                </ProtectedRoute>
              } />
              <Route path="/booking/seat" element={
                <ProtectedRoute>
                  <SeatPage />
                </ProtectedRoute>
              } />
              <Route path="/booking/payment" element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              } />
              <Route path="/booking/confirmation" element={
                <ProtectedRoute>
                  <BookingConfirmationPage />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
