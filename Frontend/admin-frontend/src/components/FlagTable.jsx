import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

function FlagTable({ refreshTrigger }) {
  const [flags, setFlags] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFlags = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get('/flags');
      setFlags(res.data.flags);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load flags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, [refreshTrigger]);

  const handleToggle = async (flag) => {
    try {
      await axiosInstance.put(`/flags/${flag._id}`, { enabled: !flag.enabled });
      // Optimistic-ish update: just refetch to stay in sync with the DB
      fetchFlags();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update flag');
    }
  };

  const handleDelete = async (flagId) => {
    if (!window.confirm('Delete this flag?')) return;
    try {
      await axiosInstance.delete(`/flags/${flagId}`);
      fetchFlags();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete flag');
    }
  };

  if (loading) return <p>Loading flags...</p>;

  return (
    <div>
      <h3>Feature Flags ({flags.length})</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {flags.length === 0 ? (
        <p>No flags created yet.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Feature Key</th>
              <th>Enabled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flags.map((flag) => (
              <tr key={flag._id}>
                <td>{flag.featureKey}</td>
                <td>{flag.enabled ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => handleToggle(flag)} style={{ marginRight: '8px' }}>
                    {flag.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => handleDelete(flag._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FlagTable;
