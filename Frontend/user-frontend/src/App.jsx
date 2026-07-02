import { useState } from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import CheckPage from './pages/CheckPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userToken'));
  const [showSignup, setShowSignup] = useState(false);

  if (isLoggedIn) {
    return <CheckPage onLogout={() => setIsLoggedIn(false)} />;
  }

  return showSignup ? (
    <SignupForm onSwitchToLogin={() => setShowSignup(false)} />
  ) : (
    <LoginForm
      onLoginSuccess={() => setIsLoggedIn(true)}
      onSwitchToSignup={() => setShowSignup(true)}
    />
  );
}

export default App;
