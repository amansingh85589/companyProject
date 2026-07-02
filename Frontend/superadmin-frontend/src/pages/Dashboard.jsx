import { useState } from 'react';
import CreateOrgForm from '../components/CreateOrgForm';
import OrgList from '../components/OrgList';

function Dashboard({ onLogout }) {
  // Bumping this number tells OrgList to refetch after a new org is created
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOrgCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem('superAdminToken');
    onLogout();
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Super Admin Dashboard</h2>
        <button onClick={handleLogout} style={{ padding: '6px 12px' }}>
          Logout
        </button>
      </div>

      <CreateOrgForm onOrgCreated={handleOrgCreated} />
      <OrgList refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default Dashboard;
