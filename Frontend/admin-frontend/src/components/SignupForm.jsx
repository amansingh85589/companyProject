import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

console.log('BASE URL:', import.meta.env.VITE_API_URL);
function SignupForm() {
  const [orgs, setOrgs] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgId, setOrgId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Populate the org dropdown — this endpoint is public, no auth required,
  // since the admin doesn't have a token yet at signup time
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
    setLoading(true);

    try {
      await axiosInstance.post('/auth/admin/signup', {
        username,
        email,
        password,
        orgId,
      });
      // Signup doesn't log the user in directly — redirect to login
      // to keep the token-issuing logic in one place (the login endpoint)
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '360px', margin: '80px auto' }}>
      <h2>Org Admin Signup</h2>
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
        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default SignupForm;
