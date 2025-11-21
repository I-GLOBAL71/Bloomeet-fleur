
import * as React from 'react';
import { AppView } from '../types';
import { CompassIcon, HeartIcon, MessageSquareIcon, UserIcon, CalendarIcon } from './Icons';

interface BottomNavProps {
  activeView: AppView;
  setView: (view: AppView) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, isActive, onClick }) => {
  const activeClass = isActive ? 'text-rose-500' : 'text-gray-400';
  return (
    <button onClick={onClick} className={`p-2 transition-transform duration-200 ease-in-out transform hover:scale-110 active:scale-95 ${activeClass}`}>
      {icon}
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto h-full flex justify-around items-center">
        <NavItem 
          icon={<CompassIcon className="w-7 h-7" />} 
          isActive={activeView === AppView.Discovery} 
          onClick={() => setView(AppView.Discovery)} 
        />
        <NavItem 
          icon={<HeartIcon className="w-7 h-7" />} 
          isActive={activeView === AppView.Likes} 
          onClick={() => setView(AppView.Likes)} 
        />
        <NavItem 
          icon={<CalendarIcon className="w-7 h-7" />} 
          isActive={activeView === AppView.Events} 
          onClick={() => setView(AppView.Events)} 
        />
        <NavItem 
          icon={<MessageSquareIcon className="w-7 h-7" />} 
          isActive={activeView === AppView.Matches} 
          onClick={() => setView(AppView.Matches)} 
        />
        <NavItem 
          icon={<UserIcon className="w-7 h-7" />} 
          isActive={activeView === AppView.Profile} 
          onClick={() => setView(AppView.Profile)} 
        />
      </div>
    </nav>
  );
};

export default BottomNav;