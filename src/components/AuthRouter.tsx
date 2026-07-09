import { useState } from 'react';
import LandingView from './LandingView';
import StudentLogin from './StudentLogin';
import StudentRegister from './StudentRegister';

interface AuthRouterProps {
  onLoginSuccess: (studentName: string, unlockedDays: number[], unlockedProjects: string[]) => void;
}

type AuthRoute = 'landing' | 'login' | 'register';

export default function AuthRouter({ onLoginSuccess }: AuthRouterProps) {
  const [currentRoute, setCurrentRoute] = useState<AuthRoute>('landing');

  if (currentRoute === 'login') {
    return (
      <StudentLogin 
        onSuccess={onLoginSuccess} 
        onBack={() => setCurrentRoute('landing')} 
      />
    );
  }

  if (currentRoute === 'register') {
    return (
      <StudentRegister 
        onSuccess={onLoginSuccess}
        onBack={() => setCurrentRoute('landing')}
        onLogin={() => setCurrentRoute('login')}
      />
    );
  }

  return (
    <LandingView 
      onLoginClick={() => setCurrentRoute('login')}
      onRegisterClick={() => setCurrentRoute('register')}
    />
  );
}
