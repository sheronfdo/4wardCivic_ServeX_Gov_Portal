import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (error) {
      setError(error.message);
      console.error('Login: Error', error.message); // Debugging
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

        {/* Login Form */}
        <div className="bg-blue-500 rounded-lg shadow-lg p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Login</h1>
            <p className="text-blue-100 text-sm">
              Enter your credentials to access the application
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-md border border-blue-400 bg-blue-400 bg-opacity-50 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent disabled:opacity-50"
              />
            </div>

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

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-blue-500 font-semibold py-3 px-4 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
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
            Don't have an account?{' '}
            <a href="#" className="text-blue-500 hover:text-blue-600 underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;