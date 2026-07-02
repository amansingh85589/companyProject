import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

function CheckFlagForm() {
  const [featureKey, setFeatureKey] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await axiosInstance.post('/flags/check', { featureKey });
      setResult(res.data); // { featureKey, enabled }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check flag');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '360px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label>Feature Key</label>
          <br />
          <input
            type="text"
            placeholder="e.g. dark_mode"
            value={featureKey}
            onChange={(e) => setFeatureKey(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Checking...' : 'Submit'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '20px', padding: '12px', border: '1px solid #ccc' }}>
          <p>
            Feature <strong>{result.featureKey}</strong> is{' '}
            <strong style={{ color: result.enabled ? 'green' : 'red' }}>
              {result.enabled ? 'ENABLED' : 'DISABLED'}
            </strong>{' '}
            for your organization.
          </p>
        </div>
      )}
    </div>
  );
}

export default CheckFlagForm;
