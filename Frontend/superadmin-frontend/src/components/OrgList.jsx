import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

function OrgList({ refreshTrigger }) {
  const [orgs, setOrgs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrgs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get('/organizations');
      setOrgs(res.data.organizations);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
    // refreshTrigger changes whenever a new org is created, so this
    // re-fetches the list without needing prop drilling of the org array itself
  }, [refreshTrigger]);

  if (loading) return <p>Loading organizations...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h3>Organizations ({orgs.length})</h3>
      {orgs.length === 0 ? (
        <p>No organizations created yet.</p>
      ) : (
        <ul>
          {orgs.map((org) => (
            <li key={org._id}>
              <strong>{org.name}</strong> — <code>{org._id}</code>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrgList;
