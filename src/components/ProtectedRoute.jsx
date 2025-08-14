import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, user, isLoading } = useContext(AuthContext);
  console.log('ProtectedRoute: Checking auth', { isAuthenticated, user, isLoading }); // Debugging

  if (isLoading) {
    console.log('ProtectedRoute: Waiting for auth validation'); // Debugging
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !user || user.role !== 'GovAdmin') {
    console.log('ProtectedRoute: Redirecting to /login'); // Debugging
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;