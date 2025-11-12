import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserProfile } from '../types';
import { HeartIcon, XIcon, StarIcon, FlowerIcon, PhoneIcon, CheckIcon, UndoIcon } from './Icons';

const mockProfiles: UserProfile[] = [
  { id: 1, name: 'Chloé', age: 26, bio: 'Loves hiking, art galleries, and trying new recipes. Looking for a genuine connection.', interests: ['Hiking', 'Art', 'Cooking'], photos: ['https://picsum.photos/seed/woman1/800/1200', 'https://picsum.photos/seed/w1p2/800/1200', 'https://picsum.photos/seed/w1p3/800/1200'], distance: 5, flowerBalance: 15 },
  { id: 2, name: 'Lucas', age: 29, bio: 'Software engineer by day, musician by night. My dog is my best friend. Let\'s grab a coffee.', interests: ['Music', 'Dogs', 'Tech'], photos: ['https://picsum.photos/seed/man1/800/1200', 'https://picsum.photos/seed/m1p2/800/1200'], distance: 2, flowerBalance: 40 },
  { id: 3, name: 'Jasmine', age: 24, bio: 'Just moved to the city! Exploring every corner. Big foodie and film enthusiast.', interests: ['Food', 'Movies', 'Travel'], photos: ['https://picsum.photos/seed/woman2/800/1200', 'https://picsum.photos/seed/w2p2/800/1200', 'https://picsum.photos/seed/w2p3/800/1200', 'https://picsum.photos/seed/w2p4/800/1200'], distance: 10, flowerBalance: 5 },
  { id: 4, name: 'Théo', age: 27, bio: 'Fitness enthusiast and bookworm. Believer in balancing mind and body.', interests: ['Fitness', 'Reading', 'Philosophy'], photos: ['https://picsum.photos/seed/man2/800/1200'], distance: 8, flowerBalance: 110 },
  { id: 5, name: 'Inès', age: 30, bio: 'Entrepreneur with a passion for sustainability and travel. Searching for an adventure partner.', interests: ['Business', 'Sustainability', 'Travel'], photos: ['https://picsum.photos/seed/woman3/800/1200', 'https://picsum.photos/seed/w3p2/800/1200'], distance: 3, flowerBalance: 20 },
];

const SWIPE_THRESHOLD = 100;
const LIFT_THRESHOLD = -60;
const ANIMATION_DURATION = 300;

