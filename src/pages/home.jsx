import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServeX_full from '../assets/logo/ServeX_full.png'
// Primary color palette - easily accessible throughout the app
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main primary blue
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  white: '#ffffff',
  black: '#000000',
};



const GovernmentPortal = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login'); // Redirect to /login
  };

  const handleRegister = () => {
    navigate('/authority-registration'); // Optional
  };
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(229, 232, 238, 1) 0%, rgba(189, 213, 241, 0.88) 50%, rgba(219, 234, 254, 0.6) 100%), url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Old_Parliament_Building%2C_Colombo.JPG/1200px-Old_Parliament_Building%2C_Colombo.JPG")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed', // Creates parallax effect on desktop
          minHeight: '100vh',
          width: '100%'
        }}
      />

      {/* Header */}
      <header className="relative z-10 absolute top-0 left-4 md:top-0 md:left-6">
        <div className="flex items-center">
          <img
            src={ServeX_full} alt="Description of the image"
            className="w-38 h-38 md:w-48 md:h-48  flex items-center justify-center" />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 -mt-20 flex items-center justify-center min-h-screen p-4 md:p-6">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
          {/* Welcome Section */}
          <div className="text-center mb-8 md:mb-12">
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 leading-tight"
              style={{ color: colors.primary[600] }}
            >
              Welcome to Government Authority Portal
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Your one platform to access services, connect with authorities,
              and manage your requests easily. Access services, manage requests, and
              connect with authorities all in one place.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <button
              onClick={handleLogin}
              className="w-full md:w-auto px-8 py-3 md:py-4 rounded-lg font-semibold text-white text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
              style={{
                backgroundColor: colors.primary[500],
                boxShadow: `0 4px 20px rgba(59, 130, 246, 0.3)`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary[600];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary[500];
              }}
            >
              Login
            </button>

            <button
              onClick={handleRegister}
              className="w-full md:w-auto px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4"
              style={{
                backgroundColor: 'transparent',
                color: colors.primary[600],
                border: `2px solid ${colors.primary[500]}`,
                boxShadow: `0 4px 20px rgba(59, 130, 246, 0.2)`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary[50];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Register
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GovernmentPortal;