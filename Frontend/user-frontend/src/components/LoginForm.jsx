import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

function LoginForm({ onLoginSuccess, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axiosInstance.post('/auth/login', { email, password });

      if (res.data.role !== 'EndUser') {
        setError('This account is not an End User');
        setLoading(false);
        return;
      }

      localStorage.setItem('userToken', res.data.token);
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '360px', margin: '80px auto' }}>
      <h2>End User Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        No account?{' '}
        <button onClick={onSwitchToSignup} style={{ padding: '2px 8px' }}>
          Sign up
        </button>
      </p>
    </div>
  );
}

export default LoginForm;
