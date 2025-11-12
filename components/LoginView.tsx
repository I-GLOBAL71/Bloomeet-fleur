
import React, { useState, useEffect } from 'react';
import { GoogleIcon, LogoIcon } from './Icons';

interface LoginViewProps {
  onLogin: () => void;
}

const backgroundImages = [
  'https://images.pexels.com/photos/1766933/pexels-photo-1766933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/3299386/pexels-photo-3299386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1024989/pexels-photo-1024989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
];

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {backgroundImages.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 h-full w-full bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out"
          style={{ 
            backgroundImage: `url(${src})`,
            opacity: index === currentImage ? 1 : 0,
          }}
        >
          <div className="w-full h-full bg-image-pan" style={{
             backgroundImage: `url(${src})`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
          }}/>
        </div>
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <div className="relative h-screen w-full flex flex-col justify-end items-start p-8 sm:p-12 pb-16 text-white">
        <div className="w-full max-w-lg content-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <LogoIcon className="w-12 h-12 text-rose-400" />
            <h1 className="font-display text-7xl font-bold">Aura</h1>
          </div>
          <p className="mt-4 text-3xl font-light">L'art de la rencontre.</p>
          <p className="mt-4 text-md text-gray-200 max-w-md">
            Conçu pour ceux qui recherchent des liens authentiques. Un espace pour des conversations sincères et une compréhension plus profonde.
          </p>
          
          <div className="mt-12 space-y-4 max-w-sm">
            <button
              onClick={onLogin}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-bold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <GoogleIcon className="w-6 h-6" />
              Continuer avec Google
            </button>
            <button
              onClick={onLogin}
              className="w-full text-sm text-gray-300 font-semibold py-3 px-6 rounded-full hover:bg-white/10 transition-colors duration-300"
            >
              Découvrir d'autres options
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;