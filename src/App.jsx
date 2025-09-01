import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import GovernmentPortal from './pages/home';
import Layout from './components/Layout';
import LoginPage from './pages/Login';
import AdminRegistrationForm from './pages/AuthorityAdminRegistration';
import AuthorityRegistrationForm from './pages/AuthorityRegistration';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Task from './pages/Task';
import StaffManagement from './pages/StarfManagement';
import DepartmentManagement from './pages/StaffRoleMangement';
import Profile from './pages/profile';
import Settings from './pages/setting';
import VerifyEmail from './pages/VerifyEmail';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpiner';
const AuthRedirect = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  console.log('AuthRedirect: Checking auth', { isAuthenticated, isLoading }); // Debugging

  if (isLoading) {
    return <LoadingSpinner/>; // Or a loading spinner
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
          <Route path="/authority-admin-registration" element={<AdminRegistrationForm/>} />
          <Route path="/authority-registration" element={<AuthorityRegistrationForm />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/" element={<AuthRedirect />} />
          {/* Layout routes - these will render inside the Layout component */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> {/* Fixed path */}
            <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>}/>
            <Route path="/tasks" element={<ProtectedRoute><Task/></ProtectedRoute>} />
            <Route path="/starf/users" element={<ProtectedRoute><StaffManagement/></ProtectedRoute>}/>
            <Route path="/starf/roles" element={<ProtectedRoute><DepartmentManagement/></ProtectedRoute>}/>
            <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>} />
          </Route>

          {/* Catch-all route for 404 */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;