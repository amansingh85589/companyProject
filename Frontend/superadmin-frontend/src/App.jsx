import { useState } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('superAdminToken'));
  console.log('API URL is:', import.meta.env.VITE_API_URL); // ADD THIS LINE

  return (
    <div>
      {isLoggedIn ? (
        <Dashboard onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;