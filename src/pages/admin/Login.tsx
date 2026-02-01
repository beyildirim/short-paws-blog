import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { hashPassword, validatePassword } from '../../utils/crypto';
import { ADMIN_USERNAME, ROUTES } from '../../constants';

export default function Login() {
  const [username, setUsername] = useState(ADMIN_USERNAME);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { settings, updateSettings } = useSettingsStore();
  const needsSetup = !settings.adminPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setLoading(true);
    
    try {
      if (needsSetup) {
        if (!password || !confirmPassword) {
          setError('Please enter and confirm a new password');
          return;
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        const validation = validatePassword(password);
        if (!validation.valid) {
          setError(validation.message);
          return;
        }

        const hashedPassword = await hashPassword(password);
        updateSettings({ adminPassword: hashedPassword });
        const result = await login(ADMIN_USERNAME, password);
        if (result.success) {
          navigate(ROUTES.ADMIN);
        } else {
          setError(result.error || 'Unable to log in after setup');
        }
      } else {
        if (!username.trim() || !password.trim()) {
          setError('Please enter both username and password');
          return;
        }

        const result = await login(username.trim(), password);
        if (result.success) {
          navigate(ROUTES.ADMIN);
        } else {
          setError(result.error || 'Invalid username or password');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-4 border-pink-500">
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
          {needsSetup ? 'Set Admin Password' : 'Admin Login'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!needsSetup && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter username"
                />
              </div>
            </div>
          )}

          {needsSetup && (
            <div className="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-3 rounded text-sm">
              Admin username is <span className="font-semibold">admin</span>. Set a password to continue.
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {needsSetup ? 'New Password' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={needsSetup ? 'Create a strong password' : 'Enter password'}
              />
            </div>
          </div>

          {needsSetup && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Re-enter password"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Minimum 10 characters with letters and numbers.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (needsSetup ? 'Saving...' : 'Logging in...') : (needsSetup ? 'Set Password' : 'Login')}
          </button>
        </form>
      </div>
    </div>
  );
}