const ProfileDetailModal: React.FC<{ profile: UserProfile; onClose: () => void; }> = ({ profile, onClose }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-black/60 z-30 flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="relative w-full max-w-sm h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={e => e.stopPropagation()}
            >
                <div className="h-full w-full overflow-y-auto">
                    {/* Photo Gallery */}
                    <div className="grid grid-cols-2 gap-2 p-2">
                        {profile.photos.map((photo, index) => (
                            <div
                                key={index}
                                className={`rounded-xl overflow-hidden ${
                                    index === 0 ? 'col-span-2 aspect-[4/5]' : 'aspect-square'
                                }`}
                            >
                                <img src={photo} alt={`${profile.name} photo ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    
                    {/* Details */}
                    <div className="p-6 pt-4">
                        <h2 className="font-display text-4xl font-bold">{profile.name}, {profile.age}</h2>
                        <p className="mt-4 text-lg text-gray-700">{profile.bio}</p>
                        
                        <div className="mt-6">
                            <h3 className="font-semibold text-lg text-gray-800">Centres d'intérêt</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {profile.interests.map(interest => (
                                    <span key={interest} className="bg-rose-100 text-rose-800 text-sm font-medium px-3 py-1 rounded-full">{interest}</span>
                                ))}
                            </div>
                        </div>
                         <p className="text-sm text-gray-500 mt-6">{profile.distance} km</p>
                    </div>
                </div>
                
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors focus:outline-none z-10">
                    <XIcon className="w-6 h-6" />
                </button>
            </motion.div>
        </motion.div>
    );
};

const SendFlowerModal: React.FC<{
    recipientName: string;
    currentUserBalance: number;
    onClose: () => void;
    onSend: (amount: number) => void;
    sendingState: 'idle' | 'sending' | 'sent';
}> = ({ recipientName, currentUserBalance, onClose, onSend, sendingState }) => {
    const [amount, setAmount] = useState(1);
    const amounts = [1, 5, 10];

    const handleSend = () => {
        if (amount > 0 && currentUserBalance >= amount) {
            onSend(amount);
        }
    };

    const idleContent = (
        <>
            <FlowerIcon className="w-16 h-16 text-rose-400 mx-auto animate-pulse" />
            <h2 className="font-display text-2xl font-bold mt-4 text-gray-800">Envoyer des fleurs à {recipientName}</h2>
            <p className="text-gray-500 mt-2">Votre solde : <span className="font-semibold">{currentUserBalance}</span> fleurs</p>
            <div className="flex justify-center gap-3 my-6">
                {amounts.map(a => (
                    <button key={a} onClick={() => setAmount(a)} className={`px-6 py-3 rounded-full font-bold border-2 transition-all ${amount === a ? 'bg-rose-500 text-white border-rose-500' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {a}
                    </button>
                ))}
            </div>
            <button onClick={handleSend} disabled={currentUserBalance < amount} className="w-full py-3 px-4 rounded-lg text-white bg-rose-500 font-semibold hover:bg-rose-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed">
                Envoyer {amount} fleur{amount > 1 ? 's' : ''}
            </button>
            <button onClick={onClose} className="w-full mt-3 py-2 text-gray-600 font-semibold">Annuler</button>
        </>
    );

    const sendingContent = (
        <div className="flex flex-col items-center justify-center py-10 min-h-[305px]">
            <div className="w-12 h-12 border-4 border-t-rose-500 border-gray-200 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-semibold">Envoi en cours...</p>
        </div>
    );

    const sentContent = (
        <div className="flex flex-col items-center justify-center py-10 min-h-[305px]">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-10 h-10 text-white" />
                </div>
            </motion.div>
            <h2 className="font-display text-2xl font-bold mt-6 text-gray-800">Fleurs envoyées !</h2>
        </div>
    );

    return (
        <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={sendingState}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {sendingState === 'idle' && idleContent}
                        {sendingState === 'sending' && sendingContent}
                        {sendingState === 'sent' && sentContent}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

const DiscoveryView: React.FC = () => {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [history, setHistory] = useState<UserProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({});
  const [isLifted, setIsLifted] = useState(false);
  const [currentUserFlowerBalance, setCurrentUserFlowerBalance] = useState(250);
  const [showSendFlowerModal, setShowSendFlowerModal] = useState(false);
  const [sendingState, setSendingState] = useState<'idle' | 'sending' | 'sent'>('idle');
  
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
  }).current;
  
  const cardRef = useRef<HTMLDivElement>(null);

  const advanceQueue = useCallback((swipedProfile: UserProfile, swipeType: 'action' | 'gift') => {
    if (swipeType === 'action') {
        setHistory(h => [swipedProfile, ...h]);
    }
    setProfiles(prev => prev.slice(1));
    setIsLifted(false);
  }, []);

  useEffect(() => {
    dragState.isDragging = false;
    dragState.deltaX = 0;
    dragState.deltaY = 0;
    setCardStyle({
        transform: 'translateX(0px) translateY(0px) rotate(0deg)',
        transition: 'none',
    });
  }, [profiles, dragState]);

  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up') => {
    const swipedProfile = profiles[0];
    if (!swipedProfile) return;

    let flyOutX = 0, flyOutY = 0, rotation = 0;

    if(direction === 'up'){
       flyOutY = -window.innerHeight;
    } else {
        flyOutX = direction === 'right' ? window.innerWidth : -window.innerWidth;
        rotation = (flyOutX / window.innerWidth) * 30;
    }
    
    setCardStyle({
      transform: `translateX(${flyOutX}px) translateY(${flyOutY}px) rotate(${rotation}deg)`,
      transition: `transform ${ANIMATION_DURATION}ms ease-out`,
    });
    
    setTimeout(() => {
      const swipeType = (direction === 'left' || direction === 'right') ? 'action' : 'gift';
      advanceQueue(swipedProfile, swipeType);
    }, ANIMATION_DURATION);
  }, [advanceQueue, profiles]);

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // Prevent drag from starting if the click is on the flower button
    if ((e.target as HTMLElement).closest('button[aria-label="Envoyer des fleurs"]')) {
      return;
    }

    if (!cardRef.current) return;
    
    dragState.isDragging = true;
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const pageY = 'touches' in e ? e.touches[0].pageY : e.pageY;
    dragState.startX = pageX;
    dragState.startY = pageY;
    
    setIsLifted(false);
    setCardStyle(prev => ({ ...prev, transition: 'none' }));

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('touchmove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchend', handleDragEnd);
  };
  
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragState.isDragging) return;
    
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const pageY = 'touches' in e ? e.touches[0].pageY : e.pageY;
    dragState.deltaX = pageX - dragState.startX;
    dragState.deltaY = pageY - dragState.startY;
    
    const rotation = dragState.deltaX / 20; 
    
    setCardStyle({
        transform: `translateX(${dragState.deltaX}px) translateY(${dragState.deltaY}px) rotate(${rotation}deg)`,
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
    
    const wasClick = Math.abs(dragState.deltaX) < 10 && Math.abs(dragState.deltaY) < 10;
    const isSwipeUp = dragState.deltaY < LIFT_THRESHOLD;

    if (isSwipeUp) {
        setIsLifted(true);
        setCardStyle({
            transform: 'translateX(0px) translateY(0px) rotate(0deg)',
            transition: `transform ${ANIMATION_DURATION}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
        });
        return;
    }

    if (wasClick) {
        setSelectedProfile(profiles[0]);
        setCardStyle({ transform: 'translateX(0px) translateY(0px) rotate(0deg)', transition: `transform 0.1s ease-out` });
        return;
    }
    
    if (Math.abs(dragState.deltaX) > SWIPE_THRESHOLD) {
      handleSwipe(dragState.deltaX > 0 ? 'right' : 'left');
    } else {
      setCardStyle({
        transform: 'translateX(0px) translateY(0px) rotate(0deg)',
        transition: `transform ${ANIMATION_DURATION}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
      });
    }
  }, [dragState, handleSwipe, handleDragMove, profiles]);

  const handleSendFlowers = (amount: number) => {
    if (currentUserFlowerBalance >= amount && currentProfile) {
        setSendingState('sending');

        // Simulate API call
        setTimeout(() => {
            setCurrentUserFlowerBalance(prev => prev - amount);
            setSendingState('sent');

            // After showing success message
            setTimeout(() => {
                setShowSendFlowerModal(false);
                handleSwipe('up');
                
                // Reset state after modal is closed
                setTimeout(() => setSendingState('idle'), 300);
            }, 1200);
        }, 1500);
    }
  };
  
  const handleUndo = () => {
    if (history.length === 0) return;
    const lastProfile = history[0];
    const newHistory = history.slice(1);
    
    setHistory(newHistory);
    setProfiles(prev => [lastProfile, ...prev]);
  };

  const currentProfile = profiles[0];
  const nextProfile = profiles[1];

  const dragProgress = Math.min(Math.abs(dragState.deltaX) / SWIPE_THRESHOLD, 1);
  const likeOpacity = dragState.deltaX > 0 ? dragProgress : 0;
  const nopeOpacity = dragState.deltaX < 0 ? dragProgress : 0;
  const nextCardScale = 0.95 + (0.05 * dragProgress);
  
  return (
    <div className="h-full w-full flex flex-col items-center p-4 pt-4">
        <div className="mb-4 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
            <FlowerIcon className="w-6 h-6 text-rose-500" />
            <span className="font-bold text-lg text-gray-800">{currentUserFlowerBalance}</span>
            <span className="text-sm text-gray-500 -ml-1">fleurs</span>
       </div>

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
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-12 left-6 -rotate-12 transform transition-opacity" style={{opacity: likeOpacity, willChange: 'opacity'}}>
                      <span className="text-4xl font-display font-bold text-green-400 border-4 border-green-400 rounded-lg px-4 py-1 tracking-wider">LIKE</span>
                    </div>
                    <div className="absolute top-12 right-6 rotate-12 transform transition-opacity" style={{opacity: nopeOpacity, willChange: 'opacity'}}>
                      <span className="text-4xl font-display font-bold text-rose-500 border-4 border-rose-500 rounded-lg px-4 py-1 tracking-wider">NOPE</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent p-6 text-white flex flex-col justify-end">
                        <div className="flex justify-between items-end">
                             <h2 className="font-display text-4xl font-bold">{currentProfile.name}, {currentProfile.age}</h2>
                             <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowSendFlowerModal(true);
                                }}
                                className="p-3 bg-white/20 rounded-full text-white backdrop-blur-sm hover:bg-white/30 transition-colors active:scale-90 pointer-events-auto"
                                aria-label="Envoyer des fleurs"
                             >
                                <FlowerIcon className="w-7 h-7" />
                             </button>
                        </div>
                        <p className="mt-2 text-lg line-clamp-2">{currentProfile.bio}</p>
                        <p className="text-sm opacity-80">{currentProfile.distance} km</p>
                    </div>
                  </div>
                  <AnimatePresence>
                    {isLifted && (
                      <motion.div
                          className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md rounded-b-2xl p-4 flex flex-col justify-center items-center gap-3 pointer-events-auto"
                          initial={{ y: "100%" }}
                          animate={{ y: 0 }}
                          exit={{ y: "100%" }}
                          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                      >
                          <button onClick={() => setShowSendFlowerModal(true)} className="w-full flex items-center justify-center gap-3 bg-rose-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95">
                              <FlowerIcon className="w-6 h-6" />
                              Envoyer des fleurs
                          </button>
                          <button className="w-full flex items-center justify-center gap-3 bg-slate-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95">
                              <PhoneIcon className="w-5 h-5" />
                              Demander le contact
                          </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>
            </>
          )}
       </div>

      {currentProfile && !isLifted && (
          <div className="flex items-center justify-center space-x-4 mt-8">
             <button onClick={handleUndo} disabled={history.length === 0} className="p-4 bg-white rounded-full shadow-lg text-gray-500 transform transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              <UndoIcon className="w-7 h-7"/>
            </button>
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
      <AnimatePresence>
        {selectedProfile && (
            <ProfileDetailModal key={selectedProfile.id} profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
        )}
      </AnimatePresence>
       <AnimatePresence>
        {showSendFlowerModal && currentProfile && (
            <SendFlowerModal
                key={`send-flower-${currentProfile.id}`}
                recipientName={currentProfile.name}
                currentUserBalance={currentUserFlowerBalance}
                onClose={() => {
                    if (sendingState === 'idle') {
                      setShowSendFlowerModal(false);
                    }
                }}
                onSend={handleSendFlowers}
                sendingState={sendingState}
            />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscoveryView;