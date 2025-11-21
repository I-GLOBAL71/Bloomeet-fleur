
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '../types';
import { HeartIcon, LockIcon, PetalIcon, XIcon, MessageSquareIcon } from './Icons';
import { useTranslation } from '../contexts/LanguageContext';

const mockLikedByUsers: UserProfile[] = [
  { id: 1, name: 'Amélie', age: 25, bio: 'Passionnée de voyages et de littérature.', interests: ['Voyage', 'Lecture'], photos: ['https://picsum.photos/seed/like1/800/1200'], distance: 8 },
  { id: 2, name: 'Gabriel', age: 28, bio: 'Musicien dans l\'âme, j\'adore les concerts et les festivals.', interests: ['Musique', 'Concerts'], photos: ['https://picsum.photos/seed/like2/800/1200'], distance: 3 },
  { id: 3, name: 'Léa', age: 23, bio: 'Amoureuse des animaux et de la nature.', interests: ['Animaux', 'Nature'], photos: ['https://picsum.photos/seed/like3/800/1200'], distance: 12 },
  { id: 4, name: 'Hugo', age: 30, bio: 'Chef cuisinier. Ma spécialité ? La cuisine fusion.', interests: ['Cuisine', 'Gastronomie'], photos: ['https://picsum.photos/seed/like4/800/1200'], distance: 5 },
  { id: 5, name: 'Manon', age: 26, bio: 'Le sport, c\'est la vie ! Toujours partante pour une randonnée.', interests: ['Sport', 'Randonnée'], photos: ['https://picsum.photos/seed/like5/800/1200'], distance: 2 },
  { id: 6, name: 'Raphaël', age: 29, bio: 'Développeur et geek assumé. Fan de jeux de société.', interests: ['Tech', 'Jeux'], photos: ['https://picsum.photos/seed/like6/800/1200'], distance: 15 },
];

const MY_PROFILE_PHOTO = 'https://picsum.photos/seed/profile1/800/1000';
const UNLOCK_COST = 50;

const MatchAnimation: React.FC<{
    me: { photo: string };
    them: UserProfile;
    onContinue: () => void;
    onMessage: () => void;
}> = ({ me, them, onContinue, onMessage }) => {
    const { t } = useTranslation();
    return (
        <motion.div
            className="fixed inset-0 bg-rose-500/80 backdrop-blur-xl z-50 flex flex-col justify-center items-center p-8 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.h1 
                className="font-display text-6xl font-bold text-white mb-12"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            >
                {t('common.match')}
            </motion.h1>

            <div className="relative flex items-center justify-center w-64 h-48">
                <motion.div
                    className="absolute w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl"
                    initial={{ x: '-100%', rotate: -30, scale: 0 }}
                    animate={{ x: '-30%', rotate: -10, scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
                >
                    <img src={me.photo} alt="Your profile" className="w-full h-full object-cover" />
                </motion.div>
                <motion.div
                    className="absolute w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl"
                    initial={{ x: '100%', rotate: 30, scale: 0 }}
                    animate={{ x: '30%', rotate: 10, scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
                >
                    <img src={them.photos[0]} alt={them.name} className="w-full h-full object-cover" />
                </motion.div>
                 <motion.div
                    className="absolute z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: 'spring', stiffness: 150, damping: 10 }}
                >
                    <HeartIcon className="w-16 h-16 text-white" fill="currentColor" />
                </motion.div>
            </div>
            
            <motion.p 
                className="text-white text-xl mt-12 font-semibold text-center"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, type: 'spring', stiffness: 100 }}
            >
                {t('common.matchMessage', { name: them.name })}
            </motion.p>
            
            <motion.div 
                className="mt-8 flex flex-col gap-4 w-full max-w-xs"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, type: 'spring', stiffness: 100 }}
            >
                <button onClick={onMessage} className="w-full bg-white text-rose-500 font-bold py-4 rounded-full shadow-lg text-lg">
                    {t('common.sendMessage')}
                </button>
                <button onClick={onContinue} className="w-full text-white font-semibold py-3 rounded-full hover:bg-white/20 transition-colors">
                    {t('common.continueDiscovering')}
                </button>
            </motion.div>
        </motion.div>
    );
};

