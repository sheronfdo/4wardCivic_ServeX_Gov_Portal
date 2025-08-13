import { useState } from 'react';
import { useLocation ,useNavigate} from 'react-router-dom';
import apiClient from '../utils/apiClient';

const AdminRegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authorityId = location.state?.authorityId;

  const [email, setEmail] = useState('');
  const [authorityadminName, setauthorityadminName] = useState('');
  const [authorityEmail, setAuthorityEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const adminRes = await apiClient.post('/auth/authority/admin/register', {
        name:authorityadminName,
        email: email,
        password:password,
        authority_id:authorityId,
        authority_email:authorityEmail,
      });
      if (adminRes.user.id) {
        navigate('/login');
        // Optionally reset form here
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Header with logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-blue-500 rounded-lg shadow-lg p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Admin Registration</h1>
            <p className="text-blue-100 text-sm">
              Create your admin account by filling the form below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            {/*Name Input */}
             <div>
                <input
                  type="text"
                  id="authorityadminName"
                  name="authorityadminName"
                  value={authorityadminName}
                  onChange={(e) => setauthorityadminName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none"
                  placeholder="Enter authority Admin name"
                />
              </div>
            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Admin Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-md border border-blue-400 bg-blue-400 bg-opacity-50 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent disabled:opacity-50"
              />
            </div>

            {/* Authority Email Input (only if no authorityId) */}
            {!authorityId && (
              <div>
                <input
                  type="email"
                  name="authorityEmail"
                  placeholder="Authority Email"
                  value={authorityEmail}
                  onChange={(e) => setAuthorityEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-md border border-blue-400 bg-blue-400 bg-opacity-50 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent disabled:opacity-50"
                />
              </div>
            )}

            {/* Password Input */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-md border border-blue-400 bg-blue-400 bg-opacity-50 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent disabled:opacity-50"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-md border border-blue-400 bg-blue-400 bg-opacity-50 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent disabled:opacity-50"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-blue-500 font-semibold py-3 px-4 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          {/* Additional Options */}
          <div className="mt-6 text-center">
            <a 
              href="#" 
              className="text-blue-100 hover:text-white text-sm underline transition duration-200"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <a href="#" className="text-blue-500 hover:text-blue-600 underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminRegistrationForm;
