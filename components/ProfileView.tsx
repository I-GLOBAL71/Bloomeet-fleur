
import React from 'react';

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
};

const ProfileView: React.FC = () => {
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
    </div>
  );
};

export default ProfileView;
