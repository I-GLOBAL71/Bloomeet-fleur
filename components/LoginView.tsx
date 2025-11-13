
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleIcon, LogoIcon, AtSignIcon, ArrowLeftIcon } from './Icons';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from './LanguageSwitcher';

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
  const { t } = useTranslation();
  const [currentImage, setCurrentImage] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [view, setView] = useState<'options' | 'emailInput' | 'emailSent'>('options');
  const [email, setEmail] = useState('');

  const inspiringWords = [
    t('login.word1'),
    t('login.word2'),
    t('login.word3'),
    t('login.word4'),
  ];

  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 7000);
    return () => clearInterval(imageTimer);
  }, []);

  useEffect(() => {
    const wordTimer = setInterval(() => {
        setCurrentWordIndex(prev => (prev + 1) % inspiringWords.length);
    }, 3000);
    return () => clearInterval(wordTimer);
  }, [inspiringWords]);

  const handleMagicLink = () => {
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      // Simulate sending a magic link
      setView('emailSent');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.3, delayChildren: 0.5 }
    }
  };

  const itemVariants = { 
    hidden: { opacity: 0, y: 20 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } } 
  };
  
  const authViewVariants = {
      initial: { opacity: 0, y: 30, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -30, scale: 0.98 },
  };
  const authViewTransition = { type: "spring", stiffness: 300, damping: 30 };


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
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="absolute top-4 end-4 z-10">
          <LanguageSwitcher as="button" />
      </div>

      <div className="relative h-screen w-full flex flex-col justify-end items-start p-8 sm:p-12 pb-24 text-white">
        <motion.div 
            className="w-full max-w-lg"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <motion.div 
            className="flex items-center gap-4 mb-4"
            variants={itemVariants}
          >
            <LogoIcon className="w-12 h-12 text-rose-400" />
            <h1 className="font-display text-7xl font-bold">{t('login.title')}</h1>
          </motion.div>
          
          <motion.div 
            className="mt-6 text-4xl font-light h-12"
            variants={itemVariants}
          >
            <AnimatePresence mode="wait">
                <motion.span
                    key={currentWordIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="block"
                >
                    {inspiringWords[currentWordIndex]}
                </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.div 
            className="mt-12 max-w-sm relative h-56"
            variants={itemVariants}
          >
            <AnimatePresence mode="wait">
              {view === 'options' && (
                <motion.div
                  key="options"
                  className="absolute w-full space-y-4"
                  variants={authViewVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={authViewTransition}
                >
                   <motion.button
                      onClick={onLogin}
                      className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-bold py-4 px-6 rounded-full shadow-lg transition-all duration-300 transform"
                      whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <GoogleIcon className="w-6 h-6" />
                      {t('login.continueWithGoogle')}
                    </motion.button>
                     <button
                      onClick={() => setView('emailInput')}
                      className="w-full text-white/80 hover:text-white font-semibold transition-colors"
                    >
                      {t('login.continueWithEmail')}
                    </button>
                </motion.div>
              )}
              {view === 'emailInput' && (
                <motion.div
                  key="emailInput"
                  className="absolute w-full space-y-4"
                  variants={authViewVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={authViewTransition}
                >
                    <div className="relative">
                       <AtSignIcon className="w-6 h-6 absolute start-4 top-1/2 -translate-y-1/2 text-white/50"/>
                       <input 
                         type="email"
                         placeholder={t('login.emailPlaceholder')}
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="w-full bg-white/10 border border-white/20 rounded-full py-4 ps-12 pe-4 text-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
                       />
                    </div>
                     <motion.button
                        onClick={handleMagicLink}
                        className="w-full font-bold py-4 px-6 rounded-full shadow-lg transition-all duration-300 transform bg-gradient-to-r from-rose-500 via-orange-400 to-yellow-400 disabled:opacity-60"
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(236, 72, 153, 0.3)" }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!email}
                      >
                        {t('login.magicLinkButton')}
                      </motion.button>
                      <button
                        onClick={() => setView('options')}
                        className="w-full flex items-center justify-center gap-2 text-white/80 hover:text-white font-semibold transition-colors"
                      >
                        <ArrowLeftIcon className="w-5 h-5"/>
                        {t('login.back')}
                      </button>
                </motion.div>
              )}
               {view === 'emailSent' && (
                <motion.div
                  key="emailSent"
                  className="absolute w-full text-center"
                  variants={authViewVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={authViewTransition}
                >
                    <div className="p-4 bg-green-500/20 border border-green-400 rounded-xl">
                        <h3 className="text-xl font-bold text-white">{t('login.magicLinkSentTitle')}</h3>
                        <p className="mt-2 text-white/90">{t('login.magicLinkSentBody')}</p>
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
           <motion.p
             variants={itemVariants}
             className="mt-8 text-xs text-gray-400 max-w-sm"
            >
                {t('login.termsPrefix')} <a href="#" className="underline hover:text-white transition">{t('login.termsOfUse')}</a> {t('login.termsAnd')} <a href="#" className="underline hover:text-white transition">{t('login.privacyPolicy')}</a>.
            </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginView;