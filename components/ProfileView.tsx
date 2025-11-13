
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlowerIcon, HistoryIcon, XIcon, PlusIcon, SparklesIcon, PetalIcon, EditIcon, SearchIcon } from './Icons';
import { FlowerTransaction } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from './LanguageSwitcher';

const initialUserProfile = {
  name: 'Marie',
  age: 28,
  photos: [
    'https://picsum.photos/seed/profile1/800/1000',
    'https://picsum.photos/seed/profile2/500/500',
    'https://picsum.photos/seed/profile3/500/500',
    'https://picsum.photos/seed/profile4/500/500',
  ],
  bio: 'Passionate about design, photography, and finding beauty in the everyday. My ideal weekend involves a good book, a long walk, and a cozy café.',
  interests: ['Design', 'Photography', 'Reading', 'Coffee', 'Nature'],
  flowerBalance: 125,
  petalBalance: 500,
};

const allInterests = [
    'Musique', 'Cinéma', 'Voyages', 'Cuisine', 'Sport', 'Lecture', 'Art', 'Danse',
    'Photographie', 'Randonnée', 'Jeux de société', 'Technologie', 'Animaux', 'Nature',
    'Bénévolat', 'Théâtre', 'Concerts', 'Festivals', 'Mode', 'Histoire', 'Politique',
    'Science', 'Philosophie', 'Bricolage', 'Jardinage', 'Yoga', 'Méditation',
    'Langues étrangères', 'Jeux vidéo', 'Écriture'
];

const PROFILE_STORAGE_KEY = 'aura-user-profile';

const flowerTransactions: FlowerTransaction[] = [
  { id: 1, recipientName: 'Chloé', recipientAvatar: 'https://picsum.photos/seed/woman1/100/100', amount: 5, date: '2024-07-20T10:30:00Z' },
  { id: 2, recipientName: 'Jasmine', recipientAvatar: 'https://picsum.photos/seed/woman2/100/100', amount: 10, date: '2024-07-19T18:00:00Z' },
  { id: 3, recipientName: 'Lucas', recipientAvatar: 'https://picsum.photos/seed/man1/100/100', amount: 1, date: '2024-07-18T12:00:00Z' },
  { id: 4, recipientName: 'Théo', recipientAvatar: 'https://picsum.photos/seed/man2/100/100', amount: 20, date: '2024-07-15T22:15:00Z' },
];

const petalPacks = [
  { amount: 100, price: '1.99€', popular: false },
  { amount: 550, price: '9.99€', popular: true },
  { amount: 1200, price: '19.99€', popular: false },
];

