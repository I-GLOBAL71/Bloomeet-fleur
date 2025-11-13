import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppView } from './types';
import LoginView from './components/LoginView';
import DiscoveryView from './components/DiscoveryView';
import LikesView from './components/LikesView';
import MatchesView from './components/MatchesView';
import ProfileView from './components/ProfileView';
import BottomNav from './components/BottomNav';
import OnboardingView from './components/OnboardingView';
import EventsView from './components/EventsView';
import { LanguageProvider, useTranslation } from './hooks/useTranslation';

const pageVariants = {
  initial: {
    opacity: 0,
    x: "20px",
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: "-20px",
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.Discovery);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    setIsOnboardingComplete(true);
  }, []);
  
  const renderView = () => {
    switch (currentView) {
      case AppView.Discovery:
        return <DiscoveryView />;
      case AppView.Likes:
        return <LikesView />;
      case AppView.Events:
        return <EventsView />;
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

  if (!isOnboardingComplete) {
    return <OnboardingView onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden">
      <main className="flex-grow relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            id="main-scroll-container"
            key={currentView}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="absolute inset-0 overflow-y-auto pb-20"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav activeView={currentView} setView={setCurrentView} />
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);


export default App;