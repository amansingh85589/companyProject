import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

function SignupForm({ onSwitchToLogin }) {
  const [orgs, setOrgs] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgId, setOrgId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await axiosInstance.get('/organizations/public');
        setOrgs(res.data.organizations || []);
      } catch (err) {
        console.error('Org fetch failed:', err);
        setError('Failed to load organizations. Is the backend running?');
        setOrgs([]);
      }
    };
    fetchOrgs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axiosInstance.post('/auth/user/signup', {
        username,
        email,
        password,
        orgId,
      });
      setSuccess('Account created. You can log in now.');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '360px', margin: '80px auto' }}>
      <h2>End User Signup</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label>Username</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
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
        <div style={{ marginBottom: '12px' }}>
          <label>Organization</label>
          <br />
          <select
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Select an organization</option>
            {orgs.map((org) => (
              <option key={org._id} value={org._id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p>
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} style={{ padding: '2px 8px' }}>
          Login
        </button>
      </p>
    </div>
  );
}

export default SignupForm;
