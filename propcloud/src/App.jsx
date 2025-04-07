import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import PasswordReset from './components/auth/PasswordReset';
import NewPassword from './components/auth/NewPassword';
import Profile from './components/auth/Profile';
import AdminPanel from './components/admin/AdminPanel';
import ManagerDashboard from './components/manager/ManagerDashboard';
import Unauthorized from './components/auth/Unauthorized';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import PricingSection from './components/PricingSection';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/update-password" element={<NewPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manager" 
            element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={
            <>
              <HeroSection />
              <FeaturesSection />
              <PricingSection />
              <ContactForm />
              <Footer />
            </>
          } />
        </Routes>
        <ToastContainer position="bottom-right" />
      </div>
      </Router>
    </AuthProvider>
  );
}

export default App;