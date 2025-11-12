import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlowerIcon, HistoryIcon, XIcon, PlusIcon, SparklesIcon } from './Icons';
import { FlowerTransaction } from '../types';

const userProfile = {
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
};

const flowerTransactions: FlowerTransaction[] = [
  { id: 1, recipientName: 'Chloé', recipientAvatar: 'https://picsum.photos/seed/woman1/100/100', amount: 5, date: '2024-07-20T10:30:00Z' },
  { id: 2, recipientName: 'Jasmine', recipientAvatar: 'https://picsum.photos/seed/woman2/100/100', amount: 10, date: '2024-07-19T18:00:00Z' },
  { id: 3, recipientName: 'Lucas', recipientAvatar: 'https://picsum.photos/seed/man1/100/100', amount: 1, date: '2024-07-18T12:00:00Z' },
  { id: 4, recipientName: 'Théo', recipientAvatar: 'https://picsum.photos/seed/man2/100/100', amount: 20, date: '2024-07-15T22:15:00Z' },
];

const flowerPacks = [
  { amount: 50, price: '4.99€', popular: false },
  { amount: 120, price: '9.99€', popular: true },
  { amount: 300, price: '21.99€', popular: false },
];

const FlowerHistoryModal: React.FC<{ transactions: FlowerTransaction[]; onClose: () => void; }> = ({ transactions, onClose }) => {
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
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="font-display text-2xl font-bold mb-4">Historique des envois</h2>
        
        <div className="flex-grow overflow-y-auto space-y-3 pr-2 -mr-2">
          {transactions.length > 0 ? (
            transactions.map(tx => (
              <div key={tx.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <img src={tx.recipientAvatar} alt={tx.recipientName} className="w-12 h-12 rounded-full object-cover" />
                <div className="ml-4 flex-grow">
                  <p className="font-semibold text-gray-800">
                    Envoyé à <span className="font-bold">{tx.recipientName}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(tx.date).toLocaleString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="ml-auto text-right font-bold text-rose-500">
                  -{tx.amount} <span className="text-xl">💐</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 px-4 text-gray-500">
              <FlowerIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">Aucun envoi</h3>
              <p className="mt-2">L'historique de vos fleurs envoyées apparaîtra ici.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const BuyFlowersModal: React.FC<{
    onClose: () => void;
    onBuy: (amount: number) => void;
}> = ({ onClose, onBuy }) => {
    const [customAmount, setCustomAmount] = useState('');
    const customPrice = (Number(customAmount) * 0.1).toFixed(2);

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
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XIcon className="w-6 h-6" />
                </button>
                <FlowerIcon className="w-16 h-16 text-rose-400 mx-auto" />
                <h2 className="font-display text-2xl font-bold mt-4 text-gray-800">Boutique de Fleurs</h2>
                <p className="text-gray-500 mt-2 mb-6">Rechargez votre solde pour envoyer plus de cadeaux.</p>
                
                <div className="space-y-3">
                    {flowerPacks.map(pack => (
                        <div
                            key={pack.amount}
                            className="relative w-full text-left p-4 rounded-xl border-2 font-semibold bg-white border-gray-300"
                        >
                            {pack.popular && (
                                <div className="absolute top-0 right-4 -translate-y-1/2 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                                    <SparklesIcon className="w-4 h-4" /> Populaire
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-xl">💐 {pack.amount} Fleurs</span>
                                    <p className="text-sm text-gray-500 font-normal">{pack.price}</p>
                                </div>
                                <button
                                    onClick={() => onBuy(pack.amount)}
                                    className="bg-rose-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-rose-600 transition shadow-md active:scale-95"
                                >
                                    Acheter
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
                        <span className="bg-white px-2 text-sm text-gray-500">OU</span>
                    </div>
                </div>

                <div className="space-y-3">
                     <h3 className="font-semibold text-lg text-gray-800">Quantité personnalisée</h3>
                     <div className="flex items-center gap-3">
                        <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder="Ex: 75"
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-lg"
                            min="1"
                        />
                        <button
                            onClick={() => onBuy(Number(customAmount))}
                            disabled={!customAmount || Number(customAmount) <= 0}
                            className="bg-rose-500 text-white font-bold py-3 px-5 rounded-lg hover:bg-rose-600 transition shadow-md active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Acheter
                        </button>
                    </div>
                    {Number(customAmount) > 0 && (
                        <p className="text-sm text-gray-500">Prix estimé : {customPrice}€</p>
                    )}
                </div>
                
            </motion.div>
        </motion.div>
    );
};

const ProfileView: React.FC = () => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showBuyFlowersModal, setShowBuyFlowersModal] = useState(false);
  const [flowerBalance, setFlowerBalance] = useState(userProfile.flowerBalance);

  const handleBuyFlowers = (amount: number) => {
    if (amount <= 0) return;
    setFlowerBalance(prev => prev + amount);
    setShowBuyFlowersModal(false);
  };

  return (
    <div className="bg-gray-50">
      <div className="relative">
        <img src={userProfile.photos[0]} alt={userProfile.name} className="w-full h-96 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      
      <div className="p-6 -mt-16">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h1 className="font-display text-4xl font-bold">{userProfile.name}, {userProfile.age}</h1>
          
          <div className="my-6">
            <h2 className="font-semibold text-lg text-gray-800 mb-2">About me</h2>
            <p className="text-gray-600">{userProfile.bio}</p>
          </div>
          
          <div className="my-6">
            <h2 className="font-semibold text-lg text-gray-800 mb-2">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {userProfile.interests.map(interest => (
                <span key={interest} className="bg-rose-100 text-rose-800 text-sm font-medium px-3 py-1 rounded-full">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="my-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg text-gray-800">Vos Fleurs</h2>
              <button 
                onClick={() => setShowHistoryModal(true)}
                className="flex items-center gap-1.5 text-sm font-semibold text-rose-600 bg-rose-100 hover:bg-rose-200 px-3 py-1.5 rounded-lg transition-colors active:scale-95"
              >
                <HistoryIcon className="w-4 h-4" />
                Historique
              </button>
            </div>
            <div className="flex items-center justify-between bg-gradient-to-r from-rose-50 to-amber-50 p-4 rounded-xl">
                <div className="flex items-center gap-2">
                    <FlowerIcon className="w-8 h-8 text-rose-500" />
                    <div>
                        <span className="text-2xl font-bold text-gray-800">{flowerBalance}</span>
                        <span className="text-sm text-gray-600 ml-1">fleurs</span>
                    </div>
                    <button 
                        onClick={() => setShowBuyFlowersModal(true)}
                        className="p-2 bg-white/70 rounded-full text-rose-500 hover:bg-white shadow-sm transition-all active:scale-90"
                        aria-label="Acheter des fleurs"
                    >
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
                <button className="bg-rose-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-rose-600 transition shadow-md active:scale-95">
                    Retirer
                </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 my-6">
            {userProfile.photos.slice(1).map((photo, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden">
                <img src={photo} alt={`${userProfile.name} ${index + 2}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          
          <div className="flex space-x-4 mt-6">
            <button className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
              Edit Profile
            </button>
            <button className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
              Settings
            </button>
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
        {showBuyFlowersModal && (
            <BuyFlowersModal
                onClose={() => setShowBuyFlowersModal(false)}
                onBuy={handleBuyFlowers}
            />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileView;