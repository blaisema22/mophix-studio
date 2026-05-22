import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuthStore } from '../store';

const Login = () => {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login(credentials.email, credentials.password);
      const payload = response.data || response;
      loginStore(payload.user, payload.token);
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(payload.user));
      const role = String(payload.user?.role || '').toLowerCase();
      const destination =
        role === 'admin' ? '/admin/dashboard' : role === 'staff' ? '/staff/dashboard' : '/dashboard';
      navigate(destination);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="mb-8">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to manage bookings, view portfolio updates, and control your profile.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            className="input-field auth-input"
            placeholder="Email address"
            value={credentials.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="input-field auth-input"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <button disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          {error && <p className="text-sm text-orange-300">{error}</p>}
        </form>
        <p className="text-sm text-gray-300 mt-6">
          Don’t have an account? <Link to="/register" className="text-orange-400 hover:text-orange-300">Register now  </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
