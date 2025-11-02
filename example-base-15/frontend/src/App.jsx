import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import UserList from './components/UserList';
import ChangePassword from './components/ChangePassword';

function AppContent() {
  const [showRegister, setShowRegister] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    if (currentView === 'users') {
      return <UserList onBackToDashboard={() => setCurrentView('dashboard')} />;
    }
    if (currentView === 'change-password') {
      return <ChangePassword onBackToDashboard={() => setCurrentView('dashboard')} />;
    }
    return (
      <Dashboard
        onNavigateToUsers={() => setCurrentView('users')}
        onNavigateToChangePassword={() => setCurrentView('change-password')}
      />
    );
  }

  return (
    <>
      {showRegister ? (
        <Register onSwitchToLogin={() => setShowRegister(false)} />
      ) : (
        <Login onSwitchToRegister={() => setShowRegister(true)} />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

