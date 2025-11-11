
import React, { useState, useCallback } from 'react';
import { AppView } from './types';
import LoginView from './components/LoginView';
import DiscoveryView from './components/DiscoveryView';
import LikesView from './components/LikesView';
import MatchesView from './components/MatchesView';
import ProfileView from './components/ProfileView';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.Discovery);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);
  
  const renderView = () => {
    switch (currentView) {
      case AppView.Discovery:
        return <DiscoveryView />;
      case AppView.Likes:
        return <LikesView />;
      case AppView.Matches:
        return <MatchesView />;
      case AppView.Profile:
        return <ProfileView />;
      default:
        return <DiscoveryView />;
    }
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden">
      <main className="flex-grow overflow-y-auto pb-20">
        {renderView()}
      </main>
      <BottomNav activeView={currentView} setView={setCurrentView} />
    </div>
  );
};

export default App;
