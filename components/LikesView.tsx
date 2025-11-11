
import React from 'react';

const likedByUsers = [
  { id: 1, name: 'Amélie', photo: 'https://picsum.photos/seed/like1/400/400' },
  { id: 2, name: 'Gabriel', photo: 'https://picsum.photos/seed/like2/400/400' },
  { id: 3, name: 'Léa', photo: 'https://picsum.photos/seed/like3/400/400' },
  { id: 4, name: 'Hugo', photo: 'https://picsum.photos/seed/like4/400/400' },
  { id: 5, name: 'Manon', photo: 'https://picsum.photos/seed/like5/400/400' },
  { id: 6, name: 'Raphaël', photo: 'https://picsum.photos/seed/like6/400/400' },
  { id: 7, name: 'Emma', photo: 'https://picsum.photos/seed/like7/400/400' },
  { id: 8, name: 'Louis', photo: 'https://picsum.photos/seed/like8/400/400' },
];

const LikesView: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="font-display text-4xl font-bold text-gray-800 mb-6">They like you</h1>
      <div className="grid grid-cols-2 gap-4">
        {likedByUsers.map(user => (
          <div key={user.id} className="relative aspect-square rounded-xl overflow-hidden group shadow-lg">
            <img src={user.photo} alt={user.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-3 left-3 text-white">
              <p className="font-bold text-lg">{user.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikesView;
