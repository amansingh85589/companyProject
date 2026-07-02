import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateFlagForm from '../components/CreateFlagForm';
import FlagTable from '../components/FlagTable';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleFlagCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Org Admin Dashboard</h2>
        <button onClick={handleLogout} style={{ padding: '6px 12px' }}>
          Logout
        </button>
      </div>

      <CreateFlagForm onFlagCreated={handleFlagCreated} />
      <FlagTable refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default DashboardPage;
