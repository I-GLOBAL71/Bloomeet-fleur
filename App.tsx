
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppView } from './types';
import LoginView from './components/LoginView';
import DiscoveryView from './components/DiscoveryView';
import LikesView from './components/LikesView';
import MatchesView from './components/MatchesView';
import ProfileView from './components/ProfileView';
import BottomNav from './components/BottomNav';
import EventsView from './components/EventsView';
import { LanguageProvider, useTranslation } from './contexts/LanguageContext';
import { LoaderIcon } from './components/Icons';

// Lazy load views to improve performance and error isolation
const OnboardingView = React.lazy(() => import('./components/OnboardingView'));
const AdminView = React.lazy(() => import('./components/AdminView'));


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

const LoadingScreen = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
    <LoaderIcon className="w-12 h-12 text-rose-500" />
  </div>
);

const AppContent: React.FC = () => {
  const { isLoading } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = React.useState(false);
  const [currentView, setCurrentView] = React.useState<AppView>(AppView.Discovery);

  const handleLogin = React.useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleOnboardingComplete = React.useCallback(() => {
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
        return <ProfileView onNavigateAdmin={() => setCurrentView(AppView.Admin)} />;
      case AppView.Admin:
        return (
          <React.Suspense fallback={<LoadingScreen />}>
            <AdminView onExit={() => setCurrentView(AppView.Profile)} />
          </React.Suspense>
        );
      default:
        return <DiscoveryView />;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  if (!isOnboardingComplete) {
    return (
      <React.Suspense fallback={<LoadingScreen />}>
        <OnboardingView onComplete={handleOnboardingComplete} />
      </React.Suspense>
    );
  }

  const showBottomNav = currentView !== AppView.Admin;

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
            className={`absolute inset-0 overflow-y-auto ${showBottomNav ? 'pb-20' : ''}`}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      {showBottomNav && (
        <BottomNav activeView={currentView} setView={setCurrentView} />
      )}
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);


export default App;
