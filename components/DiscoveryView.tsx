import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { UserProfile } from '../types';
import { HeartIcon, XIcon, StarIcon } from './Icons';

const mockProfiles: UserProfile[] = [
  { id: 1, name: 'Chloé', age: 26, bio: 'Loves hiking, art galleries, and trying new recipes. Looking for a genuine connection.', interests: ['Hiking', 'Art', 'Cooking'], photos: ['https://picsum.photos/seed/woman1/800/1200'], distance: 5 },
  { id: 2, name: 'Lucas', age: 29, bio: 'Software engineer by day, musician by night. My dog is my best friend. Let\'s grab a coffee.', interests: ['Music', 'Dogs', 'Tech'], photos: ['https://picsum.photos/seed/man1/800/1200'], distance: 2 },
  { id: 3, name: 'Jasmine', age: 24, bio: 'Just moved to the city! Exploring every corner. Big foodie and film enthusiast.', interests: ['Food', 'Movies', 'Travel'], photos: ['https://picsum.photos/seed/woman2/800/1200'], distance: 10 },
  { id: 4, name: 'Théo', age: 27, bio: 'Fitness enthusiast and bookworm. Believer in balancing mind and body.', interests: ['Fitness', 'Reading', 'Philosophy'], photos: ['https://picsum.photos/seed/man2/800/1200'], distance: 8 },
  { id: 5, name: 'Inès', age: 30, bio: 'Entrepreneur with a passion for sustainability and travel. Searching for an adventure partner.', interests: ['Business', 'Sustainability', 'Travel'], photos: ['https://picsum.photos/seed/woman3/800/1200'], distance: 3 },
];

const SWIPE_THRESHOLD = 100;
const ANIMATION_DURATION = 300;

const DiscoveryView: React.FC = () => {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({});
  
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    currentX: 0,
    deltaX: 0,
  }).current;
  
  const cardRef = useRef<HTMLDivElement>(null);

  const advanceQueue = useCallback(() => {
    setProfiles(prev => prev.slice(1));
  }, []);

  useEffect(() => {
    // When profiles change, reset card position for the new top card.
    dragState.isDragging = false;
    dragState.startX = 0;
    dragState.currentX = 0;
    dragState.deltaX = 0;
    setCardStyle({
        transform: 'translateX(0px) rotate(0deg)',
        transition: 'none',
    });
  }, [profiles, dragState]);


  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    const flyOutX = direction === 'right' ? window.innerWidth : -window.innerWidth;
    const rotation = (flyOutX / window.innerWidth) * 30;
    
    setCardStyle({
      transform: `translateX(${flyOutX}px) rotate(${rotation}deg)`,
      transition: `transform ${ANIMATION_DURATION}ms ease-out`,
    });
    
    setTimeout(() => {
      advanceQueue();
    }, ANIMATION_DURATION);
  }, [advanceQueue]);


  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    dragState.isDragging = true;
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    dragState.startX = pageX;
    
    setCardStyle(prev => ({ ...prev, transition: 'none' }));

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('touchmove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchend', handleDragEnd);
  };
  
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragState.isDragging) return;
    
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    dragState.currentX = pageX;
    dragState.deltaX = dragState.currentX - dragState.startX;
    
    const rotation = dragState.deltaX / 20; 
    
    setCardStyle({
        transform: `translateX(${dragState.deltaX}px) rotate(${rotation}deg)`,
        transition: 'none',
    });
  }, [dragState]);

  const handleDragEnd = useCallback(() => {
    if (!dragState.isDragging) return;
    dragState.isDragging = false;

    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('touchmove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
    window.removeEventListener('touchend', handleDragEnd);
    
    if (Math.abs(dragState.deltaX) > SWIPE_THRESHOLD) {
      handleSwipe(dragState.deltaX > 0 ? 'right' : 'left');
    } else {
      setCardStyle({
        transform: 'translateX(0px) rotate(0deg)',
        transition: `transform ${ANIMATION_DURATION}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
      });
    }
  }, [dragState, handleSwipe, handleDragMove]);


  const currentProfile = profiles[0];
  const nextProfile = profiles[1];

  const dragProgress = Math.min(Math.abs(dragState.deltaX) / SWIPE_THRESHOLD, 1);
  const likeOpacity = dragState.deltaX > 0 ? dragProgress : 0;
  const nopeOpacity = dragState.deltaX < 0 ? dragProgress : 0;
  const nextCardScale = 0.95 + (0.05 * dragProgress);
  
  return (
    <div className="h-full w-full flex flex-col items-center p-4 pt-8">
       <div className="relative w-full max-w-sm h-[70vh] flex-shrink-0">
          {!currentProfile ? (
            <div className="h-full w-full flex flex-col justify-center items-center bg-gray-100 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-700">That's everyone for now!</h3>
              <p className="text-gray-500 mt-2">Check back later for new people.</p>
            </div>
          ) : (
            <>
              {nextProfile && (
                <div 
                  className="absolute h-full w-full rounded-2xl overflow-hidden bg-gray-200"
                  style={{ 
                    transform: `scale(${nextCardScale})`,
                    transition: dragState.isDragging ? 'none' : 'transform 0.3s ease-out'
                  }}
                >
                  <img src={nextProfile.photos[0]} alt={nextProfile.name} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
                </div>
              )}

              <div 
                  ref={cardRef}
                  className="absolute h-full w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-200 cursor-grab active:cursor-grabbing"
                  style={cardStyle}
                  onMouseDown={handleDragStart}
                  onTouchStart={handleDragStart}
              >
                  <img src={currentProfile.photos[0]} alt={currentProfile.name} className="w-full h-full object-cover pointer-events-none" />
                  
                  <div className="absolute top-12 left-6 -rotate-12 transform transition-opacity" style={{opacity: likeOpacity, willChange: 'opacity'}}>
                    <span className="text-4xl font-display font-bold text-green-400 border-4 border-green-400 rounded-lg px-4 py-1 tracking-wider">LIKE</span>
                  </div>
                   <div className="absolute top-12 right-6 rotate-12 transform transition-opacity" style={{opacity: nopeOpacity, willChange: 'opacity'}}>
                    <span className="text-4xl font-display font-bold text-rose-500 border-4 border-rose-500 rounded-lg px-4 py-1 tracking-wider">NOPE</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent p-6 text-white flex flex-col justify-end">
                      <h2 className="font-display text-4xl font-bold">{currentProfile.name}, {currentProfile.age}</h2>
                      <p className="mt-2 text-lg line-clamp-2">{currentProfile.bio}</p>
                      <p className="text-sm opacity-80">{currentProfile.distance} km away</p>
                  </div>
              </div>
            </>
          )}
       </div>

      {currentProfile && (
          <div className="flex items-center justify-center space-x-6 mt-8">
            <button onClick={() => handleSwipe('left')} className="p-4 bg-white rounded-full shadow-lg text-orange-500 transform transition-transform hover:scale-110 active:scale-95">
              <XIcon className="w-8 h-8"/>
            </button>
            <button onClick={() => handleSwipe('right')} className="p-6 bg-white rounded-full shadow-lg text-rose-500 transform transition-transform hover:scale-110 active:scale-95">
              <HeartIcon className="w-10 h-10"/>
            </button>
             <button onClick={() => {}} className="p-4 bg-white rounded-full shadow-lg text-blue-500 transform transition-transform hover:scale-110 active:scale-95">
              <StarIcon className="w-8 h-8"/>
            </button>
          </div>
      )}
    </div>
  );
};

export default DiscoveryView;