const UnlockProfileModal: React.FC<{
    profile: UserProfile;
    petalBalance: number;
    onUnlock: () => void;
    onCancel: () => void;
}> = ({ profile, petalBalance, onUnlock, onCancel }) => {
    const { t } = useTranslation();
    return (
        <motion.div
            className="fixed inset-0 bg-black/60 z-40 flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <h2 className="font-display text-2xl font-bold text-gray-800">{t('likes.unlockProfileTitle', { name: profile.name })}</h2>
                <p className="text-gray-600 my-4">{t('likes.unlockProfileBody')}</p>
                <div className="flex justify-center items-center gap-2 font-bold text-xl my-6 p-3 bg-violet-100 rounded-lg">
                    <span className="text-violet-600">{t('likes.unlockCost', { cost: UNLOCK_COST })}</span>
                    <PetalIcon className="w-7 h-7" />
                </div>
                <p className="text-sm text-gray-500 mb-6">{t('profile.petals.yourPetals')}: {petalBalance} {t('common.petals')}</p>
    
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onUnlock}
                        disabled={petalBalance < UNLOCK_COST}
                        className="w-full flex items-center justify-center gap-2 bg-rose-500 text-white font-bold py-3 px-4 rounded-lg transition hover:bg-rose-600 disabled:bg-gray-300"
                    >
                        <MessageSquareIcon className="w-5 h-5"/>
                        {t('likes.unlockAndMatch')}
                    </button>
                    <button onClick={onCancel} className="w-full py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg">
                        {t('common.cancel')}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};


const LikesView: React.FC = () => {
    const { t } = useTranslation();
    const [likers, setLikers] = React.useState<UserProfile[]>(mockLikedByUsers);
    const [matchData, setMatchData] = React.useState<UserProfile | null>(null);
    const [unlockingProfile, setUnlockingProfile] = React.useState<UserProfile | null>(null);
    const [petalBalance, setPetalBalance] = React.useState(500);

    const handleLikeBack = (profile: UserProfile) => {
        setMatchData(profile);
        setLikers(prev => prev.filter(p => p.id !== profile.id));
    };

    const handlePass = (profileId: number) => {
        setLikers(prev => prev.filter(p => p.id !== profileId));
    };

    const handleUnlockClick = (profile: UserProfile) => {
        setUnlockingProfile(profile);
    };

    const handleConfirmUnlock = () => {
        if (unlockingProfile && petalBalance >= UNLOCK_COST) {
            setPetalBalance(prev => prev - UNLOCK_COST);
            setMatchData(unlockingProfile);
            setLikers(prev => prev.filter(p => p.id !== unlockingProfile.id));
            setUnlockingProfile(null);
        }
    };
    
    return (
        <div className="p-4 pb-20">
            <h1 className="font-display text-4xl font-bold text-gray-800 mb-2">{t('likes.title')}</h1>
            <p className="text-gray-500 mb-6">{t('likes.subtitle')}</p>

            <div className="grid grid-cols-2 gap-4">
                {likers.map((user, index) => (
                    <div key={user.id} className="relative aspect-[4/5] rounded-xl overflow-hidden group shadow-lg">
                        <img src={user.photos[0]} alt={user.name} className="w-full h-full object-cover" />
                        
                        {index === 0 ? (
                             <>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                    <p className="font-bold text-xl">{user.name}, {user.age}</p>
                                    <div className="flex justify-around items-center mt-3">
                                        <button onClick={() => handlePass(user.id)} className="p-3 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors">
                                            <XIcon className="w-6 h-6"/>
                                        </button>
                                        <button onClick={() => handleLikeBack(user)} className="p-4 bg-rose-500 rounded-full shadow-lg text-white">
                                            <HeartIcon className="w-7 h-7" fill="currentColor"/>
                                        </button>
                                    </div>
                                </div>
                             </>
                        ) : (
                            <div 
                                onClick={() => handleUnlockClick(user)}
                                className="absolute inset-0 bg-white/30 backdrop-blur-xl flex flex-col justify-center items-center text-white cursor-pointer"
                            >
                                <LockIcon className="w-10 h-10" />
                                <p className="font-bold text-lg mt-2">{user.name}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <AnimatePresence>
                {matchData && (
                    <MatchAnimation
                        me={{ photo: MY_PROFILE_PHOTO }}
                        them={matchData}
                        onContinue={() => setMatchData(null)}
                        onMessage={() => { /* Navigate to chat */ setMatchData(null); }}
                    />
                )}
            </AnimatePresence>
             <AnimatePresence>
                {unlockingProfile && (
                    <UnlockProfileModal
                        profile={unlockingProfile}
                        petalBalance={petalBalance}
                        onUnlock={handleConfirmUnlock}
                        onCancel={() => setUnlockingProfile(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default LikesView;