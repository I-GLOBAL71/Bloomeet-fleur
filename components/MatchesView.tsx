
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Match, Message } from '../types';
import ChatView from './ChatView';

const CURRENT_USER_ID = 99; // Mock current user

const initialMatches: Match[] = [
  { 
    id: 1, 
    name: 'Chloé', 
    avatar: 'https://picsum.photos/seed/woman1/100/100', 
    unread: 2, 
    flowerBalance: 15,
    messages: [
      { id: 1, senderId: 1, text: "Salut ! J'ai vu qu'on avait plusieurs centres d'intérêt en commun 😊", timestamp: "10:30", type: 'text' },
      { id: 2, senderId: CURRENT_USER_ID, text: "Hey ! Oui, c'est cool ! La randonnée surtout ?", timestamp: "10:31", type: 'text' },
      { id: 3, senderId: 1, text: "Exactement ! J'ai adoré ta photo au sommet. C'était où ?", timestamp: "10:32", type: 'text' },
      { id: 4, senderId: 1, text: "On devrait y aller ensemble un de ces jours !", timestamp: "10:32", type: 'text' },
    ] 
  },
  { 
    id: 2, 
    name: 'Lucas', 
    avatar: 'https://picsum.photos/seed/man1/100/100', 
    unread: 0,
    flowerBalance: 40,
    messages: [
       { id: 5, senderId: CURRENT_USER_ID, text: "Tu joues de la guitare aussi ? Génial !", timestamp: "Hier", type: 'text' },
       { id: 6, senderId: 2, text: "Oui ! Depuis 10 ans. On devrait se faire une session jam un de ces quatre !", timestamp: "Hier", type: 'text' },
    ]
  },
  { 
    id: 3, 
    name: 'Jasmine', 
    avatar: 'https://picsum.photos/seed/woman2/100/100', 
    unread: 1,
    flowerBalance: 5,
    messages: [
       { id: 7, senderId: 3, text: "J'ai vu que tu aimais les vieux films. Tu as vu Casablanca ?", timestamp: "14:05", type: 'text' },
    ]
  },
];

const MatchesView: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [selectedChat, setSelectedChat] = useState<Match | null>(null);
  const [currentUserFlowerBalance, setCurrentUserFlowerBalance] = useState(250);

  const handleUpdateMessages = (matchId: number, newMessages: Message[]) => {
    const updatedMatches = matches.map(match =>
      match.id === matchId ? { ...match, messages: newMessages, unread: 0 } : match
    );
    setMatches(updatedMatches);

    if (selectedChat && selectedChat.id === matchId) {
      setSelectedChat(prev => prev ? { ...prev, messages: newMessages } : null);
    }
  };

  const getLastMessage = (match: Match): { text: string; timestamp: string } => {
    if (match.messages.length === 0) {
      return { text: "Commencez la conversation !", timestamp: "" };
    }
    const lastMsg = match.messages[match.messages.length - 1];
    if (lastMsg.type === 'gift') {
      return { text: `💐 ${lastMsg.text}`, timestamp: lastMsg.timestamp };
    }
    return { text: lastMsg.text, timestamp: lastMsg.timestamp };
  };

  return (
    <div className="relative h-full overflow-hidden">
      <div className="p-4">
        <h1 className="font-display text-4xl font-bold text-gray-800 mb-6">Matches</h1>
        <div className="space-y-4">
          {matches.map(match => {
            const lastMessage = getLastMessage(match);
            return (
              <div 
                key={match.id} 
                className="flex items-center p-3 bg-white rounded-xl shadow-sm hover:bg-rose-50 transition-colors cursor-pointer"
                onClick={() => setSelectedChat(match)}
              >
                <div className="relative">
                  <img src={match.avatar} alt={match.name} className="w-16 h-16 rounded-full object-cover" />
                  {match.unread > 0 && <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-rose-500 border-2 border-white"></span>}
                </div>
                <div className="ml-4 flex-grow overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">{match.name}</h3>
                    <span className="text-xs text-gray-400">{lastMessage.timestamp}</span>
                  </div>
                  <p className={`text-sm text-gray-500 truncate ${match.unread > 0 ? 'font-semibold text-gray-800' : ''}`}>{lastMessage.text}</p>
                </div>
              </div>
            )}
          )}
        </div>
      </div>
      <AnimatePresence>
        {selectedChat && (
          <ChatView 
            key={selectedChat.id}
            match={selectedChat}
            onClose={() => setSelectedChat(null)}
            onUpdateMessages={handleUpdateMessages}
            currentUserFlowerBalance={currentUserFlowerBalance}
            onUpdateFlowerBalance={setCurrentUserFlowerBalance}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MatchesView;
