import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import GovernmentPortal from './pages/home';
import Layout from './components/Layout';
import LoginPage from './pages/Login';
import AdminRegistartionForm from './pages/AdminRegistration';
import AuthorityRegistrationForm from './pages/AuthorityRegistration';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Task from './pages/Task';
const AuthRedirect = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  console.log('AuthRedirect: Checking auth', { isAuthenticated, isLoading }); // Debugging

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  // Redirect to dashboard if authenticated, otherwise show LandingPage
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <GovernmentPortal />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-registration" element={<AdminRegistartionForm />} />
          <Route path="/authority-registration" element={<AuthorityRegistrationForm />} />
          <Route path="/" element={<AuthRedirect />} />
          {/* Layout routes - these will render inside the Layout component */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} /> {/* Fixed path */}
            <Route path="/services" element={<Services />}/>
            <Route path="/tasks" element={<Task/>} />
            <Route path="/profile" element={<h1>Profile Page</h1>} />
            <Route path="/settings" element={<h1>Settings Page</h1>} />
          </Route>

          {/* Catch-all route for 404 */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;