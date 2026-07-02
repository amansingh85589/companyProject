import CheckFlagForm from '../components/CheckFlagForm';

function CheckPage({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    onLogout();
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Check Feature Flag</h2>
        <button onClick={handleLogout} style={{ padding: '6px 12px' }}>
          Logout
        </button>
      </div>
      <CheckFlagForm />
    </div>
  );
}

export default CheckPage;
