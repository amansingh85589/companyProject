import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

function CreateFlagForm({ onFlagCreated }) {
  const [featureKey, setFeatureKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axiosInstance.post('/flags', { featureKey, enabled: false });
      setSuccess(`Flag "${featureKey}" created`);
      setFeatureKey('');
      onFlagCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create flag');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3>Create Feature Flag</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="e.g. dark_mode"
          value={featureKey}
          onChange={(e) => setFeatureKey(e.target.value)}
          required
          style={{ padding: '8px', flex: 1 }}
        />
        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default CreateFlagForm;
