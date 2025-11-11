
import React, { useState, useMemo } from 'react';
import type { UserProfile } from '../types';
import { HeartIcon, XIcon, StarIcon } from './Icons';

const mockProfiles: UserProfile[] = [
  { id: 1, name: 'Chloé', age: 26, bio: 'Loves hiking, art galleries, and trying new recipes. Looking for a genuine connection.', interests: ['Hiking', 'Art', 'Cooking'], photos: ['https://picsum.photos/seed/woman1/800/1200'], distance: 5 },
  { id: 2, name: 'Lucas', age: 29, bio: 'Software engineer by day, musician by night. My dog is my best friend. Let\'s grab a coffee.', interests: ['Music', 'Dogs', 'Tech'], photos: ['https://picsum.photos/seed/man1/800/1200'], distance: 2 },
  { id: 3, name: 'Jasmine', age: 24, bio: 'Just moved to the city! Exploring every corner. Big foodie and film enthusiast.', interests: ['Food', 'Movies', 'Travel'], photos: ['https://picsum.photos/seed/woman2/800/1200'], distance: 10 },
  { id: 4, name: 'Théo', age: 27, bio: 'Fitness enthusiast and bookworm. Believer in balancing mind and body.', interests: ['Fitness', 'Reading', 'Philosophy'], photos: ['https://picsum.photos/seed/man2/800/1200'], distance: 8 },
  { id: 5, name: 'Inès', age: 30, bio: 'Entrepreneur with a passion for sustainability and travel. Searching for an adventure partner.', interests: ['Business', 'Sustainability', 'Travel'], photos: ['https://picsum.photos/seed/woman3/800/1200'], distance: 3 },
];

const DiscoveryCard: React.FC<{ profile: UserProfile, onSwipe: (dir: 'left' | 'right') => void }> = ({ profile, onSwipe }) => {
    const [style, setStyle] = useState({});
    
    // Simplified swipe for demo purposes, no drag implementation to keep it concise
    
    return (
        <div 
            className="absolute h-full w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-200 transition-transform duration-500 ease-in-out"
            style={style}
        >
            <img src={profile.photos[0]} alt={profile.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent p-6 text-white flex flex-col justify-end">
                <h2 className="font-display text-4xl font-bold">{profile.name}, {profile.age}</h2>
                <p className="mt-2 text-lg">{profile.bio}</p>
                <p className="text-sm opacity-80">{profile.distance} km away</p>
            </div>
        </div>
    );
};


const DiscoveryView: React.FC = () => {
  const [profiles, setProfiles] = useState(mockProfiles);
  const currentProfile = useMemo(() => profiles[0], [profiles]);

  const handleSwipe = () => {
    setProfiles(prev => prev.slice(1));
  };
  
  return (
    <div className="h-full w-full flex flex-col items-center p-4 pt-8">
       <div className="relative w-full max-w-sm h-[70vh] flex-shrink-0">
          {profiles.length > 0 ? (
            profiles.map((p, index) => 
                index === 0 ? <DiscoveryCard key={p.id} profile={p} onSwipe={handleSwipe}/> : null
            ).reverse() // Show top of stack
          ) : (
            <div className="h-full w-full flex flex-col justify-center items-center bg-gray-100 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-700">That's everyone for now!</h3>
              <p className="text-gray-500 mt-2">Check back later for new people.</p>
            </div>
          )}
       </div>

      {profiles.length > 0 && (
          <div className="flex items-center justify-center space-x-6 mt-8">
            <button onClick={handleSwipe} className="p-4 bg-white rounded-full shadow-lg text-orange-500 transform transition-transform hover:scale-110">
              <XIcon className="w-8 h-8"/>
            </button>
            <button onClick={handleSwipe} className="p-6 bg-white rounded-full shadow-lg text-rose-500 transform transition-transform hover:scale-110">
              <HeartIcon className="w-10 h-10"/>
            </button>
             <button onClick={handleSwipe} className="p-4 bg-white rounded-full shadow-lg text-blue-500 transform transition-transform hover:scale-110">
              <StarIcon className="w-8 h-8"/>
            </button>
          </div>
      )}
    </div>
  );
};

export default DiscoveryView;
