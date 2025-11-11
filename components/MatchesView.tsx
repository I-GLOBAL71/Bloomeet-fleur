
import React from 'react';

const matches = [
  { id: 1, name: 'Chloé', lastMessage: 'Hey! I liked your hiking photo. Where was it taken?', avatar: 'https://picsum.photos/seed/woman1/100/100', unread: 2 },
  { id: 2, name: 'Lucas', lastMessage: 'You play guitar too? We should jam sometime!', avatar: 'https://picsum.photos/seed/man1/100/100', unread: 0 },
  { id: 3, name: 'Jasmine', lastMessage: 'I saw you like old movies. Have you seen Casablanca?', avatar: 'https://picsum.photos/seed/woman2/100/100', unread: 1 },
];

const MatchesView: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="font-display text-4xl font-bold text-gray-800 mb-6">Matches</h1>
      <div className="space-y-4">
        {matches.map(match => (
          <div key={match.id} className="flex items-center p-3 bg-white rounded-xl shadow-sm hover:bg-rose-50 transition-colors cursor-pointer">
            <div className="relative">
              <img src={match.avatar} alt={match.name} className="w-16 h-16 rounded-full object-cover" />
              {match.unread > 0 && <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-rose-500 border-2 border-white"></span>}
            </div>
            <div className="ml-4 flex-grow">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{match.name}</h3>
                <span className="text-xs text-gray-400">2h ago</span>
              </div>
              <p className={`text-sm text-gray-500 truncate ${match.unread > 0 ? 'font-semibold' : ''}`}>{match.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchesView;