const FlowerHistoryModal: React.FC<{ transactions: FlowerTransaction[]; onClose: () => void; }> = ({ transactions, onClose }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 w-full max-w-md relative flex flex-col h-[70vh]"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <button onClick={onClose} className="absolute top-4 end-4 text-gray-400 hover:text-gray-600">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="font-display text-2xl font-bold mb-4">{t('profile.history.title')}</h2>
        
        <div className="flex-grow overflow-y-auto space-y-3 pe-2 -me-2">
          {transactions.length > 0 ? (
            transactions.map(tx => (
              <div key={tx.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <img src={tx.recipientAvatar} alt={tx.recipientName} className="w-12 h-12 rounded-full object-cover" />
                <div className="ms-4 flex-grow">
                  <p className="font-semibold text-gray-800">
                    {t('profile.history.sentTo')} <span className="font-bold">{tx.recipientName}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(tx.date).toLocaleString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="ms-auto text-end font-bold text-rose-500 flex items-center">
                  -{tx.amount} <FlowerIcon className="w-6 h-6" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 px-4 text-gray-500">
              <FlowerIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">{t('profile.history.emptyTitle')}</h3>
              <p className="mt-2">{t('profile.history.emptyBody')}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const BuyPetalsModal: React.FC<{
    onClose: () => void;
    onBuy: (amount: number) => void;
}> = ({ onClose, onBuy }) => {
    const { t } = useTranslation();
    const [customAmount, setCustomAmount] = useState('');
    const customPrice = (Number(customAmount) * 0.02).toFixed(2);

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
                <button onClick={onClose} className="absolute top-4 end-4 text-gray-400 hover:text-gray-600">
                    <XIcon className="w-6 h-6" />
                </button>
                <PetalIcon className="w-16 h-16 text-rose-400 mx-auto" />
                <h2 className="font-display text-2xl font-bold mt-4 text-gray-800">{t('profile.petals.shopTitle')}</h2>
                <p className="text-gray-500 mt-2 mb-6">{t('profile.petals.shopSubtitle')}</p>
                
                <div className="space-y-3">
                    {petalPacks.map(pack => (
                        <div
                            key={pack.amount}
                            className="relative w-full text-start p-4 rounded-xl border-2 font-semibold bg-white border-gray-300"
                        >
                            {pack.popular && (
                                <div className="absolute top-0 end-4 -translate-y-1/2 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                                    <SparklesIcon className="w-4 h-4" /> {t('profile.petals.popular')}
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-xl flex items-center gap-1"><PetalIcon className="w-6 h-6" /> {pack.amount} {t('profile.petals.petals')}</span>
                                    <p className="text-sm text-gray-500 font-normal">{pack.price}</p>
                                </div>
                                <button
                                    onClick={() => onBuy(pack.amount)}
                                    className="bg-rose-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-rose-600 transition shadow-md active:scale-95"
                                >
                                    {t('profile.petals.buy')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="my-6 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-sm text-gray-500">{t('profile.petals.or')}</span>
                    </div>
                </div>

                <div className="space-y-3">
                     <h3 className="font-semibold text-lg text-gray-800">{t('profile.petals.customAmount')}</h3>
                     <div className="flex items-center gap-3">
                        <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder={t('profile.petals.customPlaceholder')}
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-lg"
                            min="1"
                        />
                        <button
                            onClick={() => onBuy(Number(customAmount))}
                            disabled={!customAmount || Number(customAmount) <= 0}
                            className="bg-rose-500 text-white font-bold py-3 px-5 rounded-lg hover:bg-rose-600 transition shadow-md active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {t('profile.petals.buy')}
                        </button>
                    </div>
                    {Number(customAmount) > 0 && (
                        <p className="text-sm text-gray-500">{t('profile.petals.estimatedPrice')}: {customPrice}€</p>
                    )}
                </div>
                
            </motion.div>
        </motion.div>
    );
};

const EditInterestsModal: React.FC<{
  currentInterests: string[];
  onClose: () => void;
  onSave: (interests: string[]) => void;
}> = ({ currentInterests, onClose, onSave }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string[]>(currentInterests);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleInterest = (interest: string) => {
    if (selected.includes(interest)) {
      setSelected(selected.filter(i => i !== interest));
    } else if (selected.length < 5) { // Assuming a limit of 5
      setSelected([...selected, interest]);
    }
  };
  
  const filteredInterests = allInterests.filter(i => i.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  return (
    <motion.div
        className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-md relative flex flex-col h-[70vh]"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
        >
            <button onClick={onClose} className="absolute top-4 end-4 text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
            <h2 className="font-display text-2xl font-bold">{t('onboarding.interests.title')}</h2>
            <p className="text-gray-500 mt-1">{t('onboarding.interests.subtitle', { count: 5 })}</p>
            <div className="relative my-4">
                <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('onboarding.interests.searchPlaceholder')}
                    className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                />
            </div>
            <div className="flex flex-wrap gap-3 mt-2 flex-grow overflow-y-auto pr-2 -mr-2">
                {filteredInterests.map(interest => {
                    const isSelected = selected.includes(interest);
                    return (
                        <button
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            className={`px-4 py-2 rounded-full font-semibold border-2 transition-colors ${isSelected ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}
                        >
                            {interest}
                        </button>
                    );
                })}
            </div>
            <div className="flex gap-4 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-3 px-4 rounded-lg text-gray-700 bg-gray-200 font-semibold hover:bg-gray-300 transition">{t('common.cancel')}</button>
                <button
                    onClick={handleSave}
                    disabled={selected.length < 3}
                    className="flex-1 py-3 px-4 rounded-lg text-white bg-rose-500 font-semibold hover:bg-rose-600 transition disabled:bg-gray-300"
                >
                    {t('common.save')} ({selected.length}/5)
                </button>
            </div>
        </motion.div>
    </motion.div>
  );
};


const ProfileView: React.FC = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(initialUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showBuyPetalsModal, setShowBuyPetalsModal] = useState(false);
  const [showInterestsModal, setShowInterestsModal] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error("Failed to load profile from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error("Failed to save profile to localStorage:", error);
    }
  }, [profile]);
  
  const handleEditToggle = () => {
    if (isEditing) {
      setProfile(editedProfile);
      setIsEditing(false);
    } else {
      setEditedProfile(profile);
      setIsEditing(true);
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  };

  const handleInterestsSave = (newInterests: string[]) => {
      setEditedProfile({ ...editedProfile, interests: newInterests });
  };

  const handleBuyPetals = (amount: number) => {
    if (amount <= 0) return;
    setProfile(prev => ({...prev, petalBalance: (prev.petalBalance || 0) + amount }));
    setShowBuyPetalsModal(false);
  };

  return (
    <div className="bg-gray-50">
      <div className="relative">
        <img src={profile.photos[0]} alt={profile.name} className="w-full h-96 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      
      <div className="p-6 -mt-16">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h1 className="font-display text-4xl font-bold">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedProfile.name}
                onChange={handleInputChange}
                className="w-full text-4xl font-bold font-display border-b-2 border-gray-200 focus:outline-none focus:border-rose-500 transition-colors"
                autoFocus
              />
            ) : (
              `${profile.name}, ${profile.age}`
            )}
          </h1>
          
          <div className="my-6">
            <h2 className="font-semibold text-lg text-gray-800 mb-2">{t('profile.aboutMe')}</h2>
            {isEditing ? (
                <textarea
                    name="bio"
                    value={editedProfile.bio}
                    onChange={handleInputChange}
                    className="w-full h-32 p-3 text-gray-600 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none transition-colors"
                    maxLength={500}
                />
            ) : (
                <p className="text-gray-600">{profile.bio}</p>
            )}
          </div>
          
          <div className="my-6">
            <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg text-gray-800">{t('profile.interests')}</h2>
                {isEditing && (
                    <button onClick={() => setShowInterestsModal(true)} className="p-1.5 text-gray-500 hover:text-rose-500 rounded-full hover:bg-rose-100 transition-colors">
                        <EditIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
              {(isEditing ? editedProfile.interests : profile.interests).map(interest => (
                <span key={interest} className="bg-rose-100 text-rose-800 text-sm font-medium px-3 py-1 rounded-full">
                  {interest}
                </span>
              ))}
            </div>
          </div>
          
          <div className="my-6">
              <LanguageSwitcher as="div" />
          </div>

          <div className="my-6 space-y-4">
            {/* Petal Balance */}
            <div>
              <h2 className="font-semibold text-lg text-gray-800 mb-2">{t('profile.petals.yourPetals')}</h2>
              <div className="flex items-center justify-between bg-gradient-to-r from-violet-50 to-purple-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2">
                      <PetalIcon className="w-8 h-8" />
                      <div>
                          <span className="text-2xl font-bold text-gray-800">{profile.petalBalance}</span>
                          <span className="text-sm text-gray-600 ms-1">{t('profile.petals.petals')}</span>
                      </div>
                  </div>
                  <button 
                      onClick={() => setShowBuyPetalsModal(true)}
                      className="bg-violet-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-violet-600 transition shadow-md active:scale-95"
                  >
                      {t('profile.petals.buy')}
                  </button>
              </div>
            </div>

            {/* Flower Balance */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg text-gray-800">{t('profile.flowers.yourFlowers')}</h2>
                <button 
                  onClick={() => setShowHistoryModal(true)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-rose-600 bg-rose-100 hover:bg-rose-200 px-3 py-1.5 rounded-lg transition-colors active:scale-95"
                >
                  <HistoryIcon className="w-4 h-4" />
                  {t('profile.flowers.sendHistory')}
                </button>
              </div>
              <div className="flex items-center justify-between bg-gradient-to-r from-rose-50 to-amber-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2">
                      <FlowerIcon className="w-8 h-8" />
                      <div>
                          <span className="text-2xl font-bold text-gray-800">{profile.flowerBalance}</span>
                          <span className="text-sm text-gray-600 ms-1">{t('profile.flowers.flowers')}</span>
                      </div>
                  </div>
                  <button className="bg-rose-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-rose-600 transition shadow-md active:scale-95">
                      {t('profile.flowers.withdraw')}
                  </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 my-6">
            {profile.photos.slice(1).map((photo, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden">
                <img src={photo} alt={`${profile.name} ${index + 2}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          
          <div className="flex space-x-4 mt-6">
            {isEditing ? (
                <>
                    <button onClick={handleCancelEdit} className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
                        {t('common.cancel')}
                    </button>
                    <button onClick={handleEditToggle} className="flex-1 bg-rose-500 text-white font-bold py-3 rounded-lg hover:bg-rose-600 transition">
                        {t('common.save')}
                    </button>
                </>
            ) : (
                <>
                    <button onClick={handleEditToggle} className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
                      {t('profile.editProfile')}
                    </button>
                    <button className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
                      {t('profile.settings')}
                    </button>
                </>
            )}
          </div>
        </div>
      </div>
       <AnimatePresence>
        {showHistoryModal && (
          <FlowerHistoryModal
            transactions={flowerTransactions}
            onClose={() => setShowHistoryModal(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showBuyPetalsModal && (
            <BuyPetalsModal
                onClose={() => setShowBuyPetalsModal(false)}
                onBuy={handleBuyPetals}
            />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showInterestsModal && isEditing && (
            <EditInterestsModal
                currentInterests={editedProfile.interests}
                onClose={() => setShowInterestsModal(false)}
                onSave={handleInterestsSave}
            />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileView;
